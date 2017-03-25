/**
 * Created by 1234 on 06.11.2016.
 */
$(window).on('load', function() {
    alarm_history_db.init();
});


var alarm_history_db = new function () {
    var Alarm_History_Database;
    this.init = function () {
        if (typeof(openDatabase) !== 'undefined') {
            // alarm_history_db.open();
            // alarm_history_db.create_table();
            // alarm_history_db.get_data();
            alarm_history_db.get_data_arr();


        }
        else {
            alert(' Ваш браузер не поддерживает технологию Web SQL ');
        }

        $('#id_Clear_Alarm_History').click(function () {
            alarm_history_db.delete_table();
            // alarm_history_db.create_table();
            alarm_history_db.get_data_arr();
        });
    };

    // Для удобства помещаем функцию в глобальную переменную
    // this.open = function () {
        // Alarm_History_Database = openDatabase("AlarmList", "1.0", "Alarm List History", 1024 * 1024 * 5);
        // if(!Alarm_History_Database) {
        //     alert("Failed to connect to database.");
        // }
        // название БД, версия, описание, размер
    // };

    // Создаем таблицу
    // this.create_table = function () {
    //     Alarm_History_Database.transaction(function (tx) {
    //         tx.executeSql("CREATE TABLE IF NOT EXISTS todo (ID INTEGER PRIMARY KEY ASC,alarm_zone TEXT,time_alarm VARCHAR,object_type TEXT,object_id TEXT,distance_x TEXT,distance_y TEXT)", []);
    //     });
    // };

    // Создаем таблицу
    this.delete_table = function () {
        var tbl = document.getElementById("id_Alarm_List_Tbody");
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("DROP TABLE IF EXISTS todo", []);
        });
        while (tbl.firstChild) {
            tbl.removeChild(tbl.firstChild);
        }
    };


    // функция добавления записи
    this.add_row = function (Id, AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY) {
        // Alarm_History_Database.transaction(function (tx) {
        //     tx.executeSql("INSERT INTO todo (ID,alarm_zone,time_alarm,object_type,object_id,distance_x,distance_y) VALUES (?,?,?,?,?,?,?)", [Id, AlarmZone, TimeAlarm, ObjectType, ObjectId, DistanceX, DistanceY]);
        // });
    };


    // получение данных из БД
    this.get_data_arr = function () {
        // Alarm_History_Database.transaction(function (tx) {
            // tx.executeSql("SELECT * FROM todo ORDER BY time_alarm ASC", [], function (tx, result) {
                var txt = "", Tbl = {};
                for (var i = 0; (i < alarm_logs.length)&&(i < 20); i++) {
                    Tbl[i]={};
                    Tbl[i]["alarm_zone"] = alarm_logs[i].alarm_zone.name;
                    Tbl[i]["time_alarm"] = alarm_logs[i].timestamp;
                    Tbl[i]["object_type"] = 7; // TODO: alarm_logs[i] ??????;
                    Tbl[i]["object_id"] = alarm_logs[i].radar_object.object_id;
                    Tbl[i]["distance_x"] = alarm_logs[i].radar_object.c_distance_x;
                    Tbl[i]["distance_y"] = alarm_logs[i].radar_object.c_distance_y;
                    Tbl[i]["id_row_db"] = alarm_logs[i].id;
                }

                alarm_history_tbl.change_sort(1,"desc");
                alarm_history_tbl.add_row_arr(false,Tbl);
                Count_Alarm_History_Row_DB = alarm_logs.length;
                if (Count_Alarm_History_Row_DB) {
                    txt="Alarm History ("+Count_Alarm_History_Row_DB+")";
                } else {
                    txt="Alarm History";
                }
                document.getElementById('id_Full_Alarm_History').value=txt;
            // });
        // });
    };

    // получение строки по номеру и сортировке из БД
    this.change_data_arr = function (coll,orientation_sort) {
        Alarm_History_Database.transaction(function (tx) {
            var Coll_Name;
            //var Num_Row=20;

            switch (parseInt(coll)) {
                case 0: Coll_Name="alarm_zone"; break;
                case 1: Coll_Name="time_alarm"; break;
                case 2: Coll_Name="object_type";break;
                case 3: Coll_Name="object_id";  break;
                case 4: Coll_Name="distance_x"; break;
                case 5: Coll_Name="distance_y"; break;
                case null: break;
                default: return;
            }
            console.info(coll,orientation_sort);
            var txt,Tbl={};

            if(coll!=null){txt="SELECT * FROM todo ORDER BY "+Coll_Name+" "+orientation_sort+"";}
            else{return;}

            tx.executeSql(txt, [], function (tx, result) {
                if(!result.rows.length){return;}
                for (var i = 0; (i<result.rows.length)&&(i<20); i++) {
                    Tbl[i]={};
                    Tbl[i]["alarm_zone"] = result.rows.item(i).alarm_zone;
                    Tbl[i]["time_alarm"] = result.rows.item(i).time_alarm;
                    Tbl[i]["object_type"] = result.rows.item(i).object_type;
                    Tbl[i]["object_id"] = result.rows.item(i).object_id;
                    Tbl[i]["distance_x"] = result.rows.item(i).distance_x;
                    Tbl[i]["distance_y"] = result.rows.item(i).distance_y;
                    Tbl[i]["id_row_db"] = result.rows.item(i).ID;
                }

                alarm_history_tbl.change_row_arr(false,Tbl);
                Count_Alarm_History_Row_DB=result.rows.length;
                if (Count_Alarm_History_Row_DB){txt="Alarm History ("+Count_Alarm_History_Row_DB+")";}else{txt="Alarm History";}
                document.getElementById('id_Full_Alarm_History').value=txt;
            });
        });
    };

    // удаление записей из таблицы
    this.delete_row = function (id,coll,orientation_sort) {
        Alarm_History_Database.transaction(function (tx) {
            tx.executeSql("DELETE FROM todo WHERE ID=?", [id], function () {
                alarm_history_db.change_data_arr(coll,orientation_sort);
            });
        });
    };


};



