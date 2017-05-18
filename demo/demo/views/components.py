from flask import Blueprint
from flask import render_template


# This is the blueprint object that gets registered into the app in blueprints.py.
components = Blueprint('example', __name__)


@components.route("/")
def index():
    return render_template('app/index.html')
