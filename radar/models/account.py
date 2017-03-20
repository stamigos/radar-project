from . import *
from . import _Model


class Account(_Model):

    class Meta:
        database = db

    email = CharField(unique=True)
    password = CharField()
    created = DateTimeField(default=peewee_now)
