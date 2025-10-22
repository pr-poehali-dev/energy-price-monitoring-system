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
    
    current_year = datetime.now().year
    import_url = f'https://functions.poehali.dev/44fd9302-6350-4b24-bfc8-e9dbf41c4866?year={current_year}'
    
    try:
        req = urllib.request.Request(
            import_url,
            headers={'User-Agent': 'DailyTariffSync/1.0'}
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            sync_data = json.loads(response.read().decode('utf-8'))
        
        result = {
            'success': sync_data.get('success', False),
            'year': current_year,
            'imported': sync_data.get('imported_count', 0),
            'skipped': sync_data.get('skipped_count', 0),
            'total_tariffs': sync_data.get('total_tariffs', 0),
            'errors': sync_data.get('errors', []),
            'timestamp': datetime.now().isoformat(),
            'trigger': 'daily_cron',
            'message': f'Daily sync completed: {sync_data.get("imported_count", 0)} new tariffs imported'
        }
    
    except Exception as e:
        result = {
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat(),
            'trigger': 'daily_cron',
            'message': f'Daily sync failed: {str(e)}'
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