from matplotlib.path import Path

from flask import jsonify

from radar import models
from . import BaseController


class CheckObjectController(BaseController):
    def __init__(self, request):
        super(CheckObjectController, self).__init__(request)

    def _call(self):
        point_x = self._verify_field("point_x")
        point_y = self._verify_field("point_y")
        azone_name = self._verify_field("alarmzone_name")
        return jsonify({"result": self._check_point(point_x, point_y, azone_name)})

    def _get_polygon(self, azone_name):
        alarm_zone = models.AlarmZone.get(name=azone_name)
        print(alarm_zone.polygon)
        return Path(alarm_zone.polygon) #[(0, 0), (0, 1), (1, 1), (1, 0)])

    def _check_point(self, point_x, point_y, azone_name):
        polygon = self._get_polygon(azone_name)
        return polygon.contains_point((point_x, point_y))

