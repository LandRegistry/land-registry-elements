from demo.demo.markdown_utils import render_markdown
from flask import Blueprint
from flask import render_template
from glob import glob
from os import path

# This is the blueprint object that gets registered into the app in blueprints.py.
incubation_area = Blueprint('incubation_area', __name__)



@incubation_area.route("/")
def index():
    def parse_path(demo_path):
        return path.relpath(demo_path, 'src/incubation_area').replace('/demos', '').replace('.html', '')

    demos = glob('src/incubation_area/**/demos/*.html')
    parsed_demos = sorted(list(map(parse_path, demos)))

    readme = open('src/incubation_area/README.md')

    return render_template('app/incubation-area.html',
                           demos=parsed_demos,
                           readme=render_markdown(readme.read())
                           )


@incubation_area.route('/<component_name>/<demo_name>')
def component_demo(component_name, demo_name):

    readme = open('src/incubation_area/{}/README.md'.format(component_name))

    return render_template('incubation_area/{}/demos/{}.html'.format(component_name, demo_name),
                           readme=render_markdown(readme.read())
                           )
