from flask import jsonify
from radar.models import AlarmZone
from utils import get_dictionary_from_model
from radar.controllers import BaseController


class GetAlarmZonesController(BaseController):
    def __init__(self, request):
        super(GetAlarmZonesController, self).__init__(request)

    def _call(self):
        alarm_zones = [get_dictionary_from_model(alarm_zone) for alarm_zone in AlarmZone.select()]
        return alarm_zones  # jsonify({'result': alarm_logs})
