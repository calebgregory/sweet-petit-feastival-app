import os
import typing as ty

import boto3
import xoto3.dynamodb.get as get
import xoto3.dynamodb.paginate as pag
import xoto3.dynamodb.put as put
from xoto3.dynamodb.types import Item, TableResource
from xoto3.dynamodb.update import versioned_diffed_update_item
from xoto3.utils.lazy import Lazy

from .serde import converter
from .types import Subscriber

SubscribersTableRes: Lazy[TableResource] = Lazy(
    lambda: boto3.resource("dynamodb").Table(os.environ["TABLE_NAME"])
)


def struc_sub(sub: Item) -> Subscriber:
    return converter.structure(sub, Subscriber)


def unstruc_sub(sub: Subscriber) -> Item:
    return converter.unstructure(sub)


def get_subscriber(email: str) -> Subscriber:
    return converter.structure(
        get.strongly_consistent_get_item(SubscribersTableRes(), dict(email=email)), Subscriber
    )


def create_subscriber(sub: Subscriber) -> Subscriber:
    put_subscriber = put.make_put_item("Subscribers", SubscribersTableRes())
    return struc_sub(dict(put_subscriber(unstruc_sub(sub))))


def update_subscriber(updater: ty.Callable[[Subscriber], Subscriber], email: str) -> Subscriber:
    return struc_sub(versioned_diffed_update_item(SubscribersTableRes(), updater, dict(email=email)))


def list_subscribers() -> ty.List[Subscriber]:
    subscribers = [
        converter.structure(item, Subscriber)
        for item in pag.yield_items(SubscribersTableRes().scan, dict())
    ]
    return subscribers
