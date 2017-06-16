import misaka
from jinja2 import Markup


class GovRenderer(misaka.HtmlRenderer):

    def header(self, content, level):
        """Custom renderer to map Markdown heading levels to gov.uk heading classes

        See https://github.com/hoedown/hoedown/blob/master/src/html.c for reference
        on what methods are available to override
        """
        heading_levels = {
            1: 'heading-xlarge',
            2: 'heading-large',
            3: 'heading-medium',
            4: 'heading-small',
            5: 'heading-small',
            6: 'heading-small'
        }

        return '<h{0} class="{1}">{2}</h{0}>'.format(level, heading_levels.get(level), content)

    def list(self, content, is_ordered, is_block):
        """Custom renderer to output lists with the gov.uk classes"""
        return '<{0} class="list list-{1}">{2}</{0}>'.format(
            'ol' if is_ordered else 'ul',
            'number' if is_ordered else 'bullet',
            content
        )

    def double_emphasis(self, content):
        return '<strong class="bold">{}</strong>'.format(content)


def render_markdown(content):
    md = misaka.Markdown(GovRenderer(), extensions=('autolink',))
    return Markup(md(content))
