from flask import jsonify
from radar.models.alarm_zone import AlarmZone
from . import BaseController


class UpdateFabricStateController(BaseController):
    def __init__(self, request):
        super(UpdateFabricStateController, self).__init__(request)

    def _call(self):
        fabric_state = self._verify_field("fabric_state")
        alarm_zone_name = self._verify_field("alarm_zone_name")
        alarm_zone = AlarmZone.get(name=alarm_zone_name)
        alarm_zone.fabric_state = fabric_state
        alarm_zone.save()
        return jsonify({"result": "OK"})
