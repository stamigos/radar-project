from flask import jsonify

from radar.models.alarm_zone import AlarmZone
from radar.models.radar_object import AlarmLog
from radar.controllers import BaseController


class DeleteAlarmZoneController(BaseController):
    def __init__(self, request):
        super(DeleteAlarmZoneController, self).__init__(request)

    def _call(self):
        az_name = self._verify_field("az_name")
        alarm_zone = AlarmZone.get(name=az_name)
        self._remove_depended_alarm_logs(alarm_zone)
        if alarm_zone:
            alarm_zone.delete_instance()
        return jsonify({"result": "OK"})

    def _remove_depended_alarm_logs(self, alarm_zone):
        alarm_logs = AlarmLog.select().join(AlarmZone).where(AlarmZone.name == alarm_zone.name)
        return [al.delete_instance() for al in alarm_logs]
