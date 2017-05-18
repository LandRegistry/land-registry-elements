# Import every blueprint file
from app.views import example


def register_blueprints(app):
    """
    Adds all blueprint objects into the app.
    """
    app.register_blueprint(example.example)

    # All done!
    app.logger.info("Blueprints registered")
