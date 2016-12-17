from flask import session, redirect

from radar.controllers import BaseController


class LogoutController(BaseController):
    def _call(self):
        session.clear()
        return redirect('/')
