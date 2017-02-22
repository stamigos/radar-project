import os
from flask import render_template, request, jsonify, send_file, url_for
from radar import app
from radar.controllers.login import LoginController
from radar.controllers.logout import LogoutController
from radar.controllers.check_object import CheckObjectController
from radar.controllers.set_alarm_zone import SetAlarmZoneController
from radar.controllers.radar_objects import GetRadarObjectsController
from radar.controllers.alarm_logs import GetAlarmLogsController
from radar.decorators import login_required
from config import MEDIA_ROOT


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route('/')
@login_required
def index():
    return render_template("index.html")


@app.route('/i/')
@login_required
def index_old():
    return render_template("index_old.html")


@app.route('/login/', methods=['GET', 'POST'])
def login():
    return LoginController(request)()


@app.route('/logout/', methods=['GET'])
@login_required
def logout():
    return LogoutController(request)()


@app.route('/radar-objects/', methods=['GET'])
@login_required
def radar_objects():
    return GetRadarObjectsController(request)()


@app.route('/alarm-logs/', methods=['GET'])
@login_required
def alarm_logs():
    return GetAlarmLogsController(request)()


@app.route('/check-object/', methods=['POST'])
@login_required
def check_object():
    return CheckObjectController(request)()


@app.route('/alarm-zone/', methods=['POST'])
@login_required
def set_alarm_zone():
    return SetAlarmZoneController(request)()


@app.route("/image/", methods=['POST'])
@login_required
def file_upload():
    pass
    # url = .upload_photo()
    # return jsonify(dict(result=True, data={"url": url}, error=None))


@app.route('/media/<name>', methods=['GET'])
def img(name):
    return send_file(MEDIA_ROOT + '/' + name, mimetype="image/jpg")





