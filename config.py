import os

DEBUG = True

PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

DB_CONFIG = dict(database="radar.db", autorollback=True)

SECRET_KEY = 'top-secret'
