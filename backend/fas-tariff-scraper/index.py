import json
import os
from typing import Dict, Any, List
from datetime import datetime
import urllib.request
import urllib.parse
import re


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Scrape real electricity tariffs from FAS.gov.ru open data
    Args: event - dict with httpMethod, queryStringParameters (year, region_name optional)
          context - object with request_id attribute
    Returns: HTTP response with scraped tariff data from FAS official sources
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
    year = params.get('year', '2024')
    region_filter = params.get('region_name', None)
    
    scraped_tariffs: List[Dict[str, Any]] = []
    errors: List[str] = []
    
    open_data_urls = [
        'http://fas.gov.ru/opendata/7705114405-electricitytariffs/data-20240101-structure-20160908.json',
        'http://fas.gov.ru/opendata/7705114405-tariff/data.json',
    ]
    
    for url in open_data_urls:
        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0 (compatible; EnergyPriceMonitor/1.0)'}
            )
            
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status != 200:
                    errors.append(f'HTTP {response.status} for {url}')
                    continue
                
                content = response.read().decode('utf-8')
                
                try:
                    data = json.loads(content)
                    
                    if isinstance(data, list):
                        for item in data:
                            tariff_info = parse_tariff_item(item, year, region_filter)
                            if tariff_info:
                                scraped_tariffs.append(tariff_info)
                    
                    elif isinstance(data, dict):
                        if 'data' in data and isinstance(data['data'], list):
                            for item in data['data']:
                                tariff_info = parse_tariff_item(item, year, region_filter)
                                if tariff_info:
                                    scraped_tariffs.append(tariff_info)
                        else:
                            tariff_info = parse_tariff_item(data, year, region_filter)
                            if tariff_info:
                                scraped_tariffs.append(tariff_info)
                
                except json.JSONDecodeError as e:
                    errors.append(f'JSON parse error for {url}: {str(e)}')
                    continue
        
        except urllib.error.HTTPError as e:
            errors.append(f'HTTP error {e.code} for {url}')
        except urllib.error.URLError as e:
            errors.append(f'URL error for {url}: {str(e.reason)}')
        except Exception as e:
            errors.append(f'Error scraping {url}: {str(e)}')
    
    fallback_data = get_fallback_tariffs_2024()
    if region_filter:
        fallback_data = [t for t in fallback_data if t['region_name'] == region_filter]
    
    all_tariffs = scraped_tariffs if scraped_tariffs else fallback_data
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'source': 'scraped' if scraped_tariffs else 'fallback',
            'tariffs_count': len(all_tariffs),
            'tariffs': all_tariffs,
            'errors': errors,
            'year': year,
            'timestamp': datetime.now().isoformat()
        }, ensure_ascii=False)
    }


def parse_tariff_item(item: Dict[str, Any], year: str, region_filter: str = None) -> Dict[str, Any] | None:
    '''Parse tariff item from various JSON structures'''
    try:
        region_name = (
            item.get('region') or 
            item.get('region_name') or 
            item.get('Регион') or 
            item.get('subject') or
            item.get('название') or
            ''
        )
        
        if region_filter and region_name != region_filter:
            return None
        
        tariff_value = (
            item.get('tariff') or 
            item.get('price') or 
            item.get('Тариф') or 
            item.get('цена') or
            item.get('value') or
            0.0
        )
        
        if isinstance(tariff_value, str):
            tariff_value = float(re.sub(r'[^\d.]', '', tariff_value))
        
        tariff_value = float(tariff_value)
        
        if tariff_value == 0.0 or not region_name:
            return None
        
        return {
            'region_name': region_name,
            'tariff_rub_per_kwh': round(tariff_value, 2),
            'year': year,
            'source': 'fas.gov.ru',
            'valid_from': f'{year}-01-01',
            'valid_until': f'{year}-12-31',
            'raw_data': item
        }
    except (ValueError, TypeError, KeyError):
        return None


def get_fallback_tariffs_2024() -> List[Dict[str, Any]]:
    '''Fallback data based on official FAS publications for 2024'''
    tariff_data_2024 = {
        'Москва': 7.37, 'Санкт-Петербург': 6.83, 'Московская область': 7.37,
        'Ленинградская область': 6.83, 'Краснодарский край': 6.48,
        'Свердловская область': 5.63, 'Новосибирская область': 4.92,
        'Республика Татарстан': 5.28, 'Нижегородская область': 5.26,
        'Красноярский край': 3.81, 'Ростовская область': 6.11,
        'Волгоградская область': 5.76, 'Челябинская область': 5.41,
        'Самарская область': 5.53, 'Иркутская область': 2.30,
    }
    
    return [
        {
            'region_name': region,
            'tariff_rub_per_kwh': tariff,
            'year': '2024',
            'source': 'fallback_fas_data',
            'valid_from': '2024-01-01',
            'valid_until': '2024-12-31'
        }
        for region, tariff in tariff_data_2024.items()
    ]
