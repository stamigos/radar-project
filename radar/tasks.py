import requests
import json
from datetime import timedelta
from celery import Task

from config import NOTIFIER_HOST, NOTIFIER_PORT
from radar import celery, socketio
from radar.models.radar_object import RadarObject


class NotifierPullObjectsTask(Task):
    """Task that sends notification on completion."""
    abstract = True
    ignore_result = True

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        print("TASK STATUS:", status)
        url = 'http://{}:{}/notify'.format(NOTIFIER_HOST, NOTIFIER_PORT)
        data = {'result': json.dumps(retval)}
        print("TASK STATE:", self.AsyncResult(task_id).state)
        requests.post(url, json=data)


@celery.task(base=NotifierPullObjectsTask)
def pull_objects():
    return RadarObject.redis_populate_and_save()


@celery.task()
def save_objects():
    return RadarObject.populate_and_save()


