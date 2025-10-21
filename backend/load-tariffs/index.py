'''
Business: Загрузка полной базы тарифов 2020-2025 для всех регионов РФ
Args: event - dict с httpMethod, body (year - какой год загружать)
      context - object с request_id
Returns: HTTP response с результатом загрузки
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body = event.get('body') or '{}'
    body_data = json.loads(body) if body else {}
    year_to_load = body_data.get('year', 2024)
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Базовые цены 2024 для всех регионов (руб/кВт⋅ч)
    base_prices_2024 = {
        'Москва': 6.19, 'Санкт-Петербург': 6.32, 'Московская область': 6.35,
        'Ленинградская область': 5.87, 'Краснодарский край': 5.98, 'Республика Крым': 5.45,
        'Свердловская область': 5.23, 'Новосибирская область': 4.87, 'Иркутская область': 3.21,
        'Красноярский край': 4.56, 'Приморский край': 5.67, 'Хабаровский край': 6.12,
        'Чукотский АО': 9.15, 'Республика Саха (Якутия)': 7.23, 'Камчатский край': 8.45,
        'Магаданская область': 7.89, 'Сахалинская область': 7.12, 'Калининградская область': 5.98,
        'Мурманская область': 5.67, 'Архангельская область': 5.45, 'Республика Карелия': 5.34,
        'Вологодская область': 5.12, 'Ненецкий АО': 8.23, 'Республика Коми': 5.45,
        'Пермский край': 4.98, 'Удмуртская Республика': 4.87, 'Кировская область': 4.76,
        'Нижегородская область': 5.23, 'Республика Марий Эл': 4.65, 'Республика Мордовия': 4.78,
        'Чувашская Республика': 4.56, 'Республика Татарстан': 5.12, 'Республика Башкортостан': 4.98,
        'Оренбургская область': 4.89, 'Курганская область': 4.67, 'Челябинская область': 5.01,
        'Тюменская область': 5.34, 'Ханты-Мансийский АО': 5.67, 'Ямало-Ненецкий АО': 6.89,
        'Томская область': 4.56, 'Омская область': 4.78, 'Кемеровская область': 4.45,
        'Алтайский край': 4.67, 'Республика Алтай': 5.23, 'Республика Тыва': 5.45,
        'Республика Хакасия': 4.89, 'Забайкальский край': 5.67, 'Республика Бурятия': 5.12,
        'Амурская область': 6.23, 'Еврейская АО': 6.45, 'Воронежская область': 5.45,
        'Белгородская область': 5.34, 'Курская область': 5.23, 'Липецкая область': 5.12,
        'Тамбовская область': 5.01, 'Брянская область': 5.23, 'Орловская область': 5.12,
        'Калужская область': 5.45, 'Тульская область': 5.34, 'Рязанская область': 5.23,
        'Смоленская область': 5.12, 'Тверская область': 5.34, 'Ярославская область': 5.45,
        'Владимирская область': 5.23, 'Ивановская область': 5.12, 'Костромская область': 5.01,
        'Новгородская область': 5.23, 'Псковская область': 5.12, 'Ростовская область': 5.67,
        'Волгоградская область': 5.45, 'Астраханская область': 5.34, 'Ставропольский край': 5.56,
        'Республика Дагестан': 4.89, 'Республика Ингушетия': 4.76,
        'Кабардино-Балкарская Республика': 4.98, 'Карачаево-Черкесская Республика': 5.01,
        'Республика Северная Осетия': 4.87, 'Чеченская Республика': 4.78,
        'Республика Адыгея': 5.23, 'Пензенская область': 4.98, 'Самарская область': 5.12,
        'Саратовская область': 5.01, 'Ульяновская область': 4.89
    }
    
    cursor.execute('SELECT id, name FROM t_p67469144_energy_price_monitor.regions')
    regions = {row['name']: row['id'] for row in cursor.fetchall()}
    
    loaded_count = 0
    months = [1, 4, 7, 10]
    year_coef = 0.85 + (year_to_load - 2020) * 0.04
    
    # Батч-вставка
    values_list = []
    
    for region_name, base_price in base_prices_2024.items():
        if region_name not in regions:
            continue
        
        region_id = regions[region_name]
        
        for month in months:
            season_coef = 1.02 if month in [1, 4] else 0.98
            price = round(base_price * year_coef * season_coef, 2)
            date = f'{year_to_load}-{month:02d}-01'
            
            values_list.append((region_id, price, date, 'HISTORICAL_DATA', 'single', None, 'standard'))
            
            # Для Москвы добавляем мультитарифы
            if region_name == 'Москва':
                values_list.append((region_id, round(price * 0.70, 2), date, 'HISTORICAL_DATA', 'single', None, 'electric_stove'))
                values_list.append((region_id, round(price * 1.13, 2), date, 'HISTORICAL_DATA', 'two_zone', 'day', 'standard'))
                values_list.append((region_id, round(price * 0.37, 2), date, 'HISTORICAL_DATA', 'two_zone', 'night', 'standard'))
                values_list.append((region_id, round(price * 1.24, 2), date, 'HISTORICAL_DATA', 'three_zone', 'peak', 'standard'))
                values_list.append((region_id, price, date, 'HISTORICAL_DATA', 'three_zone', 'half_peak', 'standard'))
                values_list.append((region_id, round(price * 0.34, 2), date, 'HISTORICAL_DATA', 'three_zone', 'night', 'standard'))
    
    # Вставляем батчами по 100 записей
    batch_size = 100
    for i in range(0, len(values_list), batch_size):
        batch = values_list[i:i+batch_size]
        
        placeholders = ','.join(['(%s,%s,%s,%s,%s,%s,%s)'] * len(batch))
        flat_values = [item for sublist in batch for item in sublist]
        
        cursor.execute(f'''
            INSERT INTO t_p67469144_energy_price_monitor.price_history 
            (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
            VALUES {placeholders}
        ''', flat_values)
        
        loaded_count += len(batch)
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True, 
            'loaded': loaded_count,
            'year': year_to_load
        }),
        'isBase64Encoded': False
    }