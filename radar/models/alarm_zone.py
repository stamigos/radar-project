from peewee import CharField, TextField, SmallIntegerField

from base import BaseModel


class AlarmZone(BaseModel):

    class Meta:
        db_table = "alarm_zones"

    enable_urls = TextField(null=True)
    disable_urls = TextField(null=True)
    timeout = SmallIntegerField(null=True)
    delay = SmallIntegerField(null=True)
    polygon = TextField(null=True)  # Example: [(0, 0), (0, 1), (1, 1), (1, 0)]
    color = TextField(null=True)
    name = CharField(null=True, unique=True)
    fabric_state = TextField(null=True)

    @staticmethod
    def list_all():
        return [az for az in AlarmZone.select()]

    @staticmethod
    def redis_list_all():
        return
