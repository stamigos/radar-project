import os
import json
from datetime import datetime, timedelta
from urlparse import urlparse
from flask import render_template, request, send_file, url_for, session

from config import MEDIA_ROOT, PULLING_INTERVAL, NOTIFIER_PORT, RADAR_OBJECTS_URL
from radar import app, socketio, rdb
from radar.controllers._radar import RadarController
from radar.controllers.alarm_logs import GetAlarmLogsController
from radar.controllers.alarm_logs import DeleteAlarmLogsController
from radar.controllers.alarm_zones.alarm_zones import GetAlarmZonesController
from radar.controllers.alarm_zones.delete_alarm_zone import DeleteAlarmZoneController
from radar.controllers.alarm_zones.edit_alarm_zone import EditAlarmZoneController
from radar.controllers.alarm_zones.set_alarm_zone import SetAlarmZoneController
from radar.controllers.login import LoginController
from radar.controllers.logout import LogoutController
from radar.controllers.radar_objects import GetRadarObjectsController
from radar.controllers.update_fabric_state import UpdateFabricStateController
from radar.controllers.image_upload import ImageUploadController
from radar.decorators import login_required, jsonify_result
from radar.models.account import Account
from radar.tasks import pull_objects, save_objects
from utils import get_dictionary_from_model


def background_thread():
    account = Account.get(Account.id == 1)
    tasks_count = 0
    while True:
        pull_objects.apply_async()
        tasks_count += 1
        if tasks_count > 20:
            for key in rdb.keys("celery-task-meta-*"):
                r = rdb.get(key)
                task = json.loads(r)
                if task['status'] == 'SUCCESS':
                    rdb.delete(key)
            tasks_count = 0
        socketio.sleep(float(account.pulling_interval))


def save_objects_background_thread():
    save_objects.delay()

thread = socketio.start_background_task(target=background_thread)
# thread1 = socketio.start_background_task(target=save_objects_background_thread)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


@app.route("/runtask", methods=['POST'])
@login_required
def runtask():
    account = Account.get(Account.id == session["u"])
    pull_objects.delay(get_dictionary_from_model(account))
    return 'running task...', 202


@app.route('/')
@login_required
def index():
    hostname = urlparse(request.url).hostname
    notifier_url = 'http://{}:{}'.format(hostname, NOTIFIER_PORT)
    radar_objects = GetRadarObjectsController(request)()
    alarm_logs = GetAlarmLogsController(request)()
    alarm_zones = GetAlarmZonesController(request)()
    return render_template("index.html",
                           radar_objects=radar_objects,
                           alarm_logs=alarm_logs,
                           alarm_zones=alarm_zones,
                           async_mode=socketio.async_mode,
                           notifier_url=notifier_url)


@app.route('/settings/', methods=['GET', 'POST'])
@login_required
def settings():
    account = Account.get(Account.id == session["u"])
    if request.method == 'POST':
        account.radar_objects_url = request.form.get('radar_objects_url') or RADAR_OBJECTS_URL
        account.pulling_interval = request.form.get('pulling_interval') or PULLING_INTERVAL
        account.save()
    radar_objects_url = account.radar_objects_url
    pulling_interval = account.pulling_interval
    return render_template("settings.html",
                           radar_objects_url=radar_objects_url,
                           pulling_interval=pulling_interval)


@app.route('/radar/<int:pk>/', methods=['GET', 'POST'])
@login_required
def radar(pk):
    return RadarController(request)(pk)


@app.route('/login/', methods=['GET', 'POST'])
def login():
    return LoginController(request)()


@app.route('/logout/', methods=['GET'])
@login_required
def logout():
    return LogoutController(request)()


@app.route('/update-fabric-state/', methods=['POST'])
@login_required
def update_fabric_state():
    return UpdateFabricStateController(request)()


@app.route('/alarm-zone/', methods=['POST'])
@login_required
def set_alarm_zone():
    return SetAlarmZoneController(request)()


@app.route('/alarm-zone/edit/', methods=['POST'])
@login_required
def edit_alarm_zone():
    return EditAlarmZoneController(request)()


@app.route('/alarm-zone/delete/', methods=['POST'])
@login_required
def delete_alarm_zone():
    return DeleteAlarmZoneController(request)()


@app.route('/alarm-log/', methods=['GET'])
@login_required
@jsonify_result
def get_alarm_logs():
    return GetAlarmLogsController(request)()


@app.route('/alarm-log/delete-all/', methods=['POST'])
@login_required
@jsonify_result
def delete_alarm_logs():
    return DeleteAlarmLogsController(request)()


@app.route("/image/", methods=['POST'])
@login_required
@jsonify_result
def file_upload():
    return ImageUploadController(request)()
    # url = .upload_photo()
    # return jsonify(dict(result=True, data={"url": url}, error=None))


@app.route('/media/<name>', methods=['GET'])
def img(name):
    return send_file(MEDIA_ROOT + '/' + name, mimetype="image/jpg")






