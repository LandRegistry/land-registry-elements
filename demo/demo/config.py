import os
# RULES OF CONFIG:
# 1. No region specific code. Regions are defined by setting the OS environment variables appropriately to build up the
# desired behaviour.
# 2. No use of defaults when getting OS environment variables. They must all be set to the required values prior to the
# app starting.
# 3. This is the only file in the app where os.environ should be used.

APP_NAME = os.environ['APP_NAME']

# For logging
FLASK_LOG_LEVEL = os.environ['LOG_LEVEL']

DEBUG = FLASK_LOG_LEVEL == 'DEBUG'
