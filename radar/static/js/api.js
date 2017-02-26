var url = 'http://127.0.0.1:8888/';

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
// function update_fabric_state(fabric_state, name) {
//     $.post(url+'update-fabric-state/',
//         {
//             alarm_zone_name: name,
//             fabric_state: JSON.stringify(fabric_state)
//         },
//         function (r) {
//             console.log("response:", r)
//         }
//     )
// }

//
// function get_alarm_zones() {
//     $.post
// }