from radar import app, socketio

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8008, debug=True)
    # app.run(host='0.0.0.0', debug=True, port=8008, threaded=True)
