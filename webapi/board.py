from webapi.piece import Piece
from webapi.space import Space
from webapi.game_constants import Elements


class Board(object):
    __slots__ = ['spaces', 'pieces']

    def __init__(self, top_player_num=0, bottom_player_num=1):
        self.spaces = self.make_spaces()
        self.pieces = self.make_initial_pieces(top_player_num, bottom_player_num)

    def make_spaces(self):
        return [Space(i, j)
                for i in range(-12, 13)
                for j in range(-12, 13)
                if i * i + j * j <= 12.5 * 12.5 and (i + j) % 2 == 0]
        # leaving translation below since it is clearer
        # spaces = []
        # for i in range(-12, 13):
        #     for j in range(-12, 13):
        #         if i * i + j * j <= 12.5 * 12.5 and (i + j) % 2 == 0:
        #             spaces.append(Space(i, j))
        # return spaces

    # TODO add pieces and space/piece finding methods not fully implemented
    def add_pieces(self, pieces):
        for piece in pieces:
            space = self.find_space(piece.x, piece.y)
            if space is not None:
                space.has_piece = True
                space.piece = piece

    def find_space(self, x, y):
        pass

    def find_piece(self, x, y):
        pass

    def make_initial_pieces(self, top_player_num, bottom_player_num):
        pieces = [
            Piece(-6, -8, bottom_player_num, Elements.FIRE),
            Piece(-4, -8, bottom_player_num, Elements.WATER),
            Piece(-3, -7, bottom_player_num, Elements.EARTH),
            Piece(-3, -9, bottom_player_num, Elements.AIR),
            Piece(-2, -10, bottom_player_num, Elements.FIRE),
            Piece(-1, -11, bottom_player_num, Elements.EARTH),
            Piece(0, -12, bottom_player_num, Elements.LOTUS),
            Piece(1, -11, bottom_player_num, Elements.AIR),
            Piece(2, -10, bottom_player_num, Elements.WATER),
            Piece(3, -9, bottom_player_num, Elements.EARTH),
            Piece(3, -7, bottom_player_num, Elements.AIR),
            Piece(4, -8, bottom_player_num, Elements.FIRE),
            Piece(6, -8, bottom_player_num, Elements.WATER),
            Piece(0, -8, bottom_player_num, Elements.AVATAR),

            Piece(-6, 8, top_player_num, Elements.WATER),
            Piece(-4, 8, top_player_num, Elements.FIRE),
            Piece(-3, 7, top_player_num, Elements.AIR),
            Piece(-3, 9, top_player_num, Elements.EARTH),
            Piece(-2, 10, top_player_num, Elements.WATER),
            Piece(-1, 11, top_player_num, Elements.AIR),
            Piece(0, 12, top_player_num, Elements.LOTUS),
            Piece(1, 11, top_player_num, Elements.EARTH),
            Piece(2, 10, top_player_num, Elements.FIRE),
            Piece(3, 9, top_player_num, Elements.AIR),
            Piece(3, 7, top_player_num, Elements.EARTH),
            Piece(4, 8, top_player_num, Elements.WATER),
            Piece(6, 8, top_player_num, Elements.FIRE),
            Piece(0, 8, top_player_num, Elements.AVATAR),
        ]
        return pieces

    def asdict(self):
        return dict(
            spaces=[(None if space is None else space.asdict()) for space in self.spaces],
            pieces=[(None if piece is None else piece.asdict()) for piece in self.pieces]
        )

    @classmethod
    def fromdict(cls, board_dict):
        board = Board()
        board.pieces = [Piece(p['x'], p['y'], p['player_number'], p['element']) for p in board_dict['pieces']]
        return board
