from radar.models.radar_object import AlarmLog
from radar.controllers import BaseController
from utils import get_dictionary_from_model


class GetAlarmLogsController(BaseController):
    def __init__(self, request):
        super(GetAlarmLogsController, self).__init__(request)

    def _call(self):
        alarm_logs = [get_dictionary_from_model(alarm_log) for alarm_log in AlarmLog.select()]
        return alarm_logs


class DeleteAlarmLogsController(BaseController):
    def __init__(self, request):
        super(DeleteAlarmLogsController, self).__init__(request)

    def _call(self):
        print("AlarmLog.select() before:", [get_dictionary_from_model(al) for al in AlarmLog.select()])
        AlarmLog.delete().execute()
        print("AlarmLog.select():", [get_dictionary_from_model(al) for al in AlarmLog.select()])
        return "OK"

