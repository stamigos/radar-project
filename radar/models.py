from werkzeug.utils import secure_filename
from peewee import (SqliteDatabase, Model, CharField, TextField, ForeignKeyField, IntegerField, SmallIntegerField,
                    DateTimeField, DoubleField, BooleanField, DecimalField, datetime as peewee_datetime, FloatField,
                    fn)

from flask import request

from config import *

db = SqliteDatabase(**DB_CONFIG)
db.commit_select = True
db.autorollback = True

peewee_now = peewee_datetime.datetime.now


class _Model(Model):

    class Meta:
        database = db


class Account(_Model):

    class Meta:
        database = db

    email = CharField(unique=True)
    password = CharField()
    created = DateTimeField(default=peewee_now)


class BaseModel(Model):

    class Meta:
        database = db

    index = IntegerField(null=True)  # index to be used for sorting in some lists
    enabled = BooleanField(default=True)  # if the object is enabled / disabled in the system
    description = TextField(null=True)  # object description, like address or other.
    visible = BooleanField(default=True)  # Visible in the object list
    location = TextField(null=True)  # gps coordinate, perhaps for later presentation on google maps.
    type = IntegerField(null=True)


class Image(_Model):

    class Meta:
        db_table = "images"

    image = CharField(null=True)

    def __unicode__(self):
        return self.image

    def save_image(self, file_obj):
        self.image = secure_filename(file_obj.filename)
        full_path = os.path.join(MEDIA_ROOT, self.image)
        file_obj.save(full_path)
        self.save()

    def url(self):
        return os.path.join(MEDIA_URL, self.image)


class RadarView(BaseModel):

    class Meta:
        db_table = "radar_views"

    bg_image = ForeignKeyField(Image, null=True)
    image_scaling = FloatField(null=True)
    view_scaling = FloatField(null=True)

    def upload_photo(self):
        if 'image' in request.files:
            _file = request.files['image']
            image = Image.create(image=_file.filename)
            image.save_image(_file)
            self.bg_image = image
            self.save()
            return os.path.join(MEDIA_URL, image.image)
        return None


class Radar(BaseModel):

    class Meta:
        db_table = "radars"

    ip_address = CharField(default="localhost", null=True)
    off_x_distance = CharField(null=True)  # installation off x distance
    off_y_distance = CharField(null=True)  # installation off y distance
    az_angle = CharField(null=True)  # installation azimuth angle
    el_angle = CharField(null=True)  # installation elevation angle
    height = CharField(null=True)  # installation height
    level = CharField(null=True)  # installation level


class AlarmZone(BaseModel):

    class Meta:
        db_table = "alarm_zones"

    enable_urls = TextField(null=True)
    disable_urls = TextField(null=True)
    timeout = SmallIntegerField(null=True)
    delay = SmallIntegerField(null=True)
    polygon = TextField(null=True)  # Example: [(0, 0), (0, 1), (1, 1), (1, 0)]
    color = TextField(null=True)
    name = CharField(null=True, unique=True)
    fabric_state = TextField(null=True)


class RadarObject(_Model):

    class Meta:
        db_table = "radar_objects"

    object_id = CharField(null=True)
    timestamp_upper = CharField(null=True)
    timestamp_lower = CharField(null=True)
    quality = CharField(null=True)
    c_distance_x = CharField(null=True)
    c_distance_y = CharField(null=True)
    c_velocity_x = CharField(null=True)
    c_velocity_y = CharField(null=True)
    p_distance = CharField(null=True)
    p_velocity = CharField(null=True)
    p_angle = CharField(null=True)

    def __unicode__(self):
        return self.id


class AlarmLog(_Model):

    class Meta:
        db_table = "alarm_zone_logs"

    alarm_zone = ForeignKeyField(AlarmZone, null=True)
    timestamp = DateTimeField(default=peewee_now)
    radar_object = ForeignKeyField(RadarObject, null=True)




