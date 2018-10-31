from piece import Piece
from space import Space


class Board(object):
    def __init__(self, player0, player1, pieces=None):
        self.player0 = player0
        self.player1 = player1
        self.spaces = self.make_spaces()
        if pieces is None:
            self.pieces = self.make_initial_pieces()
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

    def make_initial_pieces(self):
        pieces = [
            Piece(-6, -8, self.player1, Piece.Fire),
            Piece(-4, -8, self.player1, Piece.Water),
            Piece(-3, -7, self.player1, Piece.Earth),
            Piece(-3, -9, self.player1, Piece.Air),
            Piece(-2, -10, self.player1, Piece.Fire),
            Piece(-1, -11, self.player1, Piece.Earth),
            Piece(0, -12, self.player1, Piece.Lotus),
            Piece(1, -11, self.player1, Piece.Air),
            Piece(2, -10, self.player1, Piece.Water),
            Piece(3, -9, self.player1, Piece.Earth),
            Piece(3, -7, self.player1, Piece.Air),
            Piece(4, -8, self.player1, Piece.Fire),
            Piece(6, -8, self.player1, Piece.Water),
            Piece(0, -8, self.player1, Piece.Avatar),

            Piece(-6, 8, self.player0, Piece.Water),
            Piece(-4, 8, self.player0, Piece.Fire),
            Piece(-3, 7, self.player0, Piece.Air),
            Piece(-3, 9, self.player0, Piece.Earth),
            Piece(-2, 10, self.player0, Piece.Water),
            Piece(-1, 11, self.player0, Piece.Air),
            Piece(0, 12, self.player0, Piece.Lotus),
            Piece(1, 11, self.player0, Piece.Earth),
            Piece(2, 10, self.player0, Piece.Fire),
            Piece(3, 9, self.player0, Piece.Air),
            Piece(3, 7, self.player0, Piece.Earth),
            Piece(4, 8, self.player0, Piece.Water),
            Piece(6, 8, self.player0, Piece.Fire),
            Piece(0, 8, self.player0, Piece.Avatar),
        ]
        return pieces

    def serializable(self):
        return dict(
            player0=self.player0,
            player1=self.player1,
            spaces=[space.serializable() for space in self.spaces],
            pieces=[piece.serializable() for piece in self.pieces]
        )

