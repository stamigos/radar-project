


function PageState(state){
    switch (state) {
        case "modify_alarm_zone":
            document.getElementById("id_Creat_Alarm_Zone").disabled = true;
            $("#id_Modify_Alarm_Zone").attr("action", "Save");
            $("#id_Modify_Alarm_Zone i").removeClass("fa-pencil").addClass("fa-floppy-o");
            document.getElementById("id_Alarm_Zone_Color").disabled = false;
            document.getElementById("id_Alarm_Zone_Name").disabled = false;
            // document.getElementById('id_Alarm_Zone_Setting_Wind').style.visibility='visible';
            break;

        case "save_alarm_zone":
            unhighlightPlotState();
            $("#id_Modify_Alarm_Zone").attr("action","Modify");
            $("#id_Modify_Alarm_Zone i").removeClass("fa-floppy-o").addClass("fa-pencil");
            document.getElementById("id_Alarm_Zone_Color").disabled = true;
            document.getElementById("id_Alarm_Zone_Name").disabled = true;
            document.getElementById("id_Creat_Alarm_Zone").disabled = false;
            document.getElementById("id_Delete_Alarm_Zone").disabled = true;
            document.getElementById("id_Modify_Alarm_Zone").disabled = true;
            document.getElementById("id_Upload_Image").disabled = false;
            document.getElementById("file_upp").disabled = false;
            // document.getElementById('id_Alarm_Zone_Setting_Wind').style.visibility='hidden';
            break;

        case "delete_alarm_zone":
            $("#id_Modify_Alarm_Zone").attr("action","Modify");
            $("#id_Modify_Alarm_Zone i").removeClass("fa-floppy-o").addClass("fa-pencil");
            document.getElementById("id_Creat_Alarm_Zone").disabled=false;
            document.getElementById("id_Delete_Alarm_Zone").disabled=true;
            document.getElementById("id_Modify_Alarm_Zone").disabled=true;
            document.getElementById("id_Upload_Image").disabled=false;
            document.getElementById("file_upp").disabled=false;
            // document.getElementById('id_Alarm_Zone_Setting_Wind').style.visibility='hidden';
            break;


        case "draw_alarm_zone_end":
            document.getElementById("id_Alarm_Zone_Color").disabled = false;
            document.getElementById("id_Alarm_Zone_Name").disabled = false;
            document.getElementById("id_Creat_Alarm_Zone").disabled=true;
            document.getElementById("id_Modify_Alarm_Zone").disabled=false;
            document.getElementById("id_Delete_Alarm_Zone").disabled=false;
            // document.getElementById('id_Alarm_Zone_Setting_Wind').style.visibility='visible';
            $("#id_Modify_Alarm_Zone i").removeClass("fa-pencil").addClass("fa-floppy-o");
            break;


        case "load_image":
            document.getElementById("id_Save_Image").disabled=true;
            document.getElementById("id_Scale_Image").disabled=true;
            document.getElementById('id_Drop_Scale').style.visibility='hidden';
            document.getElementById("id_Creat_Alarm_Zone").disabled=true;
            document.getElementById("id_Delete_Alarm_Zone").disabled=true;
            document.getElementById("id_Modify_Alarm_Zone").disabled=true;
            break;


        case "creat_alarm_zone":
            highlightPlotState();
            document.getElementById("id_Upload_Image").disabled=true;
            document.getElementById("file_upp").disabled=true;
            document.getElementById("id_Modify_Alarm_Zone").disabled=true;
            document.getElementById("id_Creat_Alarm_Zone").disabled=true;
            break;


        case "creat_alarm_zone_max":
            document.getElementById("id_Upload_Image").disabled=true;
            document.getElementById("file_upp").disabled=true;
            document.getElementById("id_Modify_Alarm_Zone").disabled=true;
            document.getElementById("id_Delete_Alarm_Zone").disabled=true;
            document.getElementById("id_Creat_Alarm_Zone").disabled=false;
            break;

        case "save_image":
            document.getElementById("id_Save_Image").disabled=true;
            document.getElementById("id_Creat_Alarm_Zone").disabled=false;
            document.getElementById("id_Delete_Alarm_Zone").disabled=true;
            document.getElementById("id_Modify_Alarm_Zone").disabled=true;
            document.getElementById("id_Scale_Image").disabled=true;
            document.getElementById('id_Drop_Scale').style.visibility='hidden';
            break;


        case "scale_image":
            document.getElementById("id_Scale_Distance_Inpt").disabled=true;
            document.getElementById("id_Scale_Distance").disabled=true;
            document.getElementById('id_Drop_Scale').style.visibility='visible';
            break;


        case "scale_line":
            document.getElementById("id_Scale_Image").disabled=true;
            break;


        case "scale_distance":
            document.getElementById("id_Scale_Distance_Inpt").disabled=true;
            document.getElementById("id_Scale_Distance").disabled=true;
            break;


        default: break;

    }
}

function highlightPlotState() {
    var grid = document.getElementById('grid-block');
        grid.style.zIndex = 1000;

    var overlay = document.getElementById('overlay');
        overlay.style.visibility = 'visible';
        overlay.style.opacity = 1;
        document.getElementById('tools-panel').style.zIndex = 1000;
}
function unhighlightPlotState() {
    var overlay = document.getElementById('overlay');
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = 0;
}


















