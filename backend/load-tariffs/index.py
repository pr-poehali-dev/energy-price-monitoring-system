'''
Business: Загрузка реальных тарифов на электроэнергию в БД
Args: event - dict с httpMethod, body
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
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    tariffs = [
        {'name': 'Москва', 'price': 6.19, 'type': 'single', 'consumer': 'standard'},
        {'name': 'Москва', 'price': 4.33, 'type': 'single', 'consumer': 'electric_stove'},
        {'name': 'Москва', 'price': 7.00, 'type': 'two_zone', 'consumer': 'standard', 'zone': 'day'},
        {'name': 'Москва', 'price': 2.29, 'type': 'two_zone', 'consumer': 'standard', 'zone': 'night'},
        {'name': 'Москва', 'price': 4.90, 'type': 'two_zone', 'consumer': 'electric_stove', 'zone': 'day'},
        {'name': 'Москва', 'price': 1.60, 'type': 'two_zone', 'consumer': 'electric_stove', 'zone': 'night'},
        {'name': 'Москва', 'price': 7.65, 'type': 'three_zone', 'consumer': 'standard', 'zone': 'peak'},
        {'name': 'Москва', 'price': 6.19, 'type': 'three_zone', 'consumer': 'standard', 'zone': 'half_peak'},
        {'name': 'Москва', 'price': 2.08, 'type': 'three_zone', 'consumer': 'standard', 'zone': 'night'},
        {'name': 'Санкт-Петербург', 'price': 6.32, 'type': 'single', 'consumer': 'standard'},
        {'name': 'Иркутская область', 'price': 3.21, 'type': 'single', 'consumer': 'standard'},
        {'name': 'Чукотский АО', 'price': 9.15, 'type': 'single', 'consumer': 'standard'}
    ]
    
    loaded_count = 0
    
    for tariff in tariffs:
        cursor.execute('''
            SELECT id FROM t_p67469144_energy_price_monitor.regions
            WHERE name = %s
        ''', (tariff['name'],))
        
        region = cursor.fetchone()
        if not region:
            continue
        
        time_zone = tariff.get('zone')
        
        cursor.execute('''
            INSERT INTO t_p67469144_energy_price_monitor.price_history 
            (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
            VALUES (%s, %s, %s, 'IMPORT_2024', %s, %s, %s)
        ''', (region['id'], tariff['price'], '2024-12-01', tariff['type'], time_zone, tariff['consumer']))
        
        loaded_count += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'loaded': loaded_count}),
        'isBase64Encoded': False
    }
