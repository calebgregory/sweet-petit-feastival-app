from datetime import datetime

from cattrs import GenConverter

converter = GenConverter()

converter.register_structure_hook(datetime, lambda ts, _: datetime.fromisoformat(ts))


def to_str(dt: datetime) -> str:
    return dt.isoformat()


converter.register_unstructure_hook(datetime, to_str)
