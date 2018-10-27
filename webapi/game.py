import webapi.rules_config as rules
from webapi.board import Board


class Game(object):
    def __init__(self, player0=None, player1=None, pieces=None):
        self.move_matrix = rules.move_matrix
        self.take_matrix = rules.take_matrix
        if not player1:
            player1 = {'number': 1, 'name': 'one'}
        if not player0:
            player0 = {'number': 0, 'name': 'zero'}
        self.players = [player0, player1]
        self.board = Board(player0, player1, pieces)
        self.player_moving = 0
        self.turn_number = 0
        self.winner = None
        self.moves = []






