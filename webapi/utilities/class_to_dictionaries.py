

def slots_object_to_dictionary(obj):
    return {key: obj.__getattribute__(key) for key in obj.__slots__}

