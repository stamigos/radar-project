from peewee import CharField

from radar.models.base import BaseModel


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
