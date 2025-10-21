import json
import os
from typing import Dict, Any
import urllib.request


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
    
    parse_url = 'https://functions.poehali.dev/7eb79ab5-35a7-430b-b9fe-b2a4afe7f444'
    update_url = 'https://functions.poehali.dev/fe51c49b-30dd-46b7-81d5-d9b139d4b9e2'
    
    with urllib.request.urlopen(parse_url) as response:
        parse_data = json.loads(response.read().decode('utf-8'))
    
    if not parse_data.get('success'):
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Failed to parse tariffs'})
        }
    
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
    
    result = {
        'success': True,
        'parsed': parse_data.get('tariffs_count', 0),
        'updated': update_data.get('updated', 0),
        'skipped': update_data.get('skipped', 0),
        'errors': update_data.get('errors', []),
        'timestamp': parse_data.get('parsed_at')
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
