import peewee
from flask import jsonify
from radar.models import RadarObject, db
from utils import get_dictionary_from_model
from . import BaseController, ServiceException


class RadarObjectController(BaseController):
    def __init__(self, request):
        super(RadarObjectController, self).__init__(request)

    def _call(self):
        radar_object = self.create_radar_object()
        return jsonify({
            "result": {
                "radar_object": get_dictionary_from_model(radar_object)
            }}
        )

    def create_radar_object(self):
        try:
            with db.atomic():
                return RadarObject.create(object_id=self._verify_field("object_id"),
                                          # timestamp_upper=self._verify_field("timestamp_upper"),
                                          # timestamp_lower=self._verify_field("timestamp_lower"),
                                          quality=self._verify_field("quality"),
                                          c_distance_x=self._verify_field("c_distance_x"),
                                          c_distance_y=self._verify_field("c_distance_y"),
                                          c_velocity_x=self._verify_field("c_velocity_x"),
                                          c_velocity_y=self._verify_field("c_velocity_y"),
                                          p_distance=self._verify_field("p_distance"),
                                          p_velocity=self._verify_field("p_velocity"),
                                          p_angle=self._verify_field("p_angle")
                                          )
        except peewee.IntegrityError:
            raise ServiceException("Radar object (id=%s) already exists" %
                                   RadarObject.get(object_id=self._verify_field("object_id")))

