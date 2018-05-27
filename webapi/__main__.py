from flask import Flask

app = Flask(__name__)

#from webapi import routes


@app.route('/')
@app.route('/index')
def index():
    return 'hello from webapi!'


app.run('localhost', 5002)

