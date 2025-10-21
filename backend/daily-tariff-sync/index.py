import json
from typing import Dict, Any
import urllib.request
from datetime import datetime


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Daily automated sync of official electricity tariffs (trigger via cron)
    Args: event - dict with httpMethod or cron trigger data
          context - object with request_id attribute
    Returns: HTTP response with sync status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    sync_url = 'https://functions.poehali.dev/1d38596d-371d-453b-91cd-80200e4d0a2b'
    
    req = urllib.request.Request(
        sync_url,
        data=b'',
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    with urllib.request.urlopen(req) as response:
        sync_data = json.loads(response.read().decode('utf-8'))
    
    result = {
        'success': sync_data.get('success', False),
        'parsed': sync_data.get('parsed', 0),
        'updated': sync_data.get('updated', 0),
        'skipped': sync_data.get('skipped', 0),
        'errors': sync_data.get('errors', []),
        'timestamp': datetime.now().isoformat(),
        'trigger': 'cron',
        'message': f'Daily sync completed: {sync_data.get("updated", 0)} tariffs updated'
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
