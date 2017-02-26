import json

from flask import jsonify

from radar.models import AlarmZone
from radar.controllers import BaseController, ServiceException


class SetAlarmZoneController(BaseController):
    def __init__(self, request):
        super(SetAlarmZoneController, self).__init__(request)

    def _call(self):
        name = self._verify_field("name")
        fabric_state = self._verify_field("fabric_state")
        points = self._verify_points()
        color = self._verify_color()
        alarm_zone = AlarmZone(name=name,
                               fabric_state=fabric_state,
                               polygon=points,
                               color=color)
        alarm_zone.save()
        return jsonify({"result": "OK"})

    def _verify_points(self):
        points = self._verify_field("points")  # Example: [(0, 0), (0, 1), (1, 1), (1, 0)]
        if not json.loads(points):
            ServiceException("Invalid alarm zone points")
        return json.loads(points)

    def _verify_color(self):
        color = self._verify_field("color")
        if not color.startswith("#") or len(color.split("#")) != 2:
            raise ServiceException("Invalid alarm zone color")
        return color
