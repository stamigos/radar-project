from flask import render_template, redirect, url_for, session

from . import BaseController, ServiceException
from radar.models import Account
from utils import hash_pwd


class LoginController(BaseController):
    def __init__(self, request):
        super(LoginController, self).__init__(request)

    def _call(self):
        if self.request.method == 'GET':
            return render_template("login.html")

        account = self._check_username()
        self._check_password(account)
        session.clear()
        session['u'] = account.id
        return redirect(url_for('index'))

    def _check_username(self):
        email = self._verify_field("email")
        try:
            account = Account.get(Account.email == email)
            return account
        except Account.DoesNotExist:
            raise ServiceException("Account {email} does not exist"
                                   .format(email=email))

    def _check_password(self, account):
        password = self._verify_field("password")
        if account.password != hash_pwd(password):
            raise ServiceException("Password is incorrect")


