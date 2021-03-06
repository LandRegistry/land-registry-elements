from flask import Blueprint
from flask import render_template
from flask import url_for
from glob import glob
from os import path

# This is the blueprint object that gets registered into the app in blueprints.py.
incubation_area = Blueprint('incubation_area', __name__)



@incubation_area.route("/")
def index():
    def parse_path(demo_path):
        demo_path = path.relpath(demo_path, 'src/incubation_area').replace('/demos', '').replace('.html', '')
        path_parts = demo_path.split('/')
        return url_for('incubation_area.component_demo', component_name=path_parts[0], demo_name=path_parts[1])

    demos = glob('src/incubation_area/**/demos/*.html')
    parsed_demos = sorted(list(map(parse_path, demos)))

    readme = open('src/incubation_area/README.md')

    return render_template('app/incubation-area.html',
                           demos=parsed_demos,
                           readme=readme.read()
                           )


@incubation_area.route('/<component_name>/<demo_name>')
def component_demo(component_name, demo_name):

    readme = open('src/incubation_area/{}/README.md'.format(component_name))

    return render_template('incubation_area/{}/demos/{}.html'.format(component_name, demo_name),
                           readme=readme.read()
                           )
