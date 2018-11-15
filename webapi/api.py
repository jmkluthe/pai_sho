from flask import Flask
#import requests
from flask import jsonify, json
from flask import request
from webapi.piece import Piece
import webapi.rules_config as rules_config
from webapi.game import Game
import sys
import pprint as pp

api = Flask(__name__)


@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@api.route('/api/get-initial-setup', methods=['GET'])
def get_initial_setup():
    player1 = 1  # {'number': 1, 'name': 'one'}
    player0 = 0  # {'number': 0, 'name': 'zero'}
    pieces = [
        make_piece(-6, -8, player1, Piece.Fire),
        make_piece(-4, -8, player1, Piece.Water),
        make_piece(-3, -7, player1, Piece.Earth),
        make_piece(-3, -9, player1, Piece.Air),
        make_piece(-2, -10, player1, Piece.Fire),
        make_piece(-1, -11, player1, Piece.Earth),
        make_piece(0, -12, player1, Piece.Lotus),
        make_piece(1, -11, player1, Piece.Air),
        make_piece(2, -10, player1, Piece.Water),
        make_piece(3, -9, player1, Piece.Earth),
        make_piece(3, -7, player1, Piece.Air),
        make_piece(4, -8, player1, Piece.Fire),
        make_piece(6, -8, player1, Piece.Water),
        make_piece(0, -8, player1, Piece.Avatar),

        make_piece(-6, 8, player0, Piece.Water),
        make_piece(-4, 8, player0, Piece.Fire),
        make_piece(-3, 7, player0, Piece.Air),
        make_piece(-3, 9, player0, Piece.Earth),
        make_piece(-2, 10, player0, Piece.Water),
        make_piece(-1, 11, player0, Piece.Air),
        make_piece(0, 12, player0, Piece.Lotus),
        make_piece(1, 11, player0, Piece.Earth),
        make_piece(2, 10, player0, Piece.Fire),
        make_piece(3, 9, player0, Piece.Air),
        make_piece(3, 7, player0, Piece.Earth),
        make_piece(4, 8, player0, Piece.Water),
        make_piece(6, 8, player0, Piece.Fire),
        make_piece(0, 8, player0, Piece.Avatar),
    ]
    players = [{'number': 1, 'name': 'one'}, {'number': 0, 'name': 'zero'}]
    # print(Game(players).asdict(), file=sys.stderr)
    # sys.stdout = sys.stderr
    # pp.pprint(Game(players).asdict())
    # sys.stderr = sys.stdout
    return jsonify(pieces)


@api.route('/api/get-rules', methods=['GET'])
def get_rules():
    rules = {'move_matrix': rules_config.move_matrix, 'take_matrix': rules_config.take_matrix}
    return jsonify(rules)


@api.route('/api/move', methods=["POST"])
def move():
    try:
        req = request.get_json()
        req = dict(req)
    except:
        return jsonify({'error': True})


def process_data():
    return


def make_piece(x, y, player, element):
    return {'x': x, 'y': y, 'player_number': player, 'element': element}
