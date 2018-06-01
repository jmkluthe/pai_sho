from flask import Flask
import jinja2

app = Flask(__name__)

# loader = jinja2.ChoiceLoader([
#     app.jinja_loader,
#     jinja2.FileSystemLoader(
#         'templates/*'
#     )
# ])
#
# app.jinja_loader = loader


from webapp.controllers import index

