from flask import Flask
import os


class LandRegistryFlask(Flask):
    def get_send_file_max_age(self, name):
        """Far future expire header

        Send a far future expire header for static assets
        Overridden in this way rather than setting the corresponding environment
        variable because we don't want to interfere with other uses of send_file
        """
        static_file_extensions = [
            '.css',
            '.js',
            '.jpg',
            '.jpeg',
            '.gif',
            '.ico',
            '.png',
            '.ttf',
            '.eot',
            '.woff',
            '.woff2',
            '.otf',
            '.svg',
            '.webp'
        ]

        # Check the file extension against our list
        if os.path.splitext(name)[1] in static_file_extensions:
            return 315569520  # 10 years

        return super(LandRegistryFlask, self).get_send_file_max_age(name)
