from enum import Enum


class EnumDict(Enum):
    @classmethod
    def as_dict(cls):
        return {name: member.value for name, member in cls.__members__.items()}

    @classmethod
    def as_list(cls):
        return [element.value for element in cls]


class Elements(EnumDict):
    FIRE = {'type': 'FIRE', 'color': 'red'}
    AIR = {'type': 'AIR', 'color': 'gold'}
    WATER = {'type': 'WATER', 'color': 'blue'}
    EARTH = {'type': 'EARTH', 'color': 'green'}
    LOTUS = {'type': 'LOTUS', 'color': 'lightsteelblue'}
    AVATAR = {'type': 'AVATAR', 'color': 'purple'}


class TakeMatrix(EnumDict):
    FIRE = [Elements.AIR.name, Elements.AVATAR.name]
    AIR = [Elements.WATER.name, Elements.AVATAR.name]
    WATER = [Elements.EARTH.name, Elements.AVATAR.name]
    EARTH = [Elements.FIRE.name, Elements.AVATAR.name]
    LOTUS = []
    AVATAR = [Elements.AIR.name, Elements.WATER.name, Elements.EARTH.name, Elements.FIRE.name, Elements.AVATAR.name]


class MoveMatrix(EnumDict):
    N = {'x': 0, 'y': 2}
    S = {'x': 0, 'y': -2}
    E = {'x': 2, 'y': 0}
    W = {'x': -2, 'y': 0}
    NE = {'x': 1, 'y': 1}
    SE = {'x': 1, 'y': -1}
    SW = {'x': -1, 'y': -1}
    NW = {'x': -1, 'y': 1}

