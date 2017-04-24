import os

DEBUG = True

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
DB_CONFIG = dict(database="radar.db",
                 user="radar",
                 password="123",
                 host="localhost",
                 port=5432,
                 register_hstore=False,
                 autorollback=True,
                 threadlocals=True)

SECRET_KEY = 'top-secret'

MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')
MEDIA_URL = '/media'

RADAR_OBJECTS_URL = 'http://caloric2.prometrix.se/radar/radar.php'

PULLING_INTERVAL = 0.3

CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

NOTIFIER_HOST = os.environ.get('NOTIFIER_PORT_3000_TCP_ADDR', 'localhost')
NOTIFIER_PORT = int(os.environ.get('NOTIFIER_PORT_3000_TCP_PORT', 3000))



