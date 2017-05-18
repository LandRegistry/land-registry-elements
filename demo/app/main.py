# This file is the entry point.
# First we import the app object, which will get initialised as we do it. Then import methods we're about to use.
from app.app import app
from app.blueprints import register_blueprints
from app.exceptions import register_exception_handlers
from app.extensions.register import register_extensions

# Now we register any extensions we use into the app
register_extensions(app)
# Register the exception handlers
register_exception_handlers(app)
# Finally we register our blueprints to get our routes up and running.
register_blueprints(app)
