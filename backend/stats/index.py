'''
Business: Получение общей статистики данных в системе мониторинга тарифов
Args: event - dict с httpMethod
      context - object с атрибутами request_id, function_name
Returns: HTTP response dict с общей статистикой
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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
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
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute('''
        SELECT 
            (SELECT COUNT(*) FROM t_p67469144_energy_price_monitor.regions) as total_regions,
            (SELECT COUNT(*) FROM t_p67469144_energy_price_monitor.price_history) as total_records,
            (SELECT COUNT(*) FROM t_p67469144_energy_price_monitor.price_history WHERE source != 'SYNTHETIC_OLD_DATA') as real_data_records,
            (SELECT MIN(recorded_at) FROM t_p67469144_energy_price_monitor.price_history) as first_record_date,
            (SELECT MAX(recorded_at) FROM t_p67469144_energy_price_monitor.price_history) as last_record_date,
            (SELECT COUNT(DISTINCT source) FROM t_p67469144_energy_price_monitor.price_history) as total_sources,
            (SELECT COUNT(DISTINCT zone) FROM t_p67469144_energy_price_monitor.regions) as total_zones
    ''')
    
    stats = dict(cursor.fetchone())
    
    cursor.execute('''
        SELECT source, COUNT(*) as count
        FROM t_p67469144_energy_price_monitor.price_history
        GROUP BY source
        ORDER BY count DESC
    ''')
    
    sources = [dict(row) for row in cursor.fetchall()]
    
    cursor.execute('''
        SELECT zone, COUNT(*) as region_count
        FROM t_p67469144_energy_price_monitor.regions
        GROUP BY zone
        ORDER BY zone
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
            'stats': stats,
            'sources': sources,
            'zones': zones
        }, default=str),
        'isBase64Encoded': False
    }
