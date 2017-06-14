#!/bin/bash

make build
/usr/bin/gunicorn -k eventlet --pythonpath /src --access-logfile - manage:manager.app --reload
