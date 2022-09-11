import typing as ty
from datetime import datetime

from attrs import Factory, define


@define
class Subscriber:
    email: str
    created_at: datetime
    updated_at: ty.Optional[datetime] = None
    name: str = ""
    food_to_bring: str = ""


@define
class Participant:
    id: str
    name: str = ""
    food_to_bring: str = ""


@define
class RegisterForPotluckInput:
    email: str
    name: str = ""
    food_to_bring: str = ""


@define
class RegisterForPotluckResult:
    potluck_participants: ty.List[Participant] = Factory(list)


@define
class ListPotluckParticipantsResult:
    potluck_participants: ty.List[Participant] = Factory(list)
