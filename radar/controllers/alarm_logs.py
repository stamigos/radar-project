from flask import jsonify
from radar.models import AlarmLog
from . import BaseController


class GetAlarmLogsController(BaseController):
    def __init__(self, request):
        super(GetAlarmLogsController, self).__init__(request)

    def _call(self):
        alarm_logs = [alarm_log for alarm_log in AlarmLog.select()]
        return jsonify({'result': alarm_logs})
