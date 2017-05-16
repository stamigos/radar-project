from celery.bin import worker

from radar import app, celery

# application = current_app._get_current_object()

worker = worker.worker(app=celery)

options = {
    'broker': app.config['CELERY_BROKER_URL'],
    'loglevel': 'INFO',
    'traceback': True,
    'pool': 'solo'
}

if __name__ == '__main__':
    worker.run(**options)
