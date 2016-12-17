from flask import Flask, render_template, redirect, request, jsonify
from radar import app
from radar.controllers.login import LoginController
from radar.controllers.logout import LogoutController
from radar.controllers.check_object import CheckObjectController
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


@app.route('/check_object/', methods=['POST'])
@login_required
def check_object():
    return CheckObjectController(request)()


@app.route('/alarm_zone/', methods=['POST'])
@login_required
def set_alarm_zone():
    return SetAlarmZoneController(request)()

