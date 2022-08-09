from datetime import datetime

from attrs import define


@define
class RegisterForUpdatesInput:
    email: str


@define
class Subscriber:
    email: str
    created_at: datetime


@define
class RegisterForUpdatesResult:
    ok: bool
