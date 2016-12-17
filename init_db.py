import random
from hashlib import sha1

from radar.models import *


def fill_test_data():
    for i in range(1, 3):
        account = Account(email="radar@example.com%s" % (i if i != 1 else ""),
                          password=sha1("123").hexdigest())
        account.save()

    for i in range(1, 5):
        radar = Radar(index=i,
                      enabled=random.choice([True, False]),
                      description="Radar %s" % i,
                      visible=random.choice([True, False]),
                      location="gps coordinates for radar %s" % i,
                      type=random.choice([1, 2, 3]),
                      ip_address="93.56.100.14",
                      off_x_distance="10",
                      off_y_distance="50",
                      angle="0.5",
                      level="3")
        radar.save()

    for i in range(1, 5):
        radar_view = RadarView(index=i,
                               enabled=random.choice([True, False]),
                               description="RadarView %s" % i,
                               visible=random.choice([True, False]),
                               location="gps coordinates for radar view %s" % i,
                               type=random.choice([1, 2, 3]),
                               view_scaling=1.5)
        radar_view.save()

    for i in range(1, 8):
        radar_object = RadarObject(object_id=str(1+i),
                                   timestamp_upper=str(3+i),
                                   timestamp_lower=str(2+i),
                                   quality="quality",
                                   c_distance_x=str(random.choice([10, 20, 60])+i),
                                   c_distance_y=str(random.choice([20, 36, 19])+i),
                                   c_velocity_x=str(random.choice([4, 6, 9])+i),
                                   c_velocity_y=str(random.choice([5, 6, 7])+i),
                                   p_distance=str(random.choice([10, 5])+i),
                                   p_velocity=str(random.choice([12, 7])+i),
                                   p_angle=str(random.choice([0.25, 0.3, 0.1]))
                                    )
        radar_object.save()

    for i in range(1, 3):
        alarm_zone = AlarmZone(index=i,
                               enabled=random.choice([True, False]),
                               description="Alarm Zone %s" % i,
                               visible=random.choice([True, False]),
                               location="gps coordinates for Alarm Zone %s" % i,
                               type=random.choice([1, 2, 3]),
                               enable_urls="['https://google.com', 'https://yahoo.com']",
                               disable_urls="['https://yandex.ru/']",
                               timeout=1,
                               polygon="polygon",
                               color="color")
        alarm_zone.save()

    for i in range(1, 3):
        alarm_zone = AlarmZone.get(id=i)
        radar_object = RadarObject.get(id=random.choice([1, 2, 3, 4, 5, 6, 7]))
        alarm_log = AlarmLog(alarm_zone=alarm_zone,
                             radar_object=radar_object)
        alarm_log.save()


def init_db():
    try:
        db.connect()
        map(lambda l: db.drop_table(l, True), [AlarmLog, AlarmZone, RadarObject, RadarView, Radar, Account])
        print "tables dropped"
        [m.create_table() for m in [Account, Radar, RadarView, RadarObject, AlarmZone, AlarmLog]]
        fill_test_data()
        print "tables created"
    except:
        db.rollback()
        raise

if __name__ == '__main__':
    init_db()

