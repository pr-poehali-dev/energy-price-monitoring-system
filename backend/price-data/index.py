'''
Business: API для получения исторических данных цен на электроэнергию с анализом трендов
Args: event - dict с httpMethod, queryStringParameters
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с данными по регионам и трендами
'''

import json
import os
from typing import Dict, Any, List
from datetime import datetime, timedelta
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
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'get_regions':
            cursor.execute('''
                SELECT id, name, zone, population
                FROM t_p67469144_energy_price_monitor.regions
                ORDER BY name
            ''')
            regions = [dict(row) for row in cursor.fetchall()]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'regions': regions}),
                'isBase64Encoded': False
            }
        
        if action == 'add_price':
            region_id = body_data.get('region_id')
            price = body_data.get('price')
            date = body_data.get('date')
            tariff_type = body_data.get('tariff_type', 'single')
            time_zone = body_data.get('time_zone')
            consumer_type = body_data.get('consumer_type', 'standard')
            
            cursor.execute('''
                INSERT INTO t_p67469144_energy_price_monitor.price_history 
                (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
                VALUES (%s, %s, %s, 'IMPORT_2024', %s, %s, %s)
            ''', (region_id, price, date, tariff_type, time_zone, consumer_type))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        region_id = params.get('region_id')
        days = int(params.get('days', '180'))
        
        if region_id:
            cursor.execute('''
                SELECT 
                    r.name as region_name,
                    r.zone,
                    r.population,
                    ph.price,
                    ph.recorded_at,
                    ph.source,
                    ph.tariff_type,
                    ph.time_zone,
                    ph.consumer_type
                FROM t_p67469144_energy_price_monitor.price_history ph
                JOIN t_p67469144_energy_price_monitor.regions r ON ph.region_id = r.id
                WHERE r.id = %s AND ph.source != 'SYNTHETIC_OLD_DATA'
                ORDER BY ph.recorded_at ASC, ph.tariff_type, ph.time_zone
            ''', (region_id,))
            
            history = [dict(row) for row in cursor.fetchall()]
            
            cursor.execute('''
                SELECT 
                    r.id,
                    r.name,
                    r.zone,
                    r.population,
                    (SELECT price FROM t_p67469144_energy_price_monitor.price_history WHERE region_id = r.id ORDER BY recorded_at DESC LIMIT 1) as current_price,
                    (SELECT price FROM t_p67469144_energy_price_monitor.price_history WHERE region_id = r.id ORDER BY recorded_at ASC LIMIT 1) as first_price
                FROM t_p67469144_energy_price_monitor.regions r
                WHERE r.id = %s
            ''', (region_id,))
            
            region_data = dict(cursor.fetchone())
            
            if region_data['current_price'] and region_data['first_price']:
                change = ((float(region_data['current_price']) - float(region_data['first_price'])) / float(region_data['first_price'])) * 100
                region_data['change'] = round(change, 2)
            else:
                region_data['change'] = 0
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'region': region_data,
                    'history': history
                }, default=str),
                'isBase64Encoded': False
            }
        
        cursor.execute('''
            SELECT 
                r.id,
                r.name,
                r.zone,
                r.population,
                ph.price as current_price,
                ph.recorded_at as last_updated
            FROM t_p67469144_energy_price_monitor.regions r
            LEFT JOIN LATERAL (
                SELECT price, recorded_at
                FROM t_p67469144_energy_price_monitor.price_history
                WHERE region_id = r.id AND source != 'SYNTHETIC_OLD_DATA'
                ORDER BY recorded_at DESC
                LIMIT 1
            ) ph ON true
            ORDER BY r.name
        ''')
        
        regions = [dict(row) for row in cursor.fetchall()]
        
        for region in regions:
            cursor.execute('''
                SELECT price 
                FROM t_p67469144_energy_price_monitor.price_history 
                WHERE region_id = %s AND source != 'SYNTHETIC_OLD_DATA'
                ORDER BY recorded_at ASC 
                LIMIT 1
            ''', (region['id'],))
            
            first_price_row = cursor.fetchone()
            if first_price_row and region['current_price']:
                first_price = float(first_price_row['price'])
                current_price = float(region['current_price'])
                change = ((current_price - first_price) / first_price) * 100
                region['change'] = round(change, 2)
            else:
                region['change'] = 0
        
        cursor.execute('''
            SELECT 
                r.zone,
                AVG(ph.price) as avg_price,
                COUNT(DISTINCT r.id) as region_count
            FROM t_p67469144_energy_price_monitor.regions r
            JOIN t_p67469144_energy_price_monitor.price_history ph ON r.id = ph.region_id
            WHERE ph.source != 'SYNTHETIC_OLD_DATA' AND ph.recorded_at = (
                SELECT MAX(recorded_at) 
                FROM t_p67469144_energy_price_monitor.price_history 
                WHERE region_id = r.id AND source != 'SYNTHETIC_OLD_DATA'
            )
            GROUP BY r.zone
            ORDER BY avg_price DESC
        ''')
        
        zones = [dict(row) for row in cursor.fetchall()]
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'regions': regions,
                'zones': zones
            }, default=str),
            'isBase64Encoded': False
        }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }