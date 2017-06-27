#!/bin/bash

\cp -r /tmp/land-registry-elements/* .    # Copy various pieces generated at build time back into the folder
rm -rf /tmp/land-registry-elements/*     # And then nuke the temporary build files - we don't want them to overwrite any newly created files every time the app restarts
/usr/bin/gunicorn -k eventlet --pythonpath /src --access-logfile - manage:manager.app --reload
