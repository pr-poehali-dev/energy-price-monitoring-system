'''
Business: API для управления базой данных - удаление и вставка данных о тарифах
Args: event - dict с httpMethod, body (JSON с командами)
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с результатами выполнения SQL команд
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        result = {}
        
        if action == 'delete_all_prices':
            # Удаляем все записи из price_history
            cursor.execute('DELETE FROM t_p67469144_energy_price_monitor.price_history')
            deleted_count = cursor.rowcount
            conn.commit()
            result = {'deleted_rows': deleted_count, 'message': f'Deleted {deleted_count} price records'}
        
        elif action == 'get_all_regions':
            # Получаем список всех регионов
            cursor.execute('''
                SELECT id, name, zone, population 
                FROM t_p67469144_energy_price_monitor.regions 
                ORDER BY name
            ''')
            regions = [dict(row) for row in cursor.fetchall()]
            result = {'regions': regions, 'total_count': len(regions)}
        
        elif action == 'insert_prices':
            # Вставляем данные о ценах
            prices = body.get('prices', [])
            if not prices:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No prices provided'}),
                    'isBase64Encoded': False
                }
            
            inserted_count = 0
            for price_record in prices:
                cursor.execute('''
                    INSERT INTO t_p67469144_energy_price_monitor.price_history 
                    (region_id, price, recorded_at, tariff_type, consumer_type, time_zone, source)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                ''', (
                    price_record['region_id'],
                    price_record['price'],
                    price_record['recorded_at'],
                    price_record.get('tariff_type', 'single'),
                    price_record.get('consumer_type', 'standard'),
                    price_record.get('time_zone', 'day'),
                    price_record.get('source', 'official_2024')
                ))
                inserted_count += cursor.rowcount
            
            conn.commit()
            result = {'inserted_rows': inserted_count, 'message': f'Inserted {inserted_count} price records'}
        
        elif action == 'execute_sql':
            # Выполнение произвольного SQL (для отладки)
            sql = body.get('sql')
            if not sql:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No SQL provided'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute(sql)
            if cursor.description:
                rows = [dict(row) for row in cursor.fetchall()]
                result = {'rows': rows, 'count': len(rows)}
            else:
                conn.commit()
                result = {'affected_rows': cursor.rowcount}
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Unknown action: {action}'}),
                'isBase64Encoded': False
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }