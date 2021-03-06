import os
from werkzeug.utils import secure_filename

from peewee import CharField

from base import _Model
from config import MEDIA_ROOT, MEDIA_URL


class Image(_Model):

    class Meta:
        db_table = "images"

    image = CharField(null=True)

    def __unicode__(self):
        return self.image

    def save_image(self, file_obj):
        self.image = secure_filename(file_obj.filename)
        full_path = os.path.join(MEDIA_ROOT, self.image)
        file_obj.save(full_path)
        self.save()

    def url(self):
        return os.path.join(MEDIA_URL, self.image)
