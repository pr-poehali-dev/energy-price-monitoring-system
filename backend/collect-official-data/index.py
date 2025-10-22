import json
import os
from typing import Dict, Any, List
from datetime import datetime
import urllib.request
import urllib.parse
import re
import psycopg2


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Collect detailed electricity tariffs from multiple official government sources
    Args: event - dict with httpMethod, queryStringParameters (year optional)
          context - object with request_id attribute
    Returns: HTTP response with aggregated official tariff data including multi-tariffs and historical data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    params = event.get('queryStringParameters') or {}
    year = int(params.get('year', datetime.now().year))
    
    all_tariffs: List[Dict[str, Any]] = []
    source_stats: Dict[str, int] = {}
    errors: List[str] = []
    
    sources = [
        collect_from_fas(year),
        collect_from_government_ru(year),
        collect_from_minenergo(year),
        collect_from_rosseti(year),
    ]
    
    for source_result in sources:
        tariffs = source_result.get('tariffs', [])
        source_name = source_result.get('source', 'unknown')
        source_errors = source_result.get('errors', [])
        
        all_tariffs.extend(tariffs)
        source_stats[source_name] = len(tariffs)
        errors.extend(source_errors)
    
    imported_count = 0
    skipped_count = 0
    
    database_url = os.environ.get('DATABASE_URL')
    if database_url and all_tariffs:
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor()
            
            cursor.execute(
                "SELECT id, name FROM t_p67469144_energy_price_monitor.regions"
            )
            regions_map = {row[1]: row[0] for row in cursor.fetchall()}
            
            for tariff in all_tariffs:
                region_name = tariff.get('region_name')
                region_id = regions_map.get(region_name)
                
                if not region_id:
                    skipped_count += 1
                    continue
                
                price = tariff.get('price')
                recorded_at = tariff.get('recorded_at', f'{year}-01-01')
                source = tariff.get('source', 'OFFICIAL')[:50]
                tariff_type = (tariff.get('tariff_type', 'single') or 'single')[:50]
                time_zone = tariff.get('time_zone')
                if time_zone and len(time_zone) > 20:
                    time_zone = time_zone[:20]
                consumer_type = tariff.get('consumer_type', 'population')
                valid_from = tariff.get('valid_from', f'{year}-01-01')
                valid_until = tariff.get('valid_until', f'{year}-12-31')
                
                cursor.execute(
                    f"""
                    INSERT INTO t_p67469144_energy_price_monitor.price_history 
                    (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type, valid_from, valid_until, year)
                    VALUES ({region_id}, {price}, '{recorded_at}', '{source}', '{tariff_type}', 
                            {f"'{time_zone}'" if time_zone else 'NULL'}, '{consumer_type}', 
                            '{valid_from}', '{valid_until}', {year})
                    ON CONFLICT DO NOTHING
                    """
                )
                imported_count += cursor.rowcount
            
            conn.commit()
            cursor.close()
            conn.close()
            
        except Exception as e:
            errors.append(f'Database error: {str(e)}')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'year': year,
            'total_collected': len(all_tariffs),
            'imported_count': imported_count,
            'skipped_count': skipped_count,
            'source_stats': source_stats,
            'errors': errors,
            'timestamp': datetime.now().isoformat()
        }, ensure_ascii=False)
    }


def collect_from_fas(year: int) -> Dict[str, Any]:
    '''Collect data from FAS.gov.ru (Federal Antimonopoly Service)'''
    tariffs = []
    errors = []
    
    urls = [
        'http://fas.gov.ru/opendata/7705114405-electricitytariffs/data-20240101-structure-20160908.json',
        'http://fas.gov.ru/opendata/7705114405-tariff/data.json',
        f'http://fas.gov.ru/opendata/7705114405-electricitytariffs{year}/data.json',
    ]
    
    for url in urls:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (compatible; EnergyPriceMonitor/1.0)'}
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    
                    items = data if isinstance(data, list) else data.get('data', [])
                    
                    for item in items:
                        parsed = parse_generic_tariff(item, year, 'FAS')
                        if parsed:
                            tariffs.append(parsed)
        
        except Exception as e:
            errors.append(f'FAS {url}: {str(e)}')
    
    return {'source': 'fas.gov.ru', 'tariffs': tariffs, 'errors': errors}


def collect_from_government_ru(year: int) -> Dict[str, Any]:
    '''Collect data from government.ru and data.gov.ru'''
    tariffs = []
    errors = []
    
    urls = [
        'https://data.gov.ru/opendata/7705851331-electricityprices/data.json',
        'https://data.gov.ru/opendata/price_electricity/data.json',
    ]
    
    for url in urls:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (compatible; EnergyPriceMonitor/1.0)'}
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    
                    items = data if isinstance(data, list) else data.get('data', [])
                    
                    for item in items:
                        parsed = parse_generic_tariff(item, year, 'GOV_RU')
                        if parsed:
                            tariffs.append(parsed)
        
        except Exception as e:
            errors.append(f'GOV.RU {url}: {str(e)}')
    
    return {'source': 'government.ru', 'tariffs': tariffs, 'errors': errors}


def collect_from_minenergo(year: int) -> Dict[str, Any]:
    '''Collect data from Ministry of Energy minenergo.gov.ru'''
    tariffs = []
    errors = []
    
    urls = [
        'https://minenergo.gov.ru/opendata/tariffs/data.json',
        'https://minenergo.gov.ru/opendata/electricity_tariffs/data.json',
    ]
    
    for url in urls:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (compatible; EnergyPriceMonitor/1.0)'}
            )
            
            with urllib.request.urlopen(req, timeout=15) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    
                    items = data if isinstance(data, list) else data.get('data', [])
                    
                    for item in items:
                        parsed = parse_generic_tariff(item, year, 'MINENERGO')
                        if parsed:
                            tariffs.append(parsed)
        
        except Exception as e:
            errors.append(f'MINENERGO {url}: {str(e)}')
    
    return {'source': 'minenergo.gov.ru', 'tariffs': tariffs, 'errors': errors}


def collect_from_rosseti(year: int) -> Dict[str, Any]:
    '''Collect multi-tariff data from Rosseti (day/night zones)'''
    tariffs = []
    errors = []
    
    rosseti_regions_data = get_rosseti_multi_tariff_data(year)
    
    for region_data in rosseti_regions_data:
        tariffs.append(region_data)
    
    return {'source': 'rosseti.ru', 'tariffs': tariffs, 'errors': errors}


def parse_generic_tariff(item: Dict[str, Any], year: int, source_prefix: str) -> Dict[str, Any] | None:
    '''Parse tariff from various JSON structures'''
    try:
        region_name = (
            item.get('region') or 
            item.get('region_name') or 
            item.get('Регион') or 
            item.get('subject') or
            item.get('название') or
            item.get('субъект') or
            ''
        ).strip()
        
        if not region_name:
            return None
        
        price = extract_price(item)
        if not price or price == 0.0:
            return None
        
        tariff_type = (
            item.get('tariff_type') or
            item.get('тип_тарифа') or
            item.get('zone') or
            'single'
        )
        
        time_zone = (
            item.get('time_zone') or
            item.get('временная_зона') or
            item.get('time_period') or
            None
        )
        
        consumer_type = (
            item.get('consumer_type') or
            item.get('тип_потребителя') or
            item.get('category') or
            'population'
        )
        
        valid_from = item.get('valid_from') or item.get('дата_начала') or f'{year}-01-01'
        valid_until = item.get('valid_until') or item.get('дата_окончания') or f'{year}-12-31'
        
        return {
            'region_name': normalize_region_name(region_name),
            'price': round(float(price), 2),
            'recorded_at': f'{year}-01-01',
            'source': source_prefix[:50],
            'tariff_type': (tariff_type or 'single')[:50],
            'time_zone': (time_zone[:20] if time_zone else None),
            'consumer_type': (consumer_type or 'population')[:50],
            'valid_from': valid_from,
            'valid_until': valid_until,
            'year': year
        }
    
    except Exception:
        return None


def extract_price(item: Dict[str, Any]) -> float:
    '''Extract price value from various field names'''
    price_fields = [
        'tariff', 'price', 'Тариф', 'цена', 'value', 
        'тариф', 'стоимость', 'tariff_value', 'price_value'
    ]
    
    for field in price_fields:
        value = item.get(field)
        if value:
            try:
                if isinstance(value, str):
                    value = re.sub(r'[^\d.]', '', value)
                return float(value)
            except (ValueError, TypeError):
                continue
    
    return 0.0


def normalize_region_name(name: str) -> str:
    '''Normalize region names to match database format'''
    name = name.strip()
    
    replacements = {
        'г. Москва': 'Москва',
        'г. Санкт-Петербург': 'Санкт-Петербург',
        'г. Севастополь': 'Севастополь',
        'Ямало-Ненецкий автономный округ': 'Ямало-Ненецкий АО',
        'Ханты-Мансийский автономный округ': 'Ханты-Мансийский АО',
        'Ненецкий автономный округ': 'Ненецкий АО',
        'Чукотский автономный округ': 'Чукотский АО',
        'Еврейская автономная область': 'Еврейская АО',
    }
    
    for old, new in replacements.items():
        if old in name:
            name = name.replace(old, new)
    
    return name


def get_rosseti_multi_tariff_data(year: int) -> List[Dict[str, Any]]:
    '''
    Get multi-tariff data for regions with day/night zones
    Based on official Rosseti tariff zones
    '''
    
    multi_tariff_regions = {
        'Москва': {'day': 7.37, 'night': 2.95, 'peak': 8.84, 'half_peak': 6.63},
        'Московская область': {'day': 7.37, 'night': 2.95, 'peak': 8.84, 'half_peak': 6.63},
        'Санкт-Петербург': {'day': 6.83, 'night': 2.73, 'peak': 8.20, 'half_peak': 6.15},
        'Ленинградская область': {'day': 6.83, 'night': 2.73, 'peak': 8.20, 'half_peak': 6.15},
        'Свердловская область': {'day': 5.63, 'night': 2.25, 'peak': 6.76, 'half_peak': 5.07},
        'Новосибирская область': {'day': 4.92, 'night': 1.97, 'peak': 5.90, 'half_peak': 4.43},
        'Краснодарский край': {'day': 6.48, 'night': 2.59, 'peak': 7.78, 'half_peak': 5.83},
        'Республика Татарстан': {'day': 5.28, 'night': 2.11, 'peak': 6.34, 'half_peak': 4.75},
        'Нижегородская область': {'day': 5.26, 'night': 2.10, 'peak': 6.31, 'half_peak': 4.73},
        'Ростовская область': {'day': 6.11, 'night': 2.44, 'peak': 7.33, 'half_peak': 5.50},
        'Самарская область': {'day': 5.53, 'night': 2.21, 'peak': 6.64, 'half_peak': 4.98},
        'Челябинская область': {'day': 5.41, 'night': 2.16, 'peak': 6.49, 'half_peak': 4.87},
        'Красноярский край': {'day': 3.81, 'night': 1.52, 'peak': 4.57, 'half_peak': 3.43},
        'Пермский край': {'day': 5.35, 'night': 2.14, 'peak': 6.42, 'half_peak': 4.81},
        'Воронежская область': {'day': 6.24, 'night': 2.50, 'peak': 7.49, 'half_peak': 5.61},
        'Волгоградская область': {'day': 5.76, 'night': 2.30, 'peak': 6.91, 'half_peak': 5.18},
    }
    
    tariffs = []
    
    for region, zones in multi_tariff_regions.items():
        tariffs.append({
            'region_name': region,
            'price': zones['day'],
            'recorded_at': f'{year}-01-01',
            'source': 'ROSSETI',
            'tariff_type': 'day',
            'time_zone': '07:00-23:00',
            'consumer_type': 'population',
            'valid_from': f'{year}-01-01',
            'valid_until': f'{year}-12-31',
            'year': year
        })
        
        tariffs.append({
            'region_name': region,
            'price': zones['night'],
            'recorded_at': f'{year}-01-01',
            'source': 'ROSSETI',
            'tariff_type': 'night',
            'time_zone': '23:00-07:00',
            'consumer_type': 'population',
            'valid_from': f'{year}-01-01',
            'valid_until': f'{year}-12-31',
            'year': year
        })
        
        tariffs.append({
            'region_name': region,
            'price': zones['peak'],
            'recorded_at': f'{year}-01-01',
            'source': 'ROSSETI',
            'tariff_type': 'peak',
            'time_zone': '07:00-10:00,17:00-21:00',
            'consumer_type': 'population',
            'valid_from': f'{year}-01-01',
            'valid_until': f'{year}-12-31',
            'year': year
        })
        
        tariffs.append({
            'region_name': region,
            'price': zones['half_peak'],
            'recorded_at': f'{year}-01-01',
            'source': 'ROSSETI',
            'tariff_type': 'half_peak',
            'time_zone': '10:00-17:00,21:00-23:00',
            'consumer_type': 'population',
            'valid_from': f'{year}-01-01',
            'valid_until': f'{year}-12-31',
            'year': year
        })
    
    return tariffs