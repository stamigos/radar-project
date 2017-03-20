from flask import jsonify
from radar.models import AlarmLog, RadarObject
from radar.controllers import BaseController


class GetAlarmLogsController(BaseController):
    def __init__(self, request):
        super(GetAlarmLogsController, self).__init__(request)

    def _call(self):
        alarm_logs = [alarm_log for alarm_log in AlarmLog.select()]
        return alarm_logs#jsonify({'result': alarm_logs})
