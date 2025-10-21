import json
import os
from typing import Dict, Any
import urllib.request
from datetime import datetime
import psycopg2


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Orchestrate parsing and updating tariffs from official sources
    Args: event - dict with httpMethod
          context - object with request_id attribute
    Returns: HTTP response with sync status and details
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
    
    started_at = datetime.now()
    trigger_type = event.get('queryStringParameters', {}).get('trigger', 'manual')
    
    parse_url = 'https://functions.poehali.dev/7eb79ab5-35a7-430b-b9fe-b2a4afe7f444'
    update_url = 'https://functions.poehali.dev/fe51c49b-30dd-46b7-81d5-d9b139d4b9e2'
    
    status = 'success'
    errors = []
    
    try:
        with urllib.request.urlopen(parse_url) as response:
            parse_data = json.loads(response.read().decode('utf-8'))
        
        if not parse_data.get('success'):
            status = 'failed'
            errors.append('Failed to parse tariffs')
            raise Exception('Failed to parse tariffs')
        
        tariffs = parse_data.get('tariffs', [])
        
        update_payload = json.dumps({'tariffs': tariffs}).encode('utf-8')
        req = urllib.request.Request(
            update_url,
            data=update_payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            update_data = json.loads(response.read().decode('utf-8'))
        
        parsed_count = parse_data.get('tariffs_count', 0)
        updated_count = update_data.get('updated', 0)
        skipped_count = update_data.get('skipped', 0)
        errors = update_data.get('errors', [])
        
        if errors:
            status = 'partial'
        
    except Exception as e:
        status = 'failed'
        errors.append(str(e))
        parsed_count = 0
        updated_count = 0
        skipped_count = 0
    
    completed_at = datetime.now()
    duration_ms = int((completed_at - started_at).total_seconds() * 1000)
    
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        try:
            conn = psycopg2.connect(database_url)
            cursor = conn.cursor()
            
            source_info = json.dumps({
                'parse_url': parse_url,
                'update_url': update_url,
                'tariffs_sources': ['ФАС', 'Россети', 'rg.ru', 'ingos.ru', 'ktv-ray.ru', 'vladnews.ru']
            })
            
            cursor.execute(
                f"""
                INSERT INTO t_p67469144_energy_price_monitor.sync_logs 
                (sync_type, status, parsed_count, updated_count, skipped_count, errors, source_info, started_at, completed_at, duration_ms, trigger_type)
                VALUES ('tariff_sync', '{status}', {parsed_count or 0}, {updated_count or 0}, {skipped_count or 0}, 
                        '{json.dumps(errors).replace("'", "''")}', '{source_info}', '{started_at.isoformat()}', '{completed_at.isoformat()}', {duration_ms}, '{trigger_type}')
                """
            )
            
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as log_error:
            pass
    
    result = {
        'success': status in ['success', 'partial'],
        'status': status,
        'parsed': parsed_count,
        'updated': updated_count,
        'skipped': skipped_count,
        'errors': errors,
        'timestamp': completed_at.isoformat(),
        'duration_ms': duration_ms
    }
    
    return {
        'statusCode': 200 if status != 'failed' else 500,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result, ensure_ascii=False)
    }