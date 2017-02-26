from flask import jsonify
from radar.models import RadarObject
from . import BaseController


class GetRadarObjectsController(BaseController):
    def __init__(self, request):
        super(GetRadarObjectsController, self).__init__(request)

    def _call(self):
        radar_objects = [r_object for r_object in RadarObject.select()]
        return radar_objects #jsonify({'result': radar_objects})
