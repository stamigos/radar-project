from flask import Flask
from flask_socketio import SocketIO


# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.config.from_object('config')
socketio = SocketIO(app, async_mode=async_mode)
thread = None

import views





