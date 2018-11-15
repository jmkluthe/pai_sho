from webapi.utilities.class_to_dictionaries import slots_object_to_dictionary, jsonize
from flask import json


class Space(object):
    __slots__ = ['x', 'y', 'has_piece', 'selectable', 'selected', 'piece']

    def __init__(self, x, y, has_piece=False, selectable=False, selected=False, piece=None):
        self.x = x
        self.y = y
        self.has_piece = has_piece
        self.selectable = selectable
        self.selected = selected
        self.piece = piece

    def asdict(self):
        return dict(
            x=self.x,
            y=self.y,
            has_piece=self.has_piece,
            selectable=self.selectable,
            selected=self.selected,
            piece=str(self.piece)
        )

