import peewee
from flask import jsonify
from radar.models.radar_object import RadarObject
from radar.models import db
from utils import get_dictionary_from_model
from . import BaseController, ServiceException


class RadarObjectController(object):
    def __call__(self, objects):
        for _object in objects:
            self.create_radar_object(_object)

    def create_radar_object(self, _object):
        try:
            with db.atomic():
                radar_object = RadarObject.create(object_id=_object['object_id'],
                                                  # timestamp_upper=self._verify_field("timestamp_upper"),
                                                  # timestamp_lower=self._verify_field("timestamp_lower"),
                                                  quality=_object['quality'],
                                                  c_distance_x=_object['distance_x'],
                                                  c_distance_y=_object['distance_y'],
                                                  c_velocity_x=_object['velocity_x'],
                                                  c_velocity_y=_object['velocity_y'],
                                                  p_distance=_object['distance_polar'],
                                                  p_velocity=_object['speed_polar'],
                                                  p_angle=_object['angle']
                                                  )
                return get_dictionary_from_model(radar_object)
        except peewee.IntegrityError:
            raise ServiceException("Radar object (id=%s) already exists" %
                                   RadarObject.get(object_id=_object.id))

