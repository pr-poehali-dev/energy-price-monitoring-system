import json
import os
from typing import Dict, Any
import psycopg2
from datetime import datetime


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Update electricity tariffs in database from parsed official data
    Args: event - dict with httpMethod, body containing tariffs array
          context - object with request_id attribute
    Returns: HTTP response with update status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_str = event.get('body', '{}')
    body_data = json.loads(body_str)
    tariffs = body_data.get('tariffs', [])
    
    if not tariffs:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'No tariffs provided'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    updated_count = 0
    skipped_count = 0
    errors = []
    
    for tariff in tariffs:
        region_name = tariff.get('region_name', '').replace("'", "''")
        price = tariff.get('tariff_rub_per_kwh')
        valid_from = tariff.get('valid_from', datetime.now().date().isoformat())
        source = tariff.get('source', 'official').replace("'", "''")
        
        if not region_name or price is None:
            skipped_count += 1
            continue
        
        cursor.execute(
            f"SELECT id FROM t_p67469144_energy_price_monitor.regions WHERE name = '{region_name}'"
        )
        region_row = cursor.fetchone()
        
        if not region_row:
            errors.append(f'Region not found: {region_name}')
            skipped_count += 1
            continue
        
        region_id = region_row[0]
        
        cursor.execute(
            f"""
            INSERT INTO t_p67469144_energy_price_monitor.price_history 
            (region_id, price, recorded_at, source)
            VALUES ({region_id}, {price}, '{valid_from}', '{source}')
            """
        )
        updated_count += 1
    
    conn.commit()
    cursor.close()
    conn.close()
    
    result = {
        'success': True,
        'updated': updated_count,
        'skipped': skipped_count,
        'errors': errors,
        'updated_at': datetime.now().isoformat()
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result, ensure_ascii=False)
    }