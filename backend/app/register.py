import typing as ty
from datetime import datetime
from functools import partial

from xoto3.dynamodb.exceptions import ItemNotFoundException
from xoto3.dynamodb.types import Item

from .store import create_subscriber, struc_sub, unstruc_sub, update_subscriber
from .types import RegisterForPotluckInput, Subscriber


def _update_subscriber(ipt: RegisterForPotluckInput, now: datetime, item: Item) -> Item:
    """versioned_diffed_update_item internally performs a deep-copy of the item"""
    sub = struc_sub(item)

    # prevent overwrites
    if ipt.name:
        sub.name = ipt.name
    if ipt.food_to_bring:
        sub.food_to_bring = ipt.food_to_bring

    sub.updated_at = now
    return unstruc_sub(sub)


def register_potluck_participant(ipt: RegisterForPotluckInput, now: ty.Optional[datetime] = None):
    if not now:
        now = datetime.utcnow()

    try:
        # if subscriber already exists, update them
        update_subscriber(partial(_update_subscriber, ipt, now), ipt.email)
    except ItemNotFoundException:
        # else create them
        create_subscriber(
            Subscriber(email=ipt.email, created_at=now, name=ipt.name, food_to_bring=ipt.food_to_bring)
        )
