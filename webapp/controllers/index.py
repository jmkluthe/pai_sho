from webapp.app import app
from flask import render_template


root_folder = "index/"


@app.route('/')
@app.route('/index')
def index():
    message = {'message': 'nexxium'}
    return render_template(root_folder + 'index.html', message=message)

