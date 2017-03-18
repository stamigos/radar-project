import os

DEBUG = True

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
DB_CONFIG = dict(database="radar.db", autorollback=True)

SECRET_KEY = 'top-secret'

MEDIA_ROOT = os.path.join(PROJECT_ROOT, 'media')
MEDIA_URL = '/media'

RADAR_OBJECTS_URL = 'http://caloric2.prometrix.se/radar/radar.php'
