

class Piece(object):
    Fire = {'type': 'fire', 'color': 'red'}
    Air = {'type': 'air', 'color': 'gold'}
    Water = {'type': 'water', 'color': 'blue'}
    Earth = {'type': 'earth', 'color': 'green'}
    Lotus = {'type': 'lotus', 'color': 'lightsteelblue'}
    Avatar = {'type': 'avatar', 'color': 'purple'}

    def __init__(self, x, y, player, element):
        self.x = x
        self.y = y
        self.player = player
        self.element = element

    def serializable(self):
        return dict(
            x=self.x,
            y=self.y,
            player=self.player,
            element=self.element
        )

