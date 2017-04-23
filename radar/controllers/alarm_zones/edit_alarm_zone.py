from flask import jsonify
from radar.models.alarm_zone import AlarmZone
from radar.controllers import BaseController, ServiceException


class EditAlarmZoneController(BaseController):
    def __init__(self, request):
        super(EditAlarmZoneController, self).__init__(request)

    def _call(self):
        az_name = self._verify_field("az_name")
        az_new_name = self._verify_field("az_new_name")
        color = self._verify_color()
        alarm_zone = AlarmZone.get(name=az_name)
        alarm_zone.color = color
        alarm_zone.name = az_new_name
        alarm_zone.save()
        return jsonify({"result": "OK"})

    def _verify_color(self):
        color = self._verify_field("color")
        if not color.startswith("#") or len(color.split("#")) != 2:
            raise ServiceException("Invalid alarm zone color")
        return color
