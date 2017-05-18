from flask import current_app
from flask import jsonify
from flask import render_template
from app import utils
from jinja2 import TemplateNotFound
from werkzeug.exceptions import default_exceptions
from werkzeug.exceptions import HTTPException


class ApplicationError(Exception):
    """
    This class is to be raised when the application identifies that there's been a problem
    and that the user should be informed.

    This should only be used for absolute edge case exceptions.
    As a matter of course, exceptions should be caught and dealt with higher up
    in the flow and users should be given a decent onward journey.

    Consider security issues when writing messages - what information might you
    be revealing to potential attackers?

    Example:
        raise ApplicationError('Friendly message here', 'E102', 400)
    """
    def __init__(self, message, code=None, http_code=500):
        Exception.__init__(self)
        self.message = message
        self.http_code = http_code
        self.code = code


def unhandled_exception(e):
    current_app.logger.exception('Unhandled Exception: %s', repr(e))

    http_code = 500

    # Negotiate based on the Accept header
    if utils.request_wants_json():
        return jsonify({}), http_code
    else:
        return render_template('app/errors/unhandled.html',
                               http_code=http_code,
                               ), http_code


def http_exception(e):
    current_app.logger.exception('HTTP Exception: %s', repr(e))

    # Restrict error codes to a subset so that we don't inadvertently expose
    # internal system information via error codes
    if isinstance(e, HTTPException) and e.code in [500, 404, 403, 429]:
        http_code = e.code
    else:
        http_code = 500

    # Negotiate based on the Accept header
    if utils.request_wants_json():
        return jsonify({}), http_code
    else:
        return render_template('app/errors/unhandled.html',
                               http_code=http_code,
                               ), http_code


def application_error(e):
    current_app.logger.debug('Application Exception: %s', repr(e), exc_info=True)

    # ApplicationError allows developers to specify an HTTP code.
    # This will be written to the logs correctly, but we don't want to allow
    # this code through to the user as it may expose internal workings of the system
    # (See OWASP guidelines on error handling)
    if e.http_code in [500, 404, 403, 429]:
        http_code = e.http_code
    else:
        http_code = 500

    if utils.request_wants_json():
        return jsonify({
                       'message': e.message,
                       'code': e.code
                       }), http_code
    else:
        try:
            return render_template('app/errors/application/{}.html'.format(e.code),
                                   description=e.message,
                                   code=e.code,
                                   http_code=http_code
                                   ), http_code
        except TemplateNotFound:
            return render_template('app/errors/application.html',
                                   description=e.message,
                                   code=e.code,
                                   http_code=http_code
                                   ), http_code


def register_exception_handlers(app):
    app.register_error_handler(ApplicationError, application_error)
    app.register_error_handler(Exception, unhandled_exception)

    # Register all default HTTP exceptions from werkzeug
    for exception in default_exceptions:
        app.register_error_handler(exception, http_exception)

    app.logger.info('Exception handlers registered')
