from webapi.utilities.class_to_dictionaries import slots_object_to_dictionary, jsonize


class Space(object):
    __slots__ = ['x', 'y', 'has_piece', 'selectable', 'selected', 'piece']

    def __init__(self, x, y, has_piece=False, selectable=False, selected=False, piece=None):
        self.x = x
        self.y = y
        self.has_piece = has_piece
        self.selectable = selectable
        self.selected = selected
        self.piece = piece

    def serializable(self):
        return slots_object_to_dictionary(self)

    def __str__(self):
        return jsonize(self)
