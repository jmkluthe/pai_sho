from flask import Flask

api = Flask(__name__)


@api.route('/')
@api.route('/index')
def index():
    return 'hello from webapi!'


