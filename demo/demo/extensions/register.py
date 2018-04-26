from demo.demo.extensions.jinja_markdown_filter.main import JinjaMarkdownFilter


# Create empty extension objects here
jinja_markdown_filter = JinjaMarkdownFilter()


def register_extensions(app):
    """Adds any previously created extension objects into the app, and does any further setup they need."""
    jinja_markdown_filter.init_app(app)

    # All done!
    app.logger.info("Extensions registered")
