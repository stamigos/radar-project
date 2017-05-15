from peewee import CharField, DateTimeField, IntegerField

from base import peewee_now, db, _Model
from config import RADAR_OBJECTS_URL, PULLING_INTERVAL


class Account(_Model):

    class Meta:
        database = db

    email = CharField(unique=True)
    password = CharField()
    created = DateTimeField(default=peewee_now)
    radar_objects_url = CharField(default=RADAR_OBJECTS_URL)
    pulling_interval = CharField(default=PULLING_INTERVAL)
