from demo.demo.landregistry_flask import LandRegistryFlask
from jinja2 import FileSystemLoader
from jinja2 import PackageLoader
from jinja2 import PrefixLoader
# from jinja2 import TemplateNotFound
# # from os import file
# from os.path import exists
# from os.path import getmtime
from os import getcwd
from os.path import join
import os
# from os.path import abspath

app = LandRegistryFlask(__name__,
                        template_folder='templates',
                        static_folder='assets/dist',
                        static_url_path='/static'
                        )


# Set Jinja up to be able to load templates from packages (See gadget-govuk-ui for a full example)
app.jinja_loader = PrefixLoader({
    'app': PackageLoader('demo.demo'),
    'land-registry-elements': FileSystemLoader('src')
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
