import json
import os
from typing import Dict, Any, List
import urllib.request
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Import tariffs from FAS scraper into database
    Args: event - dict with httpMethod, queryStringParameters (year optional)
          context - object with request_id attribute
    Returns: HTTP response with import results (count of imported records)
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
    
    scraper_url = 'https://functions.poehali.dev/2796af61-1265-420d-91da-1eb1c261f30e'
    
    try:
        req = urllib.request.Request(
            f'{scraper_url}?year={year}',
            headers={'User-Agent': 'EnergyPriceMonitor/1.0'}
        )
        
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            if not data.get('success'):
                return {
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'FAS scraper returned error', 'details': data})
                }
            
            tariffs = data.get('tariffs', [])
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to fetch tariffs: {str(e)}'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'})
        }
    
    imported_count = 0
    skipped_count = 0
    errors = []
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        for tariff in tariffs:
            region_name = tariff.get('region_name')
            tariff_value = tariff.get('tariff_rub_per_kwh')
            valid_from = tariff.get('valid_from', f'{year}-01-01')
            source = 'FAS_SCRAPER_' + year
            
            cursor.execute('''
                SELECT id FROM regions WHERE name = %s LIMIT 1
            ''', (region_name,))
            
            region = cursor.fetchone()
            
            if not region:
                skipped_count += 1
                errors.append(f'Region not found: {region_name}')
                continue
            
            region_id = region['id']
            
            cursor.execute('''
                INSERT INTO price_history 
                (region_id, price, recorded_at, source, tariff_type, time_zone, consumer_type)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            ''', (region_id, tariff_value, valid_from, source, 'single', 'all', 'residential'))
            
            if cursor.rowcount > 0:
                imported_count += 1
            else:
                skipped_count += 1
        
        conn.commit()
        cursor.close()
        conn.close()
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'year': year,
            'imported_count': imported_count,
            'skipped_count': skipped_count,
            'total_tariffs': len(tariffs),
            'errors': errors[:10],
            'source_data': data.get('source', 'unknown')
        }, ensure_ascii=False)
    }
