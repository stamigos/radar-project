/**
 * Created by 1234 on 28.10.2016.
 */
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
/*########################################################################################################## ALARM ZONES */
/*########################################################################################################## ALARM ZONES */
/*########################################################################################################## ALARM ZONES */
/*########################################################################################################## ALARM ZONES */
$(document).ready(function(){
    document.getElementById("id_Delete_Alarm_Zone").disabled=true;
    document.getElementById("id_Modify_Alarm_Zone").disabled=true;

    $('#Title_Alarm_Zones_Div').html('Alarm zones(polygons)');
});



/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
function AddAlarmZones(rows_data) {
    if(document.getElementById('id_Modify_Alarm_Zone').value == 'Modify'){
        $("#id_Modify_Alarm_Zone").removeClass("fa-pencil").addClass("fa-floppy-o");
        // $("#id_Modify_Alarm_Zone").attr("value","Save");
        object_status='object_add';

        Alarm_Zone_Temp['name']="Polygon_" + (rows_data+1).toString();
        Alarm_Zone_Temp['color']="#000000";
        Alarm_Zone_Temp['type_alarm']=0;
        Alarm_Zone_Temp['url']='';


        DisplayAlarmZones(Select_Alarm_Zone=rows_data+1);
        ShowDropAlarmZones(rows_data);

    } else {}
}

/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
function DisplayAlarmZones(ind_alr_zone) {
    var selectTitle=$('#Title_Alarm_Zones_Div');
    var selectBox=$('#Box_Alarm_Zones_Div');
    var name,color,i;

    Select_Alarm_Zone=ind_alr_zone;

    $('#alarm_zones_ul').remove();

    var dropDown = $('<tbody>',{className:'dropDown',id:'alarm_zones_ul'});


    // Цикл по оригинальному элементу select
    var td;
    for(i in Alarm_Zones){
        if (!Alarm_Zones.hasOwnProperty(i)){continue;}
        name=Alarm_Zones[i]['name'];
        color=Alarm_Zones[i]['color'];
        if(i==ind_alr_zone){selectTitle.html(name);}

        td = $('<tr>', {html: "<td class='polygon-name'><input type='text' class='pol-name' id='id_Alarm_Zone_Name' value='" + name + "' /></td><td><div class='circle' id='color-picker' style='background: #000000;'></div><input type='color' value='" + color + "' id='id_Alarm_Zone_Color' onchange='ChangeAlarmZoneColor()' /></td><td><button type='button' class='btn-wrapper' id='id_Modify_Alarm_Zone'></button><i class='fa fa-pencil' aria-hidden='true'></i></td><td><button type='button' class='btn-wrapper' id='id_Delete_Alarm_Zone'><i class='fa fa-times' id='id_Delete_Alarm_Zone' aria-hidden='true'></i></button></td>"});

        // if(i==(ind_alr_zone)){$(td).addClass("selected_zone");} else {$(td).addClass("unselected_zone");}

        td.click({a:i}, function(eventObject){
            var ind=eventObject.data.a;
            if(fl_alarm_zome!=true) {
                Select_Alarm_Zone=ind;
                // dropDown.find('tr').each(function(){$(this).removeClass("selected_zone").addClass("unselected_zone");});
                // $(this).removeClass("unselected_zone").addClass("selected_zone");
                // $('#Title_Alarm_Zones_Div').html(Alarm_Zones[ind]['name']);

                document.getElementById("id_Delete_Alarm_Zone").disabled = false;
                document.getElementById("id_Modify_Alarm_Zone").disabled = false;
            }
            return false;

        });
        dropDown.append(td);
    }


    if((ind_alr_zone!=null)&&(!(ind_alr_zone in Alarm_Zones))){
        name=Alarm_Zone_Temp['name'];
        color=Alarm_Zone_Temp['color'];
        selectTitle.html(name);

                                    // <td class="polygon-name">Polygon 1</td>
                                    // <td><div class="circle red"></div></td>
                                    // <td><i class="fa fa-pencil" aria-hidden="true"></i></td>
                                    // <td><i class="fa fa-times" aria-hidden="true"></i></td>

        td = $('<tr>', {html: "<td class='polygon-name'><input type='text' class='pol-name' id='id_Alarm_Zone_Name' value='" + name + "' /></td><td><div class='circle' id='color-picker' style='background: #000000;'></div><input type='color' class='circle' value='" + color + "' id='id_Alarm_Zone_Color' onchange='ChangeAlarmZoneColor()' style='opacity: 0;'/></td><td><i class='fa fa-pencil' id='id_Modify_Alarm_Zone' aria-hidden='true'></i></td><td><i class='fa fa-times' id='id_Delete_Alarm_Zone' aria-hidden='true'></i></td>"});
        // $(td).addClass("selected_zone");
        dropDown.append(td);
    }

    selectBox.append(dropDown.show());
    $('#color-picker').click(function() {
        $('#id_Alarm_Zone_Color').click()
    });
}



/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
function ShowDropAlarmZones() {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone=$('#id_Alarm_Zone_Color');
    var type_alarm=$('#id_Alarm_Type_Select');
    var url_zone=$('#id_Alarm_URL');

    name_zone.val(Alarm_Zone_Temp['name']);
    color_zone.val(Alarm_Zone_Temp['color']);
    type_alarm.val(Alarm_Zone_Temp['type_alarm']);
    url_zone.val(Alarm_Zone_Temp['url']);
}


/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
function SaveAddAlarmZone(ind_alr_zone) {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone=$('#id_Alarm_Zone_Color');
    var type_alarm=$('#id_Alarm_Type_Select');
    var url_zone=$('#id_Alarm_URL');

    Alarm_Zone_Temp['name']=name_zone.val();
    Alarm_Zone_Temp['color']=color_zone.val();
    Alarm_Zone_Temp['type_alarm']=type_alarm.val();
    Alarm_Zone_Temp['url']=url_zone.val();

    Alarm_Zones[ind_alr_zone]={};
    Alarm_Zones[ind_alr_zone]['name']=Alarm_Zone_Temp['name'];
    Alarm_Zones[ind_alr_zone]['color']=Alarm_Zone_Temp['color'];
    Alarm_Zones[ind_alr_zone]['type_alarm']=Alarm_Zone_Temp['type_alarm'];
    Alarm_Zones[ind_alr_zone]['url']=Alarm_Zone_Temp['url'];
    Alarm_Zones[ind_alr_zone]['polygon']=Alarm_Zone_Temp['polygon'];
    Alarm_Zones[ind_alr_zone]['polygon_down']=Alarm_Zone_Temp['polygon_down'];


    object_db.delete_row(""+ind_alr_zone+"");
    object_db.add_row(""+ind_alr_zone+"",'{"alarm_zone":['+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon"])+','+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon_down"])+']}',Alarm_Zones[ind_alr_zone]["name"],Alarm_Zones[ind_alr_zone]["color"],Alarm_Zones[ind_alr_zone]["type_alarm"],Alarm_Zones[ind_alr_zone]["url"], '0', '0', '0', '0', '0');

    canvas_down.add(Alarm_Zones[ind_alr_zone]['polygon_down']);
    if(radar_down_obj_save){canvas_down.bringToFront(radar_down_obj_save);}
    Count_Alarm_Zones++;
    fl_alarm_zome=false;
}

/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
function ModifyAlarmZone(ind_alr_zone) {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone=$('#id_Alarm_Zone_Color');
    var type_alarm=$('#id_Alarm_Type_Select');
    var url_zone=$('#id_Alarm_URL');


    Alarm_Zone_Temp['name']=Alarm_Zones[ind_alr_zone]['name'];
    Alarm_Zone_Temp['color']=Alarm_Zones[ind_alr_zone]['color'];
    Alarm_Zone_Temp['type_alarm']=Alarm_Zones[ind_alr_zone]['type_alarm'];
    Alarm_Zone_Temp['url']=Alarm_Zones[ind_alr_zone]['url'];
    Alarm_Zone_Temp['polygon']=Alarm_Zones[ind_alr_zone]['polygon'];
    Alarm_Zone_Temp['polygon_down']=Alarm_Zones[ind_alr_zone]['polygon_down'];

    name_zone.val(Alarm_Zone_Temp['name']);
    color_zone.val(Alarm_Zone_Temp['color']);
    type_alarm.val(Alarm_Zone_Temp['type_alarm']);
    url_zone.val(Alarm_Zone_Temp['url']);
    fl_alarm_zome=true;
}

/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
/*########################################################################################################## XXXXXXXX */
function SaveModifyAlarmZone(ind_alr_zone) {
    var name_zone = $('#id_Alarm_Zone_Name');
    var color_zone=$('#id_Alarm_Zone_Color');
    var type_alarm=$('#id_Alarm_Type_Select');
    var url_zone=$('#id_Alarm_URL');

    Alarm_Zone_Temp['name']=name_zone.val();
    Alarm_Zone_Temp['color']=color_zone.val();
    Alarm_Zone_Temp['type_alarm']=type_alarm.val();
    Alarm_Zone_Temp['url']=url_zone.val();

    Alarm_Zones[ind_alr_zone]={};
    Alarm_Zones[ind_alr_zone]['name']=Alarm_Zone_Temp['name'];
    Alarm_Zones[ind_alr_zone]['color']=Alarm_Zone_Temp['color'];
    Alarm_Zones[ind_alr_zone]['type_alarm']=Alarm_Zone_Temp['type_alarm'];
    Alarm_Zones[ind_alr_zone]['url']=Alarm_Zone_Temp['url'];
    Alarm_Zones[ind_alr_zone]['polygon']=Alarm_Zone_Temp['polygon'];
    Alarm_Zones[ind_alr_zone]['polygon_down']=Alarm_Zone_Temp['polygon_down'];



    object_db.delete_row(""+ind_alr_zone+"");
    object_db.add_row(""+ind_alr_zone+"",'{"alarm_zone":['+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon"])+','+JSON.stringify(Alarm_Zones[ind_alr_zone]["polygon_down"])+']}',Alarm_Zones[ind_alr_zone]["name"],Alarm_Zones[ind_alr_zone]["color"],Alarm_Zones[ind_alr_zone]["type_alarm"],Alarm_Zones[ind_alr_zone]["url"], '0', '0', '0', '0', '0');
    fl_alarm_zome=false;
}



/*########################################################################################################## ValidateUrl */
/*########################################################################################################## ValidateUrl */
/*########################################################################################################## ValidateUrl */
/*########################################################################################################## ValidateUrl */
/*########################################################################################################## ValidateUrl */
/**
 * @return {boolean}
 */
function ValidateUrl(){
    var url_zone=$('#id_Alarm_URL');
    if(flag_url=='ok') return false;
    var y=url_zone.val();


    if (y.length==0){
        flag_url = 'ok';
        return false;
    }


    var regexp = 	/^(((f|ht)tp(s)?):\/\/)?(www\.)?([a-zA-Z0-9\-]{1,}\.){1,}?([a-zA-Z0-9\-]{2,}\.[a-zA-Z0-9\-]{2,4}(\.[a-zA-Z0-9\-]{2,4})?)(\/|\?)?$/;

    //проверяем пункт 2
    if (!regexp.test(y)){
        alert('NOT PROPERLY URL!');
        flag_url = 'err';
        return false;
    }
//проверяем пункт 3

    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open('GET', y, true);
    xmlhttp.onreadystatechange = update;
    xmlhttp.send(null);
    document.getElementById('id_Wait_URL_Wind').style.visibility='visible';
    setTimeout(DelayValidateUrl, 2000);

    function update()
    {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if(flag_url=='wait'){flag_url = 'ok';}
            //для проверки
            //document.forms['form'].submit()
        }
        if (xmlhttp.readyState === 4 && xmlhttp.status === 404)
        {alert('URL NOT FOUND');
            flag_url = 'err';
            document.getElementById('id_Wait_URL_Wind').style.visibility='hidden';
        }

    }
    return false;
}

/*########################################################################################################## DelayValidateUrl */
/*########################################################################################################## DelayValidateUrl */
/*########################################################################################################## DelayValidateUrl */
/*########################################################################################################## DelayValidateUrl */
/*########################################################################################################## DelayValidateUrl */
/**
 * @return {boolean}
 */
function DelayValidateUrl(){

    if((flag_url=='wait')&&(count_check_url>0)){ count_check_url--; setTimeout(DelayValidateUrl, 2000); return false;}

    if(count_check_url==0)
    {
        document.getElementById('id_Wait_URL_Wind').style.visibility='hidden';
        alert('problem connect'); flag_url = 'err';
        Modify_Alarm_Zone();
    }

    if(flag_url=='ok') {
        document.getElementById('id_Wait_URL_Wind').style.visibility='hidden';
        Modify_Alarm_Zone();
    }

}


/*########################################################################################################## ValidateName */
/*########################################################################################################## ValidateName */
/*########################################################################################################## ValidateName */
/*########################################################################################################## ValidateName */
/*########################################################################################################## ValidateName */
/**
 * @return {boolean}
 */
function ValidateName(){
var name=document.getElementById('id_Alarm_Zone_Name').value;
for (var i in Alarm_Zones){
    if (!Alarm_Zones.hasOwnProperty(i)){continue;}
    if((Alarm_Zones[i]['name']==name)&&(i!=Select_Alarm_Zone)){
    alert('The "Name" exists!'); return false;
}}
    return true;
}