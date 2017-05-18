from demo.extensions.cachebust_static_assets.main import CachebustStaticAssets
from demo.extensions.gzip_static_assets.main import GzipStaticAssets
from demo.extensions.security_headers.main import SecurityHeaders


# Create empty extension objects here
cachebust_static_assets = CachebustStaticAssets()
gzip_static_assets = GzipStaticAssets()
security_headers = SecurityHeaders()


def register_extensions(app):
    """Adds any previously created extension objects into the app, and does any further setup they need."""
    cachebust_static_assets.init_app(app)
    gzip_static_assets.init_app(app)
    security_headers.init_app(app)

    # All done!
    app.logger.info("Extensions registered")
