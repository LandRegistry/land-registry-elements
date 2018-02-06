#!/bin/bash

cp /node_modules/skeleton-webseal-templates/package-lock.json .
npm run build
/usr/bin/gunicorn -k eventlet --pythonpath /src --access-logfile - manage:manager.app --reload
