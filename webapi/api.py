from flask import Flask
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
    players = {0: {'name': 'Computer', 'type': 0}, 1: {'name': 'Human', 'type': 1}}
    return jsonify(Game(players).asdict())


# @api.route('/api/get-rules', methods=['GET'])
# def get_rules():
#     rules = {'move_matrix': rules_config.move_matrix, 'take_matrix': rules_config.take_matrix}
#     return jsonify(rules)


@api.route('/api/move', methods=["POST"])
def move():
    try:
        req = request.get_json()
        pp.pprint(req)
        return jsonify({'error': False})
    except Exception as e:
        print(e)
        return jsonify({'error': True})



