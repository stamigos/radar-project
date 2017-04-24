import os
from flask import request
from peewee import ForeignKeyField, FloatField

from config import MEDIA_URL
from .image import Image
from base import BaseModel


class RadarView(BaseModel):

    class Meta:
        db_table = "radar_views"

    bg_image = ForeignKeyField(Image, null=True)
    image_scaling = FloatField(null=True)
    view_scaling = FloatField(null=True)

    def upload_photo(self):
        if 'image' in request.files:
            _file = request.files['image']
            image = Image.create(image=_file.filename)
            image.save_image(_file)
            self.bg_image = image
            self.save()
            return os.path.join(MEDIA_URL, image.image)
        return None
