from flask import Flask

app = Flask(__name__)

#from webapp import routes


@app.route('/')
@app.route('/index')
def index():
    return 'hello from webapp!'


app.run('localhost', 5001)

