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
from radar.controllers.check_object import CheckObjectController
from radar.controllers.login import LoginController
from radar.controllers.logout import LogoutController
from radar.controllers.radar_objects import GetRadarObjectsController
from radar.controllers._radar import RadarController
from radar.controllers.radar_object import RadarObjectController
from radar.controllers.update_fabric_state import UpdateFabricStateController
from radar.decorators import login_required
from utils import pull_radar_objects


def background_thread():
    """Send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(5)
        result_json = pull_radar_objects()
        for _object in result_json['objects']:
            print(CheckObjectController()(_object))
        # RadarObjectController()(result_json['objects'])
        count += 1
        socketio.emit('my_response',
                      {'data': result_json, 'count': count},
                      namespace='/test')

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


# @app.route('/radar-object/', methods=['POST'])
# @login_required
# def radar_object():
#     return RadarObjectController(request)()


# @app.route('/i/')
# @login_required
# def index_old():
#     return render_template("index_old.html")


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

# @app.route('/radar-objects/', methods=['GET'])
# @login_required
# def radar_objects():
#     return GetRadarObjectsController(request)()


# @app.route('/alarm-logs/', methods=['GET'])
# @login_required
# def alarm_logs():
#     return GetAlarmLogsController(request)()


# @app.route('/check-object/', methods=['POST'])
# @login_required
# def check_object():
#     return CheckObjectController(request)()


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


@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    if thread is None:
        thread = socketio.start_background_task(target=background_thread)

    emit('my_response', {'data': 'Connected', 'count': 0}, broadcast=True)


@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')





