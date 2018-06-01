from webapp.app import app
from flask import render_template


@app.route('/')
@app.route('/index')
def index():
    message = {'message': 'Mario'}
    return render_template('index/index.html', message=message)

