from demo.demo.landregistry_flask import LandRegistryFlask
from jinja2 import FileSystemLoader
from jinja2 import PackageLoader
from jinja2 import PrefixLoader
from os import getcwd
from os.path import join
import os


app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/static'
                        )


# Set Jinja up to be able to load templates from packages (See gadget-govuk-ui for a full example)
app.jinja_loader = PrefixLoader({
    'app': PackageLoader('demo.demo'),
    'land_registry_elements': FileSystemLoader('src/land_registry_elements'),
    'govuk_elements_jinja_macros': PackageLoader('govuk_elements_jinja_macros'),
    'incubation_area': FileSystemLoader('src/incubation_area')
})

app.config.from_pyfile("config.py")


@app.context_processor
def inject_global_values():
    """Inject global template values

    Use this to inject values into the templates that are used globally.
    This might be things such as google analytics keys, or even the current username
    """

    return dict(
        service_name='Land Registry Elements'
    )
