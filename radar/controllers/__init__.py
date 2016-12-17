
class ServiceException(Exception):
    pass


class BaseController(object):

    def __init__(self, request):
        self.request = request

    def __call__(self, *args, **kwargs):
        try:
            result = self._call(*args, **kwargs)
            return result
        except ServiceException, e:
            raise ServiceException(e.message)

    def _call(self, *args, **kwargs):
        raise NotImplementedError()

    def _verify_field(self, field):
        try:
            return self.request.form[field]
        except KeyError:
            raise ServiceException("{field} required".format(field=field))

