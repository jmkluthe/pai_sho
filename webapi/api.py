from flask import Flask
import requests #is this even necessary?
from flask import jsonify
from flask import request


api = Flask(__name__)


@api.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@api.route('/api/get-initial', methods=["POST"])
def get_initial():
    pieces = [
        {'x': 0, 'y': 0, 'player': {'number': 1, 'name': 'one'}, 'piece': {'color': 'red'}},
        {'x': -2, 'y': 0, 'player': {'number': 1, 'name': 'one'}, 'piece': {'color': 'red'}},
        {'x': -1, 'y': 1, 'player': {'number': 1, 'name': 'one'}, 'piece': {'color': 'blue'}}
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


