from piece import Piece
from space import Space


class Board(object):
    def __init__(self, player0_name, player1_name, pieces=None):
        self.player0 = {'number': 0, 'name': player0_name}
        self.player1 = {'number': 1, 'name': player1_name}
        self.spaces = self.make_spaces()
        if pieces is None:
            self.pieces = self.make_initial_pieces(self.player0, self.player1)
        else:
            self.pieces = pieces

    def make_spaces(self):
        spaces = []
        for i in range(-12, 13):
            for j in range(-12, 13):
                if i * i + j * j <= 12.5 * 12.5 and (i + j) % 2 == 0:
                    spaces.append(Space(i, j))
        return spaces

    def add_pieces(self, pieces, spaces):
        for piece in pieces:
            space = self.find_space(piece.x, piece.y)
            if space is not None:
                space.has_piece = True
                space.piece = piece

    def find_space(self, x, y, spaces):
        pass

    def find_piece(self, x, y):
        pass

    def make_piece(self, x, y, player, piece):
        return {'x': x, 'y': y, 'player': player, 'piece': piece}

    def make_initial_pieces(self, player0, player1):
        pieces = [
            Piece(-6, -8, player1, Piece.Fire),
            Piece(-4, -8, player1, Piece.Water),
            Piece(-3, -7, player1, Piece.Earth),
            Piece(-3, -9, player1, Piece.Air),
            Piece(-2, -10, player1, Piece.Fire),
            Piece(-1, -11, player1, Piece.Earth),
            Piece(0, -12, player1, Piece.Lotus),
            Piece(1, -11, player1, Piece.Air),
            Piece(2, -10, player1, Piece.Water),
            Piece(3, -9, player1, Piece.Earth),
            Piece(3, -7, player1, Piece.Air),
            Piece(4, -8, player1, Piece.Fire),
            Piece(6, -8, player1, Piece.Water),
            Piece(0, -8, player1, Piece.Avatar),

            Piece(-6, 8, player0, Piece.Water),
            Piece(-4, 8, player0, Piece.Fire),
            Piece(-3, 7, player0, Piece.Air),
            Piece(-3, 9, player0, Piece.Earth),
            Piece(-2, 10, player0, Piece.Water),
            Piece(-1, 11, player0, Piece.Air),
            Piece(0, 12, player0, Piece.Lotus),
            Piece(1, 11, player0, Piece.Earth),
            Piece(2, 10, player0, Piece.Fire),
            Piece(3, 9, player0, Piece.Air),
            Piece(3, 7, player0, Piece.Earth),
            Piece(4, 8, player0, Piece.Water),
            Piece(6, 8, player0, Piece.Fire),
            Piece(0, 8, player0, Piece.Avatar),
        ]
        return pieces



