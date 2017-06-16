# Import every blueprint file
from demo.demo.views import components
from demo.demo.views import incubation_area


def register_blueprints(app):
    """
    Adds all blueprint objects into the app.
    """
    app.register_blueprint(components.components)
    app.register_blueprint(incubation_area.incubation_area, url_prefix='/incubation-area')

    # All done!
    app.logger.info("Blueprints registered")
