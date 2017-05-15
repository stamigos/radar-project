from radar.controllers import BaseController
from radar.models.image import Image


class ImageUploadController(BaseController):
    def __init__(self, request):
        super(ImageUploadController, self).__init__(request)

    def _call(self):
        _file = self.request.files['image']
        image = Image(name=_file.name)
        image.save_image(_file)
        return "Saved"
