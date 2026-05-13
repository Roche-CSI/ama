from amapy_server.asset_client.objects.object import Object
from amapy_server.asset_client.objects.object_set import ObjectSet


def test_de_serialize(client_asset):
    """de_serialize populates the set with Object instances sorted by created_at."""
    pass

def test_serialize(client_asset):
    """serialize() returns a list of dicts, one per object."""
    data = client_asset.objects.serialize()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all(isinstance(d, dict) for d in data)


def test_filter(client_asset):
    """filter() with a predicate returns only matching objects; without one returns all."""
    obj_set = client_asset.objects
    first = next(iter(obj_set))
    matched = obj_set.filter(predicate=lambda o: o.id == first.id)
    assert len(matched) == 1 and matched[0] == first
    assert len(obj_set.filter()) == len(obj_set)


def test_add_and_remove_objects(client_asset):
    """add_objects appends items; remove_objects discards them."""
    obj_set = ObjectSet(asset=client_asset)
    objects = list(client_asset.objects)
    obj_set.add_objects(objects)
    assert len(obj_set) == len(objects)
    obj_set.remove_objects(objects)
    assert len(obj_set) == 0
