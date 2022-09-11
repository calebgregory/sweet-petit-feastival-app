import hashlib
import json
import typing as ty

from .register import register_potluck_participant
from .serde import converter
from .store import list_subscribers
from .types import (
    ListPotluckParticipantsResult,
    Participant,
    RegisterForPotluckInput,
    RegisterForPotluckResult,
    Subscriber,
)

T = ty.TypeVar("T")


def _successful_result(resp: T):
    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps(converter.unstructure(resp)),
    }


def _xf_subscriber_to_api_view(sub: Subscriber) -> Participant:
    id = hashlib.sha256(sub.email.encode()).hexdigest()
    return Participant(id=id, name=sub.name, food_to_bring=sub.food_to_bring)


def _xf_subscribers_to_api_view(subscribers: ty.List[Subscriber]) -> ty.List[Participant]:
    return [_xf_subscriber_to_api_view(sub) for sub in subscribers]


def LAM_register(event, _context):
    ipt = converter.structure(json.loads(event["body"]), RegisterForPotluckInput)
    register_potluck_participant(ipt)
    return _successful_result(
        resp=RegisterForPotluckResult(
            potluck_participants=_xf_subscribers_to_api_view(list_subscribers())
        )
    )


def LAM_list_participants(_event, _context):
    return _successful_result(
        resp=ListPotluckParticipantsResult(
            potluck_participants=_xf_subscribers_to_api_view(list_subscribers())
        )
    )
