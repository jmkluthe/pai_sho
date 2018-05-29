from webapp.app import app
from flask import render_template


@app.route('/')
@app.route('/index')
def index():
    message = {}
    message['message'] = "Mario"
    return render_template('webapp/index/templates/index.html', message=message)

