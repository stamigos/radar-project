import math
from ast import literal_eval
from matplotlib.path import Path

from flask import jsonify

from radar import models
from utils import get_dictionary_from_model


class CheckObjectController(object):
    def __call__(self, _object):
        width = 700
        height = 525
        point_x = math.floor((float(_object['distance_x'])*width)/300) + width/2
        point_y = height - math.floor((float(_object['distance_y'])*height)/350)
        print("OBJECT_ID: ", _object['object_id'])
        print("POINT x y : ", point_x, " ", point_y)
        result = self._check_alarm_zones(point_x, point_y, _object)
        print("INTERSECTED ZONES: ", result)
        return result

    def _get_polygon(self, alarm_zone):
        points_dict = [(float(literal_eval(point)[0]), float(literal_eval(point)[1]))
                       for point in literal_eval(alarm_zone.polygon)]
        return Path(points_dict)  # [(0, 0), (0, 1), (1, 1), (1, 0)])

    def _check_point(self, point_x, point_y, alarm_zone):
        polygon = self._get_polygon(alarm_zone)
        return polygon.contains_point((point_x, point_y))

    def _check_alarm_zones(self, point_x, point_y, _object):
        contains = False
        alarm_zones = [az for az in models.AlarmZone.select()]
        for az in alarm_zones:
            if self._check_point(point_x, point_y, az):
                contains = True
                self._create_alarm_log(az, _object)
        return contains

    def _create_alarm_log(self, alarm_zone, radar_object):
        return get_dictionary_from_model(
            models.AlarmLog.create(
                alarm_zone=alarm_zone,
                radar_object=radar_object['object_id']
            )
        )

