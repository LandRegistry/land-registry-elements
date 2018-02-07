from flask import current_app
from flask import url_for
import hashlib
import os


cache_busting_values = {}


class CachebustStaticAssets(object):

    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):

        @app.context_processor
        def override_url_for():
            return dict(url_for=hashed_url_for)


def hashed_url_for(endpoint, **values):

    """Cachebusting

    Use the md5 hash of the file on disk to perform cachebusting duties.
    This forces browsers to download new versions of files when they change.
    """
    if endpoint == 'static':
        filename = values.get('filename', None)

        if filename:
            file_path = os.path.join(current_app.root_path, current_app.static_folder, filename)

            # Store the hashes in a dict so that on subsequent
            # requests we don't have to md5 the file every time
            cached_hash = cache_busting_values.get(file_path)

            if cached_hash:
                values['cache'] = cached_hash
            else:
                try:
                    file_hash = md5_for_file(file_path, hexdigest=True)
                    cache_busting_values[file_path] = file_hash
                    values['cache'] = file_hash
                except FileNotFoundError as e:
                    # If the asset that is linked to from the HTML doesn't exist,
                    # we don't want to just die completely so catch the exception but log it
                    current_app.logger.info('File not found: {}'.format(file_path), exc_info=e)

    return url_for(endpoint, **values)


def md5_for_file(path, block_size=256*128, hexdigest=False):
    """Calculate an md5 hash for a file

    Block size directly depends on the block size of your filesystem
    to avoid performances issues
    Here I have blocks of 4096 octets (Default NTFS)
    """

    md5 = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size), b''):
            md5.update(chunk)
    if hexdigest:
        return md5.hexdigest()
    return md5.digest()
