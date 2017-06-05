from flask import Blueprint
from flask import render_template
from glob import glob
from os import path


# This is the blueprint object that gets registered into the app in blueprints.py.
components = Blueprint('example', __name__)



@components.route("/")
def index():
    def parse_path(demo_path):
        return path.relpath(demo_path, 'src/land-registry-elements').replace('/demos', '').replace('.html', '')

    demos = glob('src/land-registry-elements/**/demos/*.html')
    parsed_demos = list(map(parse_path, demos))

    return render_template('app/index.html', demos=parsed_demos)


@components.route('/<component_name>/<demo_name>')
def component_demo(component_name, demo_name):
    return render_template('land-registry-elements/{}/demos/{}.html'.format(component_name, demo_name))
