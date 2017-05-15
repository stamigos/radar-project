function ChangeAlarmZoneColor() {
    var color=$("#id_Alarm_Zone_Color").val();
    $('#color-picker').css('background', color);

    if(object_status=='modify_enable'){
        Alarm_Zones[Select_Alarm_Zone]['polygon'].set({fill: color,stroke: color});
    } else if (object_status=='object_add') {
        Alarm_Zone_Temp['polygon'].set({fill: color,stroke: color});
    }

    canvas.renderAll();
}
/*########################################################################################################## ALARM ZONES */
$(document).ready(function(){
    document.getElementById("id_Delete_Alarm_Zone").disabled=true;
    document.getElementById("id_Modify_Alarm_Zone").disabled=true;

    // $('#Title_Alarm_Zones_Div').html('Alarm zones(polygons)');
});

/*########################################################################################################## XXXXXXXX */
function AddAlarmZones(rows_data) {
    if(document.getElementById('id_Modify_Alarm_Zone').getAttribute('action') == 'Modify'){
        $("#id_Modify_Alarm_Zone").attr("action", "Save");
        object_status='object_add';

        Alarm_Zone_Temp['name']="Polygon_" + (rows_data+1).toString();
        Alarm_Zone_Temp['color']="#4285f4";
        Alarm_Zone_Temp['type_alarm']=0;
        Alarm_Zone_Temp['url']='';

        var new_alarm_zome = $("<tr>", {html: "<td class='polygon-name'>"+ Alarm_Zone_Temp['name'] +"</td>"});
        new_alarm_zome.find("td").addClass("selected_zone");
        $("#alarm_zones_ul").append(new_alarm_zome);

        DisplayAlarmZones(Select_Alarm_Zone=rows_data+1);
        ShowDropAlarmZones(rows_data);

    } else {}
}

/*########################################################################################################## XXXXXXXX */
function DisplayAlarmZones(ind_alr_zone) {
    var selectTitle = $('#id_Alarm_Zone_Name');
    var selectBox = $('#Box_Alarm_Zones_Div');
    var name,color,i;

    Select_Alarm_Zone=ind_alr_zone;

    $('#alarm_zones_ul').remove();

    var dropDown = $('<tbody>',{className:'dropDown',id:'alarm_zones_ul'});


    // Цикл по оригинальному элементу select
    var tr;
    for(i in Alarm_Zones){
        if (!Alarm_Zones.hasOwnProperty(i)){
            continue;
        }

        name = Alarm_Zones[i]['name'];
        color = Alarm_Zones[i]['color'];

        if (i == ind_alr_zone){
            selectTitle.html(name);
        }

        tr = $("<tr>", {html: "<td class='polygon-name'>"+ name +"</td>"});
        // td = $('td.polygon-name');

        if (i == ind_alr_zone){
            $(tr).addClass("selected_zone");
        }
        tr.click({a:i}, function(eventObject){
            var ind = eventObject.data.a;
            if(fl_alarm_zome!=true) {
                Select_Alarm_Zone=ind;
                dropDown.find('tr').each(function(){
                    $(this).removeClass("selected_zone");
                });
                $(this).addClass("selected_zone");
                $('#id_Alarm_Zone_Name').attr("value", Alarm_Zones[ind]['name']);

                document.getElementById("id_Delete_Alarm_Zone").disabled = false;
                document.getElementById("id_Modify_Alarm_Zone").disabled = false;
            }
            return false;

        });
        dropDown.append(tr);
    }


    if ((ind_alr_zone != null)&&(!(ind_alr_zone in Alarm_Zones))) {
        name = Alarm_Zone_Temp['name'];
        color = Alarm_Zone_Temp['color'];
        selectTitle.html(name);

        tr = $('<tr>', {html: "<td class='polygon-name'>"+ name +"</td>"});
        $(tr).addClass("selected_zone");
        dropDown.append(tr);
    }

    selectBox.append(dropDown.show());

    $('#color-picker').click(function() {
        $('#id_Alarm_Zone_Color').click()
    });

}

/*########################################################################################################## XXXXXXXX */
function ShowDropAlarmZones() {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone = $('#id_Alarm_Zone_Color');
    var type_alarm = $('#id_Alarm_Type_Select');
    var url_zone = $('#id_Alarm_URL');

    name_zone.val(Alarm_Zone_Temp['name']);
    color_zone.val(Alarm_Zone_Temp['color']);
    type_alarm.val(Alarm_Zone_Temp['type_alarm']);
    url_zone.val(Alarm_Zone_Temp['url']);
}

/*########################################################################################################## XXXXXXXX */
function SaveAddAlarmZone(ind_alr_zone) {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone=$('#id_Alarm_Zone_Color');
    var type_alarm=$('#id_Alarm_Type_Select');
    var url_zone=$('#id_Alarm_URL');

    Alarm_Zone_Temp['name'] = name_zone.val();
    Alarm_Zone_Temp['color'] = color_zone.val();
    Alarm_Zone_Temp['type_alarm'] = type_alarm.val();
    Alarm_Zone_Temp['url'] = url_zone.val();

    Alarm_Zones[ind_alr_zone]={};
    Alarm_Zones[ind_alr_zone]['name'] = Alarm_Zone_Temp['name'];
    Alarm_Zones[ind_alr_zone]['color'] = Alarm_Zone_Temp['color'];
    Alarm_Zones[ind_alr_zone]['type_alarm'] = Alarm_Zone_Temp['type_alarm'];
    Alarm_Zones[ind_alr_zone]['url'] = Alarm_Zone_Temp['url'];
    Alarm_Zones[ind_alr_zone]['polygon'] = Alarm_Zone_Temp['polygon'];
    Alarm_Zones[ind_alr_zone]['polygon_down'] = Alarm_Zone_Temp['polygon_down'];


    var fabric_state = {obj: '{"alarm_zone":['+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon"])+','+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon_down"])+']}', name: Alarm_Zones[ind_alr_zone]["name"], color: Alarm_Zones[ind_alr_zone]["color"], alrm_type: Alarm_Zones[ind_alr_zone]["type_alarm"], alrm_url: Alarm_Zones[ind_alr_zone]["url"], radar_height: '0', radar_offset_x: '0', radar_offset_y: '0', radar_azimuth_angle:'0', radar_elevation_angle: '0'};
    // call api
    set_alarm_zone(name_zone.val(), pointArrayApi, color_zone.val(), fabric_state);
    object_db.delete_row(""+ind_alr_zone+"");

    // object_db.add_row(""+ind_alr_zone+"",'{"alarm_zone":['+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon"])+','+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon_down"])+']}',Alarm_Zones[ind_alr_zone]["name"],Alarm_Zones[ind_alr_zone]["color"],Alarm_Zones[ind_alr_zone]["type_alarm"],Alarm_Zones[ind_alr_zone]["url"], '0', '0', '0', '0', '0');

    canvas_down.add(Alarm_Zones[ind_alr_zone]['polygon_down']);
    if (radar_down_obj_save){
        canvas_down.bringToFront(radar_down_obj_save);
    }
    Count_Alarm_Zones++;
    fl_alarm_zome = false;
}

/*########################################################################################################## XXXXXXXX */
function ModifyAlarmZone(ind_alr_zone) {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone = $('#id_Alarm_Zone_Color');
    var type_alarm = $('#id_Alarm_Type_Select');
    var url_zone = $('#id_Alarm_URL');

    Alarm_Zone_Temp['name'] = Alarm_Zones[ind_alr_zone]['name'];
    Alarm_Zone_Temp['color'] = Alarm_Zones[ind_alr_zone]['color'];
    Alarm_Zone_Temp['type_alarm'] = Alarm_Zones[ind_alr_zone]['type_alarm'];
    Alarm_Zone_Temp['url'] = Alarm_Zones[ind_alr_zone]['url'];
    Alarm_Zone_Temp['polygon'] = Alarm_Zones[ind_alr_zone]['polygon'];
    Alarm_Zone_Temp['polygon_down'] = Alarm_Zones[ind_alr_zone]['polygon_down'];

    name_zone.val(Alarm_Zone_Temp['name']);
    color_zone.val(Alarm_Zone_Temp['color']);
    type_alarm.val(Alarm_Zone_Temp['type_alarm']);
    url_zone.val(Alarm_Zone_Temp['url']);
    fl_alarm_zome = true;
}

/*########################################################################################################## XXXXXXXX */
function SaveModifyAlarmZone(ind_alr_zone) {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone = $('#id_Alarm_Zone_Color');
    var type_alarm = $('#id_Alarm_Type_Select');
    var url_zone = $('#id_Alarm_URL');

    Alarm_Zone_Temp['name'] = name_zone.val();
    Alarm_Zone_Temp['color'] = color_zone.val();
    Alarm_Zone_Temp['type_alarm'] = type_alarm.val();
    Alarm_Zone_Temp['url'] = url_zone.val();

    // call api to edit
    edit_alarm_zone(Alarm_Zones[ind_alr_zone]['name'], Alarm_Zone_Temp['name'], Alarm_Zone_Temp['color']);

    Alarm_Zones[ind_alr_zone] = {};
    Alarm_Zones[ind_alr_zone]['name'] = Alarm_Zone_Temp['name'];
    Alarm_Zones[ind_alr_zone]['color'] = Alarm_Zone_Temp['color'];
    Alarm_Zones[ind_alr_zone]['type_alarm'] = Alarm_Zone_Temp['type_alarm'];
    Alarm_Zones[ind_alr_zone]['url'] = Alarm_Zone_Temp['url'];
    Alarm_Zones[ind_alr_zone]['polygon'] = Alarm_Zone_Temp['polygon'];
    Alarm_Zones[ind_alr_zone]['polygon_down'] = Alarm_Zone_Temp['polygon_down'];

    fl_alarm_zome = false;
}
