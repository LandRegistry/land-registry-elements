from flask import Blueprint
from flask import render_template


# This is the blueprint object that gets registered into the app in blueprints.py.
example = Blueprint('example', __name__)


@example.route("/")
def index():
    return render_template('app/example.html', title='Example')
