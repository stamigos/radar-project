from datetime import timedelta
import redis
from celery import Celery
from flask import Flask
from flask_socketio import SocketIO


import config


# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.config.from_object('config')
rdb = redis.Redis(host='localhost', port=6379, db=0)
socketio = SocketIO(app, async_mode=async_mode)
thread = None


def make_celery(app):
    _celery = Celery(app.import_name,
                     broker=app.config['CELERY_BROKER_URL'])
                     #backend=app.config['CELERY_RESULT_BACKEND'])
    _celery.conf.update(app.config)
    _celery.conf.update(
        celery_result_expires=3,
    )
    TaskBase = _celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    _celery.Task = ContextTask
    return _celery

celery = make_celery(app)


import views





