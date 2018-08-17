from flask import Flask
import requests #is this even necessary?
from flask import jsonify
from flask import request
from webapi.piece import Piece


api = Flask(__name__)


@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@api.route('/api/get-initial', methods=["POST"])
def get_initial():
    spaces = make_spaces()
    player1 = {'number': 1, 'name': 'one'}
    player2 = {'number': 1, 'name': 'one'}
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

        make_piece(-6, 8, player2, Piece.Water),
        make_piece(-4, 8, player2, Piece.Fire),
        make_piece(-3, 7, player2, Piece.Air),
        make_piece(-3, 9, player2, Piece.Earth),
        make_piece(-2, 10, player2, Piece.Water),
        make_piece(-1, 11, player2, Piece.Air),
        make_piece(0, 12, player2, Piece.Lotus),
        make_piece(1, 11, player2, Piece.Earth),
        make_piece(2, 10, player2, Piece.Fire),
        make_piece(3, 9, player2, Piece.Air),
        make_piece(3, 7, player2, Piece.Earth),
        make_piece(4, 8, player2, Piece.Water),
        make_piece(6, 8, player2, Piece.Fire),
        make_piece(0, 8, player2, Piece.Avatar),
    ]
    return jsonify(pieces)


@api.route('/api/move', methods=["POST"])
def move():
    try:
        req = request.get_json()
        req = dict(req)

    except:
        return jsonify({'error': True})


def process_data():
    return


def make_spaces():
    spaces = []
    for i in range(-12, 13):
        for j in range(-12, 13):
            if i * i + j * j <= 12.5 * 12.5 and (i + j) % 2 == 0:
                spaces.append({'x': i,
                               'y': j,
                               'hasPiece': False,
                               'selectable': False,
                               'selected': False})
    return spaces


def make_piece(x, y, player, piece):
    return {'x': x, 'y': y, 'player': player, 'piece': piece}