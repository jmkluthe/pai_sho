from webapi.utilities.class_to_dictionaries import slots_object_to_dictionary, jsonize
from flask import json


class Piece(object):
    __slots__ = ['x', 'y', 'player_number', 'element']

    def __init__(self, x, y, player_number, element):
        self.x = x
        self.y = y
        self.player_number = player_number
        self.element = element

    def asdict(self):
        # return slots_object_to_dictionary(self)
        return dict(
            x=self.x,
            y=self.y,
            player_number=self.player_number,
            element=self.element.value
        )

