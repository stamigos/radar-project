from flask import jsonify

from radar.models._radar import Radar

from . import BaseController, ServiceException
from utils import get_dictionary_from_model


class RadarController(BaseController):
    def __init__(self, request):
        super(RadarController, self).__init__(request)

    def _call(self, pk):
        if self.request.method == 'GET':
            return jsonify({"result": {"radar": get_dictionary_from_model(self.get_radar(pk))}})

        radar = self.get_radar(pk)
        radar.off_x_distance = self._verify_field("off_x_distance")
        radar.off_y_distance = self._verify_field("off_y_distance")
        radar.az_angle = self._verify_field("az_angle")
        radar.el_angle = self._verify_field("el_angle")
        radar.height = self._verify_field("height")
        radar.save()
        return jsonify({"result": "OK"})

    def get_radar(self, pk):
        try:
            return Radar.get(id=pk)
        except Radar.DoesNotExist:
            ServiceException("Radar (id=%s) does not exist" % pk)
