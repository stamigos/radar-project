from functools import wraps
from flask import session, redirect, url_for, request, jsonify


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwds):
        if "u" in session:
            return func(*args, **kwds)
        content_type = request.headers.get('Content-Type')
        if content_type and ('application/json' in content_type):
            return jsonify({'result': 'You are not logged in'})
        return redirect(url_for('login'))
    return wrapper
