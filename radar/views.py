import os
from flask import render_template, request, send_file, url_for
from flask_socketio import emit

from config import MEDIA_ROOT
from radar import app, socketio, thread
from radar.controllers.alarm_logs import GetAlarmLogsController
from radar.controllers.alarm_zones.alarm_zones import GetAlarmZonesController
from radar.controllers.alarm_zones.delete_alarm_zone import DeleteAlarmZoneController
from radar.controllers.alarm_zones.edit_alarm_zone import EditAlarmZoneController
from radar.controllers.alarm_zones.set_alarm_zone import SetAlarmZoneController
from radar.controllers.login import LoginController
from radar.controllers.logout import LogoutController
from radar.controllers.radar_objects import GetRadarObjectsController
from radar.controllers._radar import RadarController
from radar.controllers.update_fabric_state import UpdateFabricStateController
from radar.decorators import login_required
from radar.models.radar_object import RadarObject
from utils import get_dictionary_from_model


def background_thread():
    """Send server generated events to clients."""
    count = 0
    while True:
        radar_objects = RadarObject.pull_objects_and_save()  # pulling and saving radar objects into database
        socketio.sleep(1)
        alarm_logs, contains = RadarObject.contains_in_alarm_zones(radar_objects)  # check if contains in alarm zones
        count += 1
        socketio.emit('my_response',
                      {
                          'objects': [r.json() for r in radar_objects],
                          'alarm_logs': {
                              'list': alarm_logs,
                              'updated': contains
                          },
                          'count': count
                      },
                      namespace='/radar')

# thread = socketio.start_background_task(target=background_thread)


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


@app.route('/')
@login_required
def index():
    radar_objects = GetRadarObjectsController(request)()
    alarm_logs = GetAlarmLogsController(request)()
    alarm_zones = GetAlarmZonesController(request)()
    return render_template("index.html",
                           radar_objects=radar_objects,
                           alarm_logs=alarm_logs,
                           alarm_zones=alarm_zones,
                           async_mode=socketio.async_mode)


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


@app.route("/image/", methods=['POST'])
@login_required
def file_upload():
    pass
    # url = .upload_photo()
    # return jsonify(dict(result=True, data={"url": url}, error=None))


@app.route('/media/<name>', methods=['GET'])
def img(name):
    return send_file(MEDIA_ROOT + '/' + name, mimetype="image/jpg")


@socketio.on('connect', namespace='/radar')
def test_connect():
    global thread
    if thread is None:
        thread = socketio.start_background_task(target=background_thread)

    emit('my_response', {'data': 'Connected', 'count': 0}, broadcast=True)


@socketio.on('disconnect', namespace='/radar')
def test_disconnect():
    print('Client disconnected')





