from peewee import (PostgresqlDatabase, Model, TextField, IntegerField, BooleanField, datetime as peewee_datetime)

import config

db = PostgresqlDatabase(**config.DB_CONFIG)
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
