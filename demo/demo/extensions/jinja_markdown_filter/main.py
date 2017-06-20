import misaka
from jinja2 import Markup
from demo.demo.extensions.jinja_markdown_filter.gov_renderer import GovRenderer


class JinjaMarkdownFilter(object):
    """Markdown filter for Jinja templates"""

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.jinja_env.filters['markdown'] = markdown_filter


def markdown_filter(value):
    md = misaka.Markdown(GovRenderer(), extensions=('autolink',))
    return Markup(md(value))
