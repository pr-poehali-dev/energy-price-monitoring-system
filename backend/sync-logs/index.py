import json
import os
from typing import Dict, Any
import psycopg2


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get synchronization logs with filtering and pagination
    Args: event - dict with httpMethod, queryStringParameters (limit, offset, status)
          context - object with request_id attribute
    Returns: HTTP response with sync logs array
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    limit = int(params.get('limit', '50'))
    offset = int(params.get('offset', '0'))
    status_filter = params.get('status', '')
    
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
    
    status_condition = f"AND status = '{status_filter}'" if status_filter else ''
    
    cursor.execute(
        f"""
        SELECT 
            id, sync_type, status, parsed_count, updated_count, skipped_count, 
            errors, source_info, started_at, completed_at, duration_ms, trigger_type
        FROM t_p67469144_energy_price_monitor.sync_logs
        WHERE 1=1 {status_condition}
        ORDER BY started_at DESC
        LIMIT {limit} OFFSET {offset}
        """
    )
    
    rows = cursor.fetchall()
    
    cursor.execute(
        f"SELECT COUNT(*) FROM t_p67469144_energy_price_monitor.sync_logs WHERE 1=1 {status_condition}"
    )
    total_count = cursor.fetchone()[0]
    
    logs = []
    for row in rows:
        logs.append({
            'id': row[0],
            'sync_type': row[1],
            'status': row[2],
            'parsed_count': row[3],
            'updated_count': row[4],
            'skipped_count': row[5],
            'errors': row[6] if isinstance(row[6], list) else json.loads(row[6] or '[]'),
            'source_info': row[7],
            'started_at': row[8].isoformat() if row[8] else None,
            'completed_at': row[9].isoformat() if row[9] else None,
            'duration_ms': row[10],
            'trigger_type': row[11]
        })
    
    cursor.close()
    conn.close()
    
    result = {
        'success': True,
        'logs': logs,
        'total': total_count,
        'limit': limit,
        'offset': offset
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
