import typing as ty
from datetime import datetime

from attrs import Factory, define


@define
class RegisterForPotluckInput:
    email: str
    name: str
    food_to_bring: str = ""


@define
class RegisterForPotluckResult:
    ok: bool


@define
class Subscriber:
    email: str
    created_at: datetime
    name: str = ""
    food_to_bring: str = ""


@define
class SubscriberApiView:
    id: str
    name: str = ""
    food_to_bring: str = ""


@define
class ListPotluckParticipantsResult:
    potluck_participants: ty.List[SubscriberApiView] = Factory(list)
