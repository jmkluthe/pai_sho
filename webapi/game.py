import webapi.rules_config as rules
from webapi.board import Board


class Game(object):
    __slots__ = ['move_matrix',
                 'take_matrix',
                 'players',
                 'board',
                 'player_moving',
                 'turn_number',
                 'winner',
                 'moves',
                 'game_id',
                 'game_name']

    def __init__(self, players):
        self.move_matrix = rules.move_matrix
        self.take_matrix = rules.take_matrix
        self.players = players
        self.board = Board()
        self.player_moving = 0
        self.turn_number = 0
        self.winner = None
        self.moves = []
        self.game_id = None
        self.game_name = None

    def asdict(self):
        return dict(
            move_matrix=self.move_matrix,
            take_matrix=self.take_matrix,
            players=self.players,
            board=None if self.board is None else self.board.asdict(),
            player_moving=self.player_moving,
            turn_number=self.turn_number,
            winner=self.winner,
            moves=self.moves,
            game_id=self.game_id,
            game_name=self.game_name
        )

