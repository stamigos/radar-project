from matplotlib.path import Path

from flask import jsonify

from . import BaseController


class CheckObjectController(BaseController):
    def __init__(self, request):
        super(CheckObjectController, self).__init__(request)

    def _call(self):
        point_x = self._verify_field("point_x")
        point_y = self._verify_field("point_y")
        return jsonify({"result": self._check_point(point_x, point_y)})

    def _get_polygon(self):
        return Path([(0, 0), (0, 1), (1, 1), (1, 0)])

    def _check_point(self, point_x, point_y):
        polygon = self._get_polygon()
        return polygon.contains_point((point_x, point_y))

