from flask import jsonify
from radar.models import AlarmZone
from radar.controllers import BaseController, ServiceException


class DeleteAlarmZoneController(BaseController):
    def __init__(self, request):
        super(DeleteAlarmZoneController, self).__init__(request)

    def _call(self):
        az_name = self._verify_field("az_name")
        alarm_zone = AlarmZone.get(name=az_name)
        alarm_zone.delete_instance()
        return jsonify({"result": "OK"})
