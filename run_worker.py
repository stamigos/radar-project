from celery import current_app
from celery.bin import worker

from radar import app

application = current_app._get_current_object()

worker = worker.worker(app=application)

options = {
    'broker': app.config['CELERY_BROKER_URL'],
    'loglevel': 'INFO',
    'traceback': True,
}

if __name__ == '__main__':
    worker.run(**options)
