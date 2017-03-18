import datetime
from hashlib import sha1
import random
import requests

from peewee import ForeignKeyField
from peewee import Model

import config

def hash_pwd(password):
    return sha1(password).hexdigest()


def random_coord():
    return random.choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])


def convert_value(self, value):
        if isinstance(value, datetime.datetime):
            return value.strftime(self.datetime_format)
        elif isinstance(value, datetime.date):
            return value.strftime(self.date_format)
        elif isinstance(value, datetime.time):
            return value.strftime(self.time_format)
        elif isinstance(value, Model):
            return value.get_id()
        else:
            return value


def clean_data(data):
    for key, value in data.items():
        if isinstance(value, dict):
            clean_data(value)
        elif isinstance(value, (list, tuple)):
            data[key] = map(clean_data, value)
        else:
            data[key] = convert_value(value)
    return data


def get_dictionary_from_model(model, fields=None, exclude=None):
    model_class = type(model)
    data = {}

    fields = fields or {}
    exclude = exclude or {}
    curr_exclude = exclude.get(model_class, [])
    curr_fields = fields.get(model_class, model._meta.sorted_field_names)

    for field_name in curr_fields:
        if field_name in curr_exclude:
            continue
        field_obj = model_class._meta.fields[field_name]
        field_data = model._data.get(field_name)
        if isinstance(field_obj, ForeignKeyField) and field_data and field_obj.rel_model in fields:
            rel_obj = getattr(model, field_name)
            data[field_name] = get_dictionary_from_model(rel_obj, fields, exclude)
        else:
            data[field_name] = field_data
    return data


def pull_radar_objects():
    r = requests.get(config.RADAR_OBJECTS_URL)
    return r.json()


