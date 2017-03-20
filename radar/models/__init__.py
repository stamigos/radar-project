from werkzeug.utils import secure_filename
from peewee import (SqliteDatabase, Model, CharField, TextField, ForeignKeyField, IntegerField, SmallIntegerField,
                    DateTimeField, DoubleField, BooleanField, DecimalField, datetime as peewee_datetime, FloatField,
                    fn, IntegrityError)

from flask import request

from config import *
from utils import get_dictionary_from_model

db = SqliteDatabase(**DB_CONFIG)
db.commit_select = True
db.autorollback = True

peewee_now = peewee_datetime.datetime.now


class _Model(Model):

    class Meta:
        database = db


class BaseModel(Model):

    class Meta:
        database = db

    index = IntegerField(null=True)  # index to be used for sorting in some lists
    enabled = BooleanField(default=True)  # if the object is enabled / disabled in the system
    description = TextField(null=True)  # object description, like address or other.
    visible = BooleanField(default=True)  # Visible in the object list
    location = TextField(null=True)  # gps coordinate, perhaps for later presentation on google maps.
    type = IntegerField(null=True)

from alarm_zone import AlarmZone
from radar_object import RadarObject, AlarmLog
from account import Account
from radar import Radar
from radar_view import RadarView
