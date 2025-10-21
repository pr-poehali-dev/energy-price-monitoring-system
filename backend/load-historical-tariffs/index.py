import json
import os
from typing import Dict, Any
import urllib.request
import psycopg2


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Load historical tariffs from parser into database
    Args: event - dict with httpMethod
          context - object with request_id attribute
    Returns: HTTP response with loading status
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
    
    parser_url = 'https://functions.poehali.dev/754473b7-8c5f-49b8-9303-b7770aeb59dd'
    
    with urllib.request.urlopen(parser_url) as response:
        data = json.loads(response.read().decode('utf-8'))
    
    if not data.get('success'):
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Failed to fetch tariffs from parser'})
        }
    
    tariffs = data.get('tariffs', [])
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM t_p67469144_energy_price_monitor.price_history WHERE year IS NOT NULL")
    conn.commit()
    
    loaded_count = 0
    errors = []
    
    cursor.execute("SELECT id, name FROM t_p67469144_energy_price_monitor.regions")
    region_map = {row[1]: row[0] for row in cursor.fetchall()}
    
    batch_values = []
    for tariff in tariffs:
        region_name = tariff['region_name']
        
        if region_name not in region_map:
            errors.append(f'Region not found: {region_name}')
            continue
        
        region_id = region_map[region_name]
        tariff_value = tariff['tariff_rub_per_kwh']
        valid_from = tariff['valid_from']
        valid_until = tariff['valid_until']
        source = tariff['source'].replace("'", "''")
        year = tariff['year']
        
        batch_values.append(
            f"({region_id}, {tariff_value}, '{valid_from}', '{source}', '{valid_from}', '{valid_until}', {year})"
        )
        loaded_count += 1
    
    if batch_values:
        values_str = ','.join(batch_values)
        cursor.execute(
            f"""
            INSERT INTO t_p67469144_energy_price_monitor.price_history 
            (region_id, price, recorded_at, source, valid_from, valid_until, year)
            VALUES {values_str}
            """
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    result = {
        'success': True,
        'loaded': loaded_count,
        'total': len(tariffs),
        'errors': errors,
        'source': 'ФАС России (2020-2025)'
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