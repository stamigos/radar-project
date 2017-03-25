import math
from ast import literal_eval
from matplotlib.path import Path
from datetime import timedelta, datetime

import requests

import config
from . import *
from . import _Model
from .alarm_zone import AlarmZone

canvas_width = 700
canvas_height = 525


class RadarObject(_Model):

    class Meta:
        db_table = "radar_objects"

    object_id = CharField(null=True)
    timestamp_upper = CharField(null=True)
    timestamp_lower = CharField(null=True)
    quality = CharField(null=True)
    c_distance_x = FloatField(null=True)
    c_distance_y = FloatField(null=True)
    c_velocity_x = FloatField(null=True)
    c_velocity_y = FloatField(null=True)
    p_distance = FloatField(null=True)
    p_velocity = FloatField(null=True)
    p_angle = FloatField(null=True)

    def __unicode__(self):
        return self.id

    @staticmethod
    def list_all():
        return [r_obj for r_obj in RadarObject.select()]

    def json(self):
        return get_dictionary_from_model(self)

    @staticmethod
    def pull_objects_and_save():
        r = requests.get(config.RADAR_OBJECTS_URL)
        print ("response: ", r.json())
        return RadarObject.create_from_objects(r.json()['objects'])

    @staticmethod
    def create_from_objects(objects):
        """
            Create radar objects from
            received objects dictionary
        """
        r_objects = []
        for _object in objects:
            try:
                with db.atomic():
                    try:
                        r_object = RadarObject.get(
                            object_id=_object['object_id']
                        )
                        RadarObject.update(
                            quality=_object['quality'],
                            c_distance_x=_object['distance_x'],
                            c_distance_y=_object['distance_y'],
                            c_velocity_x=_object['velocity_x'],
                            c_velocity_y=_object['velocity_y'],
                            p_distance=_object['distance_polar'],
                            p_velocity=_object['speed_polar'],
                            p_angle=_object['angle']
                        ).execute()
                        r_objects.append(r_object)
                    except:
                        db.rollback()

            except RadarObject.DoesNotExist:
                with db.atomic():
                    try:
                        r_object = RadarObject.create(
                            object_id=_object['object_id'],
                            quality=_object['quality'],
                            c_distance_x=_object['distance_x'],
                            c_distance_y=_object['distance_y'],
                            c_velocity_x=_object['velocity_x'],
                            c_velocity_y=_object['velocity_y'],
                            p_distance=_object['distance_polar'],
                            p_velocity=_object['speed_polar'],
                            p_angle=_object['angle']
                        )
                        r_objects.append(r_object)
                    except:
                        db.rollback()
        return r_objects

    @staticmethod
    def contains_in_alarm_zones(radar_objects):
        """
        :return: Updated alarm logs
        """
        alarm_logs = []
        contains = False
        for obj in radar_objects:
            if obj.check_object():
                contains = True
        if contains:
            alarm_logs = AlarmLog.list_all_json()
        return alarm_logs, contains

    def check_object(self):
        return self._check_in_alarm_zones()

    def _get_polygon(self, a_zone):
        """
            Converts polygon into
            'matplotlib' format
        """
        points_dict = [(float(literal_eval(point)[0]), float(literal_eval(point)[1]))
                       for point in literal_eval(a_zone.polygon)]
        return Path(points_dict)  # [(0, 0), (0, 1), (1, 1), (1, 0)])

    def _check_in_alarm_zones(self):
        """
            Check if alarm zones
            contains radar object
        """
        point_x = math.floor((float(self.c_distance_x)*canvas_width)/300 + canvas_width/2),
        point_y = canvas_height - math.floor((float(self.c_distance_y)*canvas_height)/350)
        if isinstance(point_x, tuple):
            point_x = point_x[0]

        if isinstance(point_y, tuple):
            point_y = point_y[0]

        contains = False
        alarm_zones = AlarmZone.list_all()
        for az in alarm_zones:
            if self._check_point(point_x, point_y, az):
                contains = True
                AlarmLog.create_from(az, self)
        return contains

    def _check_point(self, point_x, point_y, a_zone):
        polygon = self._get_polygon(a_zone)
        return polygon.contains_point((point_x, point_y))


class AlarmLog(_Model):

    class Meta:
        db_table = "alarm_zone_logs"

    alarm_zone = ForeignKeyField(AlarmZone, null=True)
    timestamp = DateTimeField(default=peewee_now)
    radar_object = ForeignKeyField(RadarObject, null=True)

    def get_json(self):
        data = get_dictionary_from_model(self)
        try:
            az = AlarmZone.get(id=data['alarm_zone'])
            data['alarm_zone'] = get_dictionary_from_model(az)
        except AlarmZone.DoesNotExist:
            pass
        try:
            r_obj = RadarObject.get(id=data['radar_object'])
            data['radar_object'] = get_dictionary_from_model(r_obj)
        except RadarObject.DoesNotExist:
            pass

        return data

    @staticmethod
    def list_all_json():
        return [al.get_json() for al in AlarmLog.select().where(
            AlarmLog.timestamp > (datetime.now()-timedelta(hours=2))
        )]

    @staticmethod
    def create_from(_alarm_zone, _radar_object):
        return get_dictionary_from_model(
            AlarmLog.create(
                alarm_zone=_alarm_zone,
                radar_object=_radar_object
            )
        )

