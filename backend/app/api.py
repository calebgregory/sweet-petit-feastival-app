import json
from datetime import datetime

from .serde import converter
from .store import create_subscriber
from .types import RegisterForUpdatesInput, RegisterForUpdatesResult, Subscriber


def LAM_register(event, _context):
    ipt = converter.structure(json.loads(event["body"]), RegisterForUpdatesInput)
    create_subscriber(Subscriber(email=ipt.email, created_at=datetime.utcnow()))
    resp = RegisterForUpdatesResult(ok=True)
    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(converter.unstructure(resp)),
    }
