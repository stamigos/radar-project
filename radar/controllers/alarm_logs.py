from radar.models.radar_object import AlarmLog
from radar.controllers import BaseController
from utils import get_dictionary_from_model


class GetAlarmLogsController(BaseController):
    def __init__(self, request):
        super(GetAlarmLogsController, self).__init__(request)

    def _call(self):
        # alarm_logs = [get_dictionary_from_model(alarm_log) for alarm_log in AlarmLog.select()]
        return AlarmLog.redis_list_all_json()


class DeleteAlarmLogsController(BaseController):
    def __init__(self, request):
        super(DeleteAlarmLogsController, self).__init__(request)

    def _call(self):
        AlarmLog.redis_clear_logs()
        AlarmLog.delete().execute()
        return "OK"

