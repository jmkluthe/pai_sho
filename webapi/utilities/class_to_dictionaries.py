from flask import jsonify


def slots_object_to_dictionary(obj):
    return {key: obj.__getattribute__(key) for key in obj.__slots__}


def jsonize(obj):
    """
    Uses the public attributes of the object to create a json object string.
    Keys = string names of each attribute
    Values = str(obj.__getattribute('attribute'))
    NOT circular reference safe if the obj__str__() method continues recursively
    """
    attrs = get_public_attributes(obj)
    return jsonify({key: str(obj.__getattribute__(key)) for key in attrs})


def get_public_attributes(obj):
    return [attr for attr in dir(obj) if attr[0] != '_']

