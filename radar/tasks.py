import requests
import json
from celery import Task

from config import NOTIFIER_HOST, NOTIFIER_PORT
from radar import celery, socketio
from radar.models.radar_object import RadarObject


class NotifierTask(Task):
    """Task that sends notification on completion."""
    abstract = True

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        url = 'http://{}:{}/notify'.format(NOTIFIER_HOST, NOTIFIER_PORT)
        data = {'result': json.dumps(retval)}
        requests.post(url, json=data)


@celery.task(base=NotifierTask)
def pull_and_save(account):
    return RadarObject.populate_and_save(account['radar_objects_url'])

