import hashlib
import json
import typing as ty
from datetime import datetime

from .serde import converter
from .store import create_subscriber, list_subscribers
from .types import (
    ListPotluckParticipantsResult,
    RegisterForPotluckInput,
    RegisterForPotluckResult,
    Subscriber,
    SubscriberApiView,
)

T = ty.TypeVar("T")


def _successful_result(resp: T):
    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(converter.unstructure(resp)),
    }


def LAM_register(event, _context):
    ipt = converter.structure(json.loads(event["body"]), RegisterForPotluckInput)
    create_subscriber(Subscriber(email=ipt.email, created_at=datetime.utcnow()))
    resp = RegisterForPotluckResult(ok=True)
    return _successful_result(resp)


def _xf_subscriber_to_api_view(sub: Subscriber) -> SubscriberApiView:
    id = hashlib.sha256(sub.email.encode()).hexdigest()
    return SubscriberApiView(id=id, name=sub.name, food_to_bring=sub.food_to_bring)


def LAM_list_participants(_event, _context):
    subscribers = list_subscribers()
    return _successful_result(
        resp=ListPotluckParticipantsResult(
            potluck_participants=[_xf_subscriber_to_api_view(sub) for sub in subscribers]
        )
    )
