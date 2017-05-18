# Import every blueprint file
from demo.demo.views import components


def register_blueprints(app):
    """
    Adds all blueprint objects into the app.
    """
    app.register_blueprint(components.components)

    # All done!
    app.logger.info("Blueprints registered")
