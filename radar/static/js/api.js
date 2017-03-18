var url = 'http://0.0.0.0:8008/';

function set_alarm_zone(name, points, color, fabric_state) {
    $.post(url+'alarm-zone/',
        {
            name: name,
            points: JSON.stringify(points),
            color: color,
            fabric_state: JSON.stringify(fabric_state)
        },
        function (r) {
            console.log("response:", r)
        }
    )
}

function edit_alarm_zone(name, new_name, color) {
    $.post(url+'alarm-zone/edit/',
        {
            az_name: name,
            az_new_name: new_name,
            color: color
        },
        function (r) {
            console.log("response:", r)
        }
    )
}

function delete_alarm_zone(name) {
    $.post(url+'alarm-zone/delete/',
        {
            az_name: name
        },
        function (r) {
            console.log("response:", r)
        }
    )
}
function get_radar(id, cb, fl_radar) {
    $.get(url+'radar/'+id+'/',
        function (r) {
            console.log("response:", r);
            var radar = r.result.radar;
            cb(radar.height, radar.off_x_distance, radar.off_y_distance, radar.az_angle, radar.el_angle, fl_radar)
        }
    )
}
function update_radar(id, height, off_x_distance, off_y_distance, az_angle, el_angle) {
    $.post(url+'radar/'+id+'/',
        {
            height: height,
            off_x_distance: off_x_distance,
            off_y_distance: off_y_distance,
            az_angle: az_angle,
            el_angle: el_angle
        },
        function (r) {
            console.log("response:", r);
        }
    )
}
// function create_radar_object(received_obj) {
//     for (var obj in received_obj.objects) {
//          $.post(url+'radar-object/',
//             {
//                 object_id: received_obj.objects[obj].object_id,
//                 // timestamp_upper: timestamp_upper,
//                 // timestamp_lower: timestamp_lower,
//                 quality: received_obj.objects[obj].quality,
//                 c_distance_x: received_obj.objects[obj].distance_x,
//                 c_distance_y: received_obj.objects[obj].distance_y,
//                 c_velocity_x: received_obj.objects[obj].velocity_x,
//                 c_velocity_y: received_obj.objects[obj].velocity_y,
//                 p_distance: received_obj.objects[obj].distance_polar,
//                 p_velocity: received_obj.objects[obj].speed_polar,
//                 p_angle: received_obj.objects[obj].angle
//             },
//         function (r) {
//             console.log("create_radar_object:", r)
//         })
//     }
// }