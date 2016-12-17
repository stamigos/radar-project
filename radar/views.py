from flask import Flask, render_template, redirect, request, jsonify
from radar import app
from radar.controllers.login import LoginController
from radar.controllers.logout import LogoutController
from radar.controllers.check_object import CheckObjectController
from radar.controllers.set_alarm_zone import SetAlarmZoneController
from radar.controllers.radar_objects import GetRadarObjectsController
from radar.controllers.alarm_logs import GetAlarmLogsController
from radar.decorators import login_required


@app.route('/')
@login_required
def index():
    return render_template("index.html")


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





