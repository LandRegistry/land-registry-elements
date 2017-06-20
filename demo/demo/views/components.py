from flask import Blueprint
from flask import flash
from flask import render_template
from flask import url_for
from flask_wtf import FlaskForm
from glob import glob
from os import path
from wtforms import widgets
from wtforms.fields import BooleanField
from wtforms.fields import RadioField
from wtforms.fields import SelectField
from wtforms.fields import SelectMultipleField
from wtforms.fields import StringField
from wtforms.fields import PasswordField
from wtforms.validators import InputRequired
from wtforms.validators import Length
from wtforms.validators import EqualTo
from wtforms.validators import ValidationError

# This is the blueprint object that gets registered into the app in blueprints.py.
components = Blueprint('components', __name__)



@components.route("/")
def index():
    def parse_path(demo_path):
        demo_path = path.relpath(demo_path, 'src/land_registry_elements').replace('/demos', '').replace('.html', '')
        path_parts = demo_path.split('/')
        return url_for('components.component_demo', component_name=path_parts[0], demo_name=path_parts[1])

    demos = glob('src/land_registry_elements/**/demos/*.html')
    parsed_demos = sorted(list(map(parse_path, demos)))

    return render_template('app/index.html', demos=parsed_demos)


@components.route('/<component_name>/<demo_name>')
def component_demo(component_name, demo_name):

    readme = open('src/land_registry_elements/{}/README.md'.format(component_name))

    return render_template('land_registry_elements/{}/demos/{}.html'.format(component_name, demo_name),
                           readme=readme.read()
                           )


@components.route('/clientside-form-validation/demo', methods=['GET', 'POST'])
def clientside_form_validation_demo():
    form = ExampleForm()

    readme = open('src/land_registry_elements/clientside-form-validation/README.md')

    if form.validate_on_submit():
      flash('Success!')

    return render_template('land_registry_elements/clientside-form-validation/demos/demo.html',
                           readme=readme.read(),
                           form=form
                           )


class ExampleForm(FlaskForm):
    full_name = StringField('Full name',
                            validators=[InputRequired(message='Full name is required')]
                            )

    ni = StringField('National Insurance number',
                     validators=[InputRequired(message='National Insurance number is required')]
                     )

    checkbox = BooleanField('Boolean field',
                            validators=[InputRequired(message='Please tick the box')]
                            )

    select_field = SelectField('Select field',
                               [InputRequired(message='Please select an option')],
                               choices=[('', 'Please select'), ('one', 'One'), ('two', 'Two'), ('three', 'Three')],
                               default=''
                               )

    radio_field = RadioField('Radio field',
                             [InputRequired(message='Please select an option')],
                             choices=[('one', 'One'), ('two', 'Two'), ('three', 'Three')]
                             )

    checkboxes_field = SelectMultipleField('Select multiple',
                                           [InputRequired(message='Please select an option')],
                                           choices=[('one', 'One'), ('two', 'Two'), ('three', 'Three')],
                                           option_widget=widgets.CheckboxInput(),
                                           widget=widgets.ListWidget(prefix_label=False)
                                           )

    password = PasswordField('Create a password', validators=[
        InputRequired('Password is required'),
        EqualTo('password_retype', message='Please ensure both password fields match'),
    ])

    password_retype = PasswordField('Re-type your password')


    def validate_full_name(self, field):
        if field.data != 'John Smith':
            raise ValidationError('Example serverside error - type "John Smith" into this field to suppress it')
