from flask_script import Manager
from demo.demo.main import app
import subprocess
import os


manager = Manager(app)

@manager.command
def runserver(port=9998):
    """Run the app using flask server"""

    os.environ["PYTHONUNBUFFERED"] = "yes"
    os.environ["LOG_LEVEL"] = "DEBUG"
    os.environ["COMMIT"] = "LOCAL"

    app.run(port=int(port))

if __name__ == "__main__":
    manager.run()
