import json
import math
from ast import literal_eval
from datetime import timedelta, datetime

import requests
from matplotlib.path import Path
from peewee import CharField, FloatField, ForeignKeyField, DoesNotExist, DateTimeField, PrimaryKeyField

from radar import socketio, rdb
from base import peewee_now, db, _Model
from utils import get_dictionary_from_model
from .alarm_zone import AlarmZone
from .account import Account

canvas_width = 700
canvas_height = 525


class RadarObject(_Model):

    class Meta:
        db_table = "radar_objects"

    object_id = PrimaryKeyField(null=True)
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
        return self.object_id

    @staticmethod
    def list_all():
        return [r_obj for r_obj in RadarObject.select()]

    def json(self):
        return get_dictionary_from_model(self)

    @staticmethod
    def pull_objects_from_redis():
        radar_objects = rdb.hgetall("radar_objects")
        print "radar_objects hgetall: ", radar_objects
        return radar_objects

    @classmethod
    def populate_and_save(cls):
        radar_objects = cls.pull_objects_from_redis() # pulling saving radar objects into database
        cls.create_from_objects(radar_objects)
        # alarm_logs, contains = cls.contains_in_alarm_zones(radar_objects)  # check if contains in alarm zones
        # return {
        #   'objects': [r for r in radar_objects],
        #   'alarm_logs': {
        #       'list': alarm_logs,
        #       'updated': contains
        #   }
        # }

    @staticmethod
    def create_from_objects(objects):
        """
            Create radar objects from
            received objects dictionary
        """
        r_objects = []
        with db.atomic() as transaction:
            for _object in objects:
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
                except RadarObject.DoesNotExist:
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

    @classmethod
    def contains_in_alarm_zones(cls, radar_objects):
        """
        :return: Updated alarm logs
        """
        alarm_logs = []
        contains = False
        for obj in radar_objects:
            if cls.check_object(obj):
                contains = True
        if contains:
            alarm_logs = AlarmLog.list_all_json()
        return alarm_logs, contains

    @classmethod
    def check_object(cls, r_object):
        return cls._check_in_alarm_zones(r_object)

    @staticmethod
    def _get_polygon(a_zone):
        """
            Converts polygon into
            'matplotlib' format
        """
        points_dict = [(float(literal_eval(point)[0]), float(literal_eval(point)[1]))
                       for point in literal_eval(a_zone.polygon)]
        return Path(points_dict)  # [(0, 0), (0, 1), (1, 1), (1, 0)])

    @classmethod
    def _check_in_alarm_zones(cls, obj):
        """
            Check if alarm zones
            contains radar object
        """
        point_x = math.floor((float(obj['distance_x'])*canvas_width)/300 + canvas_width/2),
        point_y = canvas_height - math.floor((float(obj['distance_y'])*canvas_height)/350)
        if isinstance(point_x, tuple):
            point_x = point_x[0]

        if isinstance(point_y, tuple):
            point_y = point_y[0]

        contains = False
        alarm_zones = AlarmZone.list_all()
        for az in alarm_zones:
            if cls._check_point(point_x, point_y, az):
                contains = True
                AlarmLog.create_or_update_to_in(az, obj)
            else:
                AlarmLog.update_to_out(az, obj)
        return contains

    @classmethod
    def _check_point(cls, point_x, point_y, a_zone):
        polygon = cls._get_polygon(a_zone)
        return polygon.contains_point((point_x, point_y))

    @staticmethod
    def pull_objects(radar_objects_url):
        r = requests.get(radar_objects_url)
        if r.status_code != 200:
            return []
        return r.json()['objects']

    # -------- redis methods ---------
    @classmethod
    def redis_contains_in_alarm_zones(cls, radar_objects):
        """
        :return: Updated alarm logs
        """
        contains = False
        alarm_zones = AlarmZone.list_all()
        for obj in radar_objects:
            if cls.redis_check_object(obj, alarm_zones):
                contains = True
        alarm_logs = AlarmLog.redis_list_all_json()
        return alarm_logs, contains

    @classmethod
    def redis_check_object(cls, obj, alarm_zones):
        return cls._redis_check_in_alarm_zones(obj, alarm_zones)

    @classmethod
    def _redis_check_in_alarm_zones(cls, obj, alarm_zones):
        """
            Check if alarm zones
            contains radar object
        """
        point_x = math.floor((float(obj['distance_x'])*canvas_width)/300 + canvas_width/2),
        point_y = canvas_height - math.floor((float(obj['distance_y'])*canvas_height)/350)
        if isinstance(point_x, tuple):
            point_x = point_x[0]

        if isinstance(point_y, tuple):
            point_y = point_y[0]

        contains = False
        for az in alarm_zones:
            if cls._check_point(point_x, point_y, az):
                contains = True
                AlarmLog.redis_create_or_update_to_in(az, obj)
            else:
                AlarmLog.redis_update_to_out(az, obj)
        return contains

    @staticmethod
    def redis_create_from_objects(objects):
        """
            Set radar objects in redis db
        """
        rdb.hmset("radar_objects", {'objects': objects})

    @classmethod
    def redis_populate_and_save(cls):
        account = Account.get(Account.id == 1)
        radar_objects = cls.pull_objects(account.radar_objects_url)  # pulling radar objects
        cls.redis_create_from_objects(radar_objects)
        alarm_logs, contains = cls.redis_contains_in_alarm_zones(radar_objects)  # check if contains in alarm zones
        return {
          'objects': [r for r in radar_objects],
          'alarm_logs': {
              'list': alarm_logs,
              'updated': contains
          }
        }


class AlarmLog(_Model):

    class Meta:
        db_table = "alarm_zone_logs"

    alarm_zone = ForeignKeyField(AlarmZone, null=True)
    timestamp = DateTimeField(default=peewee_now)
    radar_object = CharField(null=True)
    state = CharField(null=True)  # IN/OUT

    def get_json(self):
        data = get_dictionary_from_model(self)
        try:
            az = AlarmZone.get(AlarmZone.id == data['alarm_zone'])
            data['alarm_zone'] = get_dictionary_from_model(az)
        except AlarmZone.DoesNotExist:
            pass
        try:
            # r_obj = RadarObject.get(RadarObject.object_id == int(data['radar_object']))
            data['radar_object'] = json.loads(data['radar_object'])
        except RadarObject.DoesNotExist:
            pass

        return data

    @staticmethod
    def list_all_json():
        return [al.get_json() for al in AlarmLog.select().where(
            AlarmLog.timestamp > (datetime.now()-timedelta(hours=2))
        )]

    @staticmethod
    def create_or_update_to_in(_alarm_zone, _radar_object):
        try:
            alarm_log = AlarmLog.get(AlarmLog.alarm_zone == _alarm_zone.id,
                                     AlarmLog.radar_object == _radar_object['object_id'])
            alarm_log.state = "IN"
            alarm_log.save()
        except DoesNotExist:
            return get_dictionary_from_model(
                AlarmLog.create(
                    alarm_zone=_alarm_zone,
                    radar_object=json.dumps(_radar_object),
                    state="IN"
                )
            )

    @staticmethod
    def update_to_out(_alarm_zone, _radar_object):
        try:
            alarm_log = AlarmLog.get(AlarmLog.alarm_zone == _alarm_zone,
                                     AlarmLog.radar_object == _radar_object['object_id'])
            alarm_log.state = "OUT"
            alarm_log.save()
        except DoesNotExist:
            pass

    # -------- redis methods --------
    @staticmethod
    def redis_list_all_json():
        alarm_logs = rdb.hgetall('alarm_logs')
        if alarm_logs:
            return json.loads(alarm_logs.get('alarm_logs')) if alarm_logs.get('alarm_logs') else []
        else:
            return []

    @staticmethod
    def redis_clear_logs():
        rdb.hmset("alarm_logs", {"alarm_logs": "[]"})

    @staticmethod
    def redis_create_or_update_to_in(_alarm_zone, _radar_object):
        result = rdb.hgetall("alarm_logs")
        alarm_logs = []
        if result:
            alarm_logs = json.loads(result['alarm_logs'])

        if alarm_logs:
            is_new_alarm_log = True
            for al in alarm_logs:
                if al['alarm_zone']['id'] == _alarm_zone.id and al['radar_object']['object_id'] == _radar_object['object_id']:
                    is_new_alarm_log = False
                    al.update({"alarm_zone": get_dictionary_from_model(_alarm_zone),
                               "radar_object": _radar_object,
                               "state": "IN",
                               "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                               })
                    rdb.hmset('alarm_logs', {"alarm_logs": json.dumps(alarm_logs)})

            if is_new_alarm_log:
                alarm_logs = alarm_logs[-10:]
                alarm_logs.append({
                    "alarm_zone": get_dictionary_from_model(_alarm_zone),
                    "radar_object": _radar_object,
                    "state": "IN",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })
                rdb.hmset("alarm_logs", {"alarm_logs": json.dumps(alarm_logs)})
        else:
            rdb.hmset("alarm_logs", {"alarm_logs": json.dumps([{
                "alarm_zone": get_dictionary_from_model(_alarm_zone),
                "radar_object": _radar_object,
                "state": "IN",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }])})

    @staticmethod
    def redis_update_to_out(_alarm_zone, _radar_object):
        result = rdb.hgetall("alarm_logs")
        alarm_logs = []
        if result:
            alarm_logs = json.loads(result['alarm_logs'])

        if alarm_logs:
            for al in alarm_logs:
                if al['alarm_zone']['id'] == _alarm_zone.id and al['radar_object']['object_id'] == _radar_object['object_id']:
                    al.update({"alarm_zone": get_dictionary_from_model(_alarm_zone),
                               "radar_object": _radar_object,
                               "state": "OUT",
                               "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                               })
                    rdb.hmset('alarm_logs', {"alarm_logs": json.dumps(alarm_logs)})
                    break

