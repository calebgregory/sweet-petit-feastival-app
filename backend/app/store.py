import os

import boto3
import xoto3.dynamodb.get as get
import xoto3.dynamodb.put as put
from xoto3.dynamodb.types import Item, TableResource
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


def get_subscriber(id: str) -> Subscriber:
    return converter.structure(
        get.strongly_consistent_get_item(SubscribersTableRes(), dict(id=id)), Subscriber
    )


def create_subscriber(sub: Subscriber) -> Subscriber:
    return struc_sub(dict(put.put_but_raise_if_exists(SubscribersTableRes(), unstruc_sub(sub))))
