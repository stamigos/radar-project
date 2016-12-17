from functools import wraps
from flask import session, redirect, url_for


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwds):
        if "u" in session:
            return func(*args, **kwds)
        return redirect(url_for('login'))
    return wrapper
