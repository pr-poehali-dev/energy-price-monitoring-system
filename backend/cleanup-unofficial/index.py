import json
import os
from typing import Dict, Any
import psycopg2


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Clean up non-official data from database, keep only government sources
    Args: event - dict with httpMethod
          context - object with request_id attribute
    Returns: HTTP response with cleanup statistics
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
    
    database_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        cursor.execute("""
            DELETE FROM t_p67469144_energy_price_monitor.price_history 
            WHERE source IN ('estimate', 'MONTHLY_GENERATED', 'HISTORICAL_DATA', 'IMPORT_2024', 'test', 
                            'https://rg.ru', 'https://www.ingos.ru', 'https://vladnews.ru', 'https://ktv-ray.ru')
        """)
        
        deleted_count = cursor.rowcount
        conn.commit()
        
        cursor.execute("""
            SELECT source, COUNT(*) as count 
            FROM t_p67469144_energy_price_monitor.price_history 
            GROUP BY source 
            ORDER BY count DESC
        """)
        
        remaining_sources = {row[0]: row[1] for row in cursor.fetchall()}
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': True,
                'deleted_count': deleted_count,
                'message': f'Deleted {deleted_count} non-official records',
                'remaining_sources': remaining_sources
            }, ensure_ascii=False)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
