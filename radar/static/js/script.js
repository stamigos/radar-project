var min = 99;
var max = 999999;
var polygonMode = false;

//********************************************************************
var canvas_grid_bottom_width = 700; //ширина нижней линейки
var canvas_grid_bottom_height = 30; //высота нижней линейки
var canvas_grid_left_width = 35;    //ширина левой линейки
var canvas_grid_left_height = 525;  //высота левой линейки
var canvas_width = 700;             //ширина окна canvas
var canvas_height = 525;            //высота окна canvas
//********************************************************************

//********************************************************************
var ctx_canvas_down;
var pointArray = [];    // в этот массив записываются точки при рисовании полигона
var pointArrayApi = []; // polygon array points in api format
var lineArray = [];     //в этот массив записываются линии при рисовании полигона
var activeLine;         //текущая линия при рисовании полигона

var canvas;                  //объект для работы с canvas
var canvas_down;             //объект для работы с canvas
var canvas_grid_bottom;      //объект для работы с canvas нижней линейки
var canvas_grid_left;        //объект для работы с canvas левой линейки

var Alarm_Zones = {};               //тут хранятся тут хранится информация и сами объекты
var Alarm_Zone_Temp = {};           //тут хранятся полигон который нарисовали но еще не сохранили
var Select_Alarm_Zone=null;         //тут хранятся имя полигона который пользователь выбрал в окне "Alarm Zone" на странице
var radar_obj_save = false;         //тут храним объект радар(используется когда добавляются элементы или картинка, чтоб его положение было выше картинки и ниже полигонов)
var radar_down_obj_save = false;    //тут храним объект радар для canvas_down
var image_save = false;
var Obj_Old={};
var Obj_New={};
var Alarm_Obj_Old = {};
var cont_disp=2;
var Count_Alarm_Zones=0;
var Count_Alarm_History_Row_DB=0;
//*****************************************************************
var flag_url = false;
var count_check_url = 5;
var deltaY = 0; // for scale
var alarm_logs = [];


var object_status = 'modify_enable';
var fl_alarm_zome = false;


var color_resive_obj= ['Green','Orange','Yellow','Pink','Indigo','Purple','Maroon','Fuchsia','Olive','Aqua','Grey','Gold','Pink','Teal','DarkRed'];
var text_json_Test= '{"objects":[{"object_id":"1", "quality":"5", "distance_x":"25.1", "distance_y":"115.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}, {"object_id":"2", "quality":"2", "distance_x":"35.1", "distance_y":"215.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}, {"object_id":"3", "quality":"1", "distance_x":"45.1", "distance_y":"315.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}, {"object_id":"4", "quality":"3", "distance_x":"55.1", "distance_y":"415.1", "velocity_x":"5.555", "velocity_y":"6.666", "object_type":"7", "distance_polar":"8.888", "speed_polar":"9.999", "angle":"10.001"}]}';

$(window).on('load', function() {
    document.getElementById("id_Save_Image").disabled=true;
    document.getElementById("id_Scale_Image").disabled=true;
    prototypefabric.initCanvas();
    Resize_Canvas();
});

var prototypefabric = new function () {
    this.initCanvas = function () {
        var canv_wind = $('#c'); // ещё пригодится для обработки событий
        canvas = new fabric.Canvas('c',{renderOnAddRemove: false});
        canvas.scale = 1;//обязательно для массштабирования
        canvas_grid_bottom = new fabric.Canvas('id_Canv_Grid_Bottom_Canv',{renderOnAddRemove: false});
        canvas_grid_bottom.scale = 1;//обязательно для массштабирования
        canvas_grid_left = new fabric.Canvas('id_Canv_Grid_Left_Canv',{renderOnAddRemove: false});
        canvas_grid_left.scale = 1;//обязательно для массштабирования

        canvas_down = new fabric.Canvas('c2',{renderOnAddRemove: false}); canvas_down.scale = 1;
        var container = $(canvas.wrapperEl);
        pointArray[0] = [];
        ctx_canvas_down = canvas_down.getContext('2d');

     /*########################################################################################################## MOUSE:DOWN */
        canvas.on('mouse:down', function (options) {

            var ctx = canvas_down.getContext('2d');
            var imgData1 = ctx.getImageData(options.e.layerX, options.e.layerY, 1, 1).data;


            canvas.sendBackwards(radar_obj_save);
            if(image_save){canvas.sendBackwards(image_save);}

            if (options.target && options.target.id == pointArray[0].id) {
                prototypefabric.polygon.generatePolygon(pointArray);
            }
            if (polygonMode) {
                prototypefabric.polygon.addPoint(options);
            }

            if((fl_draw_scale_line=='start_draw_line')||(fl_draw_scale_line=='draw_line')) {
                scaling.line.addPoint(options);
            }
            if ((fl_draw_scale_line=='modify_line')&&(options.target && options.target.id == arr_pointLine[0].id)) {
                scaling.line.addPoint(options);
            }
            if ((fl_draw_scale_line=='modify_line')&&(options.target && options.target.id == arr_pointLine[1].id)) {
                scaling.line.addPoint(options);
            }
            if(fl_draw_scale_line=='modify_point_0') {
                scaling.line.addPoint(options);
            }
            if(fl_draw_scale_line=='modify_point_1') {
                scaling.line.addPoint(options);
            }
        });

        /*########################################################################################################## MOUSEWHEEL */
        // Scaling
        $('#id_Scale_In').click(function(event) {
            // console.log("deltaY:", deltaY)
            // deltaY += 1;
            if(fl_alarm_zome==false){

                var offset = canv_wind.offset(), // положение холста на странице
                    centerX = event.pageX - offset.left, // координата x центра масштабирования
                    centerY = event.pageY - offset.top, // координата y центра масштабирования
                    zoomStep = Math.pow(1.1, 1); // шаг масштабирования, удобный для пользователя.


                anchor_x = centerX; anchor_y = centerY; scale_to_set = scale_sc * zoomStep;
                scale_wind.setScale(scale_sc * zoomStep, centerX, centerY);
                canvas.renderAll();
            // Отключим скролл страницы
            event.preventDefault();}
            return false;

        });
        $('#id_Scale_Out').click(function(event) {
            // deltaY -= 1;
            if(fl_alarm_zome==false){

                var offset = canv_wind.offset(), // положение холста на странице
                    centerX = event.pageX - offset.left, // координата x центра масштабирования
                    centerY = event.pageY - offset.top, // координата y центра масштабирования
                    zoomStep = Math.pow(1.1, -1); // шаг масштабирования, удобный для пользователя.


                anchor_x = centerX; anchor_y = centerY; scale_to_set = scale_sc * zoomStep;
                scale_wind.setScale(scale_sc * zoomStep, centerX, centerY);
                canvas.renderAll();
            // Отключим скролл страницы
            event.preventDefault();}
            return false;

        });
        container.mousewheel(function(event, delta, deltaX, deltaY) {
            console.log(delta, deltaX, deltaY)
            if(fl_alarm_zome==false){

                var offset = canv_wind.offset(), // положение холста на странице
                    centerX = event.pageX - offset.left, // координата x центра масштабирования
                    centerY = event.pageY - offset.top, // координата y центра масштабирования
                    zoomStep = Math.pow(1.1, deltaY); // шаг масштабирования, удобный для пользователя.


                anchor_x = centerX; anchor_y = centerY; scale_to_set = scale_sc * zoomStep;
                scale_wind.setScale(scale_sc * zoomStep, centerX, centerY);
                canvas.renderAll();
            // Отключим скролл страницы
            event.preventDefault();}
            return false;
        });
        /*########################################################################################################## MOUSE:UP */

        canvas.on('mouse:up', function (options) {

        });
        /*########################################################################################################## MOUSE:MOVE */
        canvas.on('mouse:move', function (options) {
            var pointer;

            if(activeLine && activeLine.class == "line"){
                pointer = canvas.getPointer(options.e);
                activeLine.set({ x2: pointer.x, y2: pointer.y });

                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x:pointer.x,
                    y:pointer.y
                };

                activeShape.set({
                    points: points
                });
                canvas.renderAll();
            }

            if (fl_draw_scale_line == 'draw_line'){
                pointer = canvas.getPointer(options.e);
                active_scale_line.set({ x2: pointer.x, y2: pointer.y });
                canvas.renderAll();
            }
            if (fl_draw_scale_line == 'modify_point_0'){
                pointer = canvas.getPointer(options.e);
                active_scale_line.set({ x1: pointer.x, y1: pointer.y });
                arr_pointLine[0].set({ left: pointer.x, top: pointer.y });
                canvas.renderAll();
            }
            if (fl_draw_scale_line == 'modify_point_1'){
                pointer = canvas.getPointer(options.e);
                active_scale_line.set({ x2: pointer.x, y2: pointer.y });
                arr_pointLine[1].set({ left: pointer.x, top: pointer.y });
                canvas.renderAll();
            }


        });

        /*########################################################################################################## OBJECT:SELECTED*/
        canvas.on('object:selected', function(options) {
            if (options.target == image_save){
                canvas.sendToBack(options.target);
                if (Count_Alarm_Zones) {
                    canvas.setActiveObject(Alarm_Zones[Count_Alarm_Zones-1]['polygon']);
                }
                else {
                    canvas.setActiveObject(radar_obj_save);
                }

                if(active_scale_line) {
                    Left_Img = image_save.get('left');
                    Top_Img = image_save.get('top');
                }
            }
        });
        /*########################################################################################################## OBJECT:MOVING*/
        canvas.on('object:moving', function(options) {
            options.target.setCoords();

            if(options.target == image_save) {
                canvas.sendToBack(options.target);
                if(Count_Alarm_Zones){canvas.setActiveObject(Alarm_Zones[Count_Alarm_Zones-1]['polygon']);}
                else{canvas.setActiveObject(radar_obj_save);}

            if (active_scale_line){
                //active_scale_line.set({left: active_scale_line.get('left')+image_save.get('left')-Left_Img, top: active_scale_line.get('top')+image_save.get('top')-Top_Img});
                //arr_pointLine[0].set({left: arr_pointLine[0].get('left')+image_save.get('left')-Left_Img, top: });
                //arr_pointLine[1].set({left: arr_pointLine[1].get('left')+image_save.get('left')-Left_Img, top: arr_pointLine[1].get('top')+image_save.get('top')-Top_Img});

                var left = [],
                    top = [];

                left[0] = arr_pointLine[0].get('left');
                left[1] = arr_pointLine[1].get('left');
                top[0] = arr_pointLine[0].get('top');
                top[1] = arr_pointLine[1].get('top');
                canvas.remove(arr_pointLine[0], arr_pointLine[1]);
                arr_pointLine[0].left = left[0] + image_save.get('left') - Left_Img;
                arr_pointLine[1].left = left[1] + image_save.get('left') - Left_Img;
                arr_pointLine[0].top = top[0] + image_save.get('top') - Top_Img;
                arr_pointLine[1].top = top[1] + image_save.get('top') - Top_Img;
                canvas.add(arr_pointLine[0], arr_pointLine[1]);
                active_scale_line.set({
                    x1: arr_pointLine[0].get('left'),
                    y1: arr_pointLine[0].get('top'),
                    x2: arr_pointLine[1].get('left'),
                    y2: arr_pointLine[1].get('top')
                });

                Left_Img = image_save.get('left');
                Top_Img = image_save.get('top');
            }
            }



        });

        /*########################################################################################################## BUTTON:CLEAR*/
        fabric.util.addListener(window, 'keyup', function (e) {
            if ((e.keyCode === 27) && (pointArray.length > 1)) {
                prototypefabric.polygon.generatePolygon(pointArray);
            }
        });

    };
};

    /*########################################################################################################## Create_Radar Z*/
    function Create_Radar() {
        var
            rdr_height = document.getElementById('Radar_Height').value,
            rdr_offset_x = document.getElementById('Radar_Offset_X').value,
            rdr_offset_y = document.getElementById('Radar_Offset_Y').value,
            rdr_azimuth_angle = document.getElementById('Radar_Azimuth_Angle').value,
            rdr_elevation_angle = document.getElementById('Radar_Elevation_Angle').value,

            radar_height = Math.floor((parseInt(rdr_height, 10)/350) * canvas.height),
            radar_width = (radar_height * Math.tan(parseInt(rdr_azimuth_angle, 10) * Math.PI/360)) * 2,
            radar_left = Math.floor((parseInt(rdr_offset_x, 10)/300) * canvas.width - radar_width/2),
            radar_top = Math.floor((parseInt(rdr_offset_y, 10)/350) * canvas.height),
            radar_angle = Math.floor(parseInt(rdr_elevation_angle, 10)),
            radar_fill = '#d6e6ff';

        scale_wind.setScale(0.9, 100, 100);
        canvas.renderAll();

        radar_left += parseInt(canvas.width, 10)/2;
        radar_top += canvas.height;
        radar_angle += 180;


        function createTriangle(x, y, angle)
        {
            var pos = fabric.util.rotatePoint(
                new fabric.Point(x, y),
                new fabric.Point(x + radar_width/2, y),
                fabric.util.degreesToRadians(angle)
            );
            return new fabric.Triangle(
                {
                    width: radar_width,
                    height: radar_height,
                    selectable: false,//запрещаем выделение
                    fill: radar_fill,
                    opacity: 0.5,
                    left: pos.x,
                    top: pos.y,
                    evented: false, //курсор
                    hasControls: false,
                    hasBorders: false,
                    angle: angle,
                    id: 'radar'
                });
        }

        if (radar_obj_save){
            canvas.remove(radar_obj_save);
            canvas_down.remove(radar_down_obj_save);
        }
        var triangle = createTriangle(radar_left, radar_top, radar_angle);
            canvas.add(triangle);
        var triangle_down = createTriangle(radar_left, radar_top, radar_angle);
            triangle_down.set({
                opacity: 10/255
            });
            canvas_down.add(triangle_down);
            radar_obj_save = triangle;
            radar_down_obj_save = triangle_down;

        Render_All_Canvas();
        update_radar(1, rdr_height, rdr_offset_x, rdr_offset_y, rdr_azimuth_angle, rdr_elevation_angle);

    }
    /*########################################################################################################## Paint_Resive_Obj Z*/
    function Paint_Resive_Obj() {
        var display_alr_page = document.getElementById('id_Alarm_Text');
        var contact = text_json_Test;

        // create_radar_object(contact);

        var num_obj = contact.objects.length;
        var alarm_str = "ALARM:<br>";
        var i, int, fl_new_alarm = false;
        var Alarm_Obj_New = {};
        var circle_obj_resive;

        if (scale_to_set != 1) {
            scale_wind.setScale(0.9, anchor_x, anchor_y);
        }
        var color = {};
        for (i in Obj_Old) {
            color[Obj_Old[i]['color']] = Obj_Old[i]['color'];
        }
        Obj_New = {}
        for (i = 0; i < num_obj; i++) {
            var id = contact.objects[i].object_id;
                Obj_New[id] = {};
                Obj_New[id]['id'] = contact.objects[i].object_id;
                Obj_New[id]['type'] = 7; // contact.objects[i].object_type;
                Obj_New[id]['x'] = Math.floor((contact.objects[i].distance_x*canvas.width)/300) + canvas.width/2;
                Obj_New[id]['y'] = canvas.height - Math.floor((contact.objects[i].distance_y*canvas.height)/350);

            if (id in Obj_Old) {
                Obj_New[id]['color'] = Obj_Old[id]['color'];
            }
            else {
                for (var ii in color_resive_obj){
                    if (!color_resive_obj.hasOwnProperty(ii)){
                        continue;
                    }
                    if(!(color_resive_obj[ii] in color)) {
                        Obj_New[id]['color'] = color[color_resive_obj[ii]] = color_resive_obj[ii];
                        break;
                    }
                }
            }
        }
        for(i in Obj_Old) {
            canvas.remove(Obj_Old[i]['object']);
        }
        Obj_Old={};

        console.log("Obj_New:", Obj_New)
        for(i in Obj_New) {

            circle_obj_resive = new fabric.Circle({
                strokeWidth: 0,
                radius: 10, fill: Obj_New[i]['color'],
                originX: 'center',
                originY: 'center',
                left: Obj_New[i]['x'],
                top: Obj_New[i]['y'],
                hasBorders: false,
                perPixelTargetFind: true,
                hasControls: false,
                id: Obj_New[i]['id']
            });


            var x = Obj_New[i]['x'];
            var x1 = x - 10;
            var x2 = x + 10;
            var y = Obj_New[i]['y'];
            var y1 = y - 10;
            var y2 = y + 10;

            Obj_Old[i] = {};
            Obj_Old[i]['object'] = circle_obj_resive;
            Obj_Old[i]['x'] = Obj_New[i]['x'];
            Obj_Old[i]['y'] = Obj_New[i]['y'];
            Obj_Old[i]['color'] = Obj_New[i]['color'];
            Obj_Old[i]['id'] = Obj_New[i]['id'];
        }
      //****************************** HISTORY****************************************************
        var temp_arr = [];
        for (i in Alarm_Obj_Old) {
            temp_arr.push(Alarm_Obj_Old[i]['alarm_zone']);
        }
        var Alarm_Obj_New_Temp = {};
        for (i in Alarm_Obj_New){
            if(temp_arr.indexOf(Alarm_Obj_New[i]['alarm_zone']) == -1) {
                fl_new_alarm = true;
                Alarm_Obj_New_Temp[i] = {};
                Alarm_Obj_New_Temp[i] = Alarm_Obj_New[i];
            }
        }

        if (fl_new_alarm) {
            Count_Alarm_History_Row_DB += Object.keys(Alarm_Obj_New_Temp).length;
            alarm_history_tbl.add_row_arr(true, Alarm_Obj_New_Temp);
        }

        //****************************** PAGE TEXT ALARM ****************************************************
        for (i in Alarm_Obj_Old) {
            if (!(i in Alarm_Obj_New)) {
                alarm_str += Check_Alarm_Zones_Outside(i);
                delete Alarm_Obj_Old[i];
            }
        }


        for (i in Alarm_Obj_New) {
            if (!(i in Alarm_Obj_Old)) {
                Alarm_Obj_Old[i] = {};
            }
            Alarm_Obj_Old[i]['alarm_zone'] = Alarm_Obj_New[i]['alarm_zone'];
            Alarm_Obj_Old[i]['object_type'] = Alarm_Obj_New[i]['object_type'];
            Alarm_Obj_Old[i]['object_id'] = Alarm_Obj_New[i]['object_id'];
            Alarm_Obj_Old[i]['distance_x'] = Alarm_Obj_New[i]['c_distance_x'];
            Alarm_Obj_Old[i]['distance_y'] = Alarm_Obj_New[i]['c_distance_y'];
        }

        if (alarm_str != "ALARM!!!!!<br>") {
            display_alr_page.innerHTML = alarm_str;
            cont_disp = 2;
        }
        else {
            cont_disp--;
            if (cont_disp == 0) {
                display_alr_page.innerHTML='';
            }
        }


        for (i in Obj_Old){
            canvas.add(Obj_Old[i]['object']);
        }
        if (scale_to_set != 1) {
            scale_wind.setScale(scale_to_set, anchor_x, anchor_y);
        }
        canvas.renderAll();
        object_list_tbl.change_row(contact);
        alarm_history_db.get_data_arr();
    }

/*########################################################################################################## Paint_Resive_Obj */
    function Render_All_Canvas() {
        if(radar_obj_save){
            canvas.sendToBack(radar_obj_save);
            if(image_save){canvas.sendToBack(image_save);}
            canvas_down.bringToFront(radar_down_obj_save);
        } else{
            canvas.renderAll();
            canvas_down.renderAll();
        }
    }
/*########################################################################################################## Check_Alarm_Zones */
    // /**
    //  * @return {string}
    //  */
    // function Check_Alarm_Zones(alarm_zones, obj_id) {
    //     var i, ii, obj_inside = [], obj_in = [], obj_out = [], name_zone_old, txt_alarm = "";
    //     if (obj_id in Alarm_Obj_Old) {
    //         //alert("obj_id существует.");
    //         for (i in Alarm_Zones){
    //             ii = jQuery.inArray(Alarm_Zones[i]['name'], alarm_zones);
    //             if ((ii != -1) && (Alarm_Zones[i]['name'] == alarm_zones[ii]) && (Alarm_Zones[i]["type_alarm"] == 0)) {
    //                 obj_inside.push(alarm_zones[ii]);
    //                 //if(Alarm_Zones[ii]["url"]!=''){SendAlrm(obj_id+": INSIDE "+alarm_zones[ii]);}
    //             }
    //         }
    //         for (i in Alarm_Obj_Old[obj_id]['zones']) {
    //             if (!Alarm_Obj_Old[obj_id]['zones'].hasOwnProperty(i)){
    //                 continue;
    //             }
    //             name_zone_old = Alarm_Obj_Old[obj_id]['zones'][i];
    //             for(ii in Alarm_Zones){
    //                 if ((Alarm_Zones[ii]['name'] == name_zone_old) && (Alarm_Zones[ii]["type_alarm"] == 1) && (alarm_zones.indexOf(name_zone_old)==-1)) {
    //                     obj_out.push(name_zone_old);
    //                     if(Alarm_Zones[ii]["url"]!=''){
    //                         SendAlrm(Alarm_Zones[ii]["url"]+"?"+obj_id+":_OUT_"+name_zone_old);
    //                     }
    //                 }
    //             }
    //         }
    //     } else {
    //         for(i in Alarm_Zones){
    //             ii = jQuery.inArray(Alarm_Zones[i]['name'], alarm_zones);
    //             if ((ii != -1) && (Alarm_Zones[i]['name'] == alarm_zones[ii]) && (Alarm_Zones[i]["type_alarm"] == 2)) {
    //                 obj_in.push(alarm_zones[ii]);
    //                 if (Alarm_Zones[ii]["url"] != '') {
    //                     SendAlrm(Alarm_Zones[ii]["url"]+"?"+obj_id+":_IN_"+alarm_zones[ii]);
    //                 }
    //             }
    //             if ((ii != -1) && (Alarm_Zones[i]['name'] == alarm_zones[ii]) && (Alarm_Zones[i]["type_alarm"] == 0)) {
    //                 obj_inside.push(alarm_zones[ii]);
    //                 if(Alarm_Zones[ii]["url"] != '') {
    //                     SendAlrm(Alarm_Zones[ii]["url"]+"?"+obj_id+":_INSIDE_"+alarm_zones[ii]);
    //                 }
    //             }
    //         }
    //     }
    //
    //     //delete Alarm_Obj_Old[obj_id];
    //     if (!(obj_id in Alarm_Obj_Old)){
    //         Alarm_Obj_Old[obj_id] = {};
    //     }
    //     Alarm_Obj_Old[obj_id]['zones']={};
    //
    //     for(i in alarm_zones) {
    //         if (!alarm_zones.hasOwnProperty(i)) {
    //             continue;
    //         }
    //         Alarm_Obj_Old[obj_id]['zones'][i] = alarm_zones[i];
    //     }
    //
    //  if ((obj_inside.length) || (obj_in.length)) {
    //     txt_alarm = "ID:" + obj_id;
    //
    //      if(obj_in.length){
    //          txt_alarm += "  IN:";
    //          for(i in obj_in){
    //              txt_alarm += obj_in[i] + ", ";
    //          }
    //          txt_alarm = txt_alarm.slice(0,-2);
    //      }
    //      if (obj_inside.length){
    //          txt_alarm += "  INSIDE:";
    //          for(i in obj_inside){
    //              txt_alarm += obj_inside[i]+", ";
    //          }
    //          txt_alarm = txt_alarm.slice(0,-2);
    //      }
    //      if (obj_out.length){
    //          txt_alarm += "  OUT:";
    //          for(i in obj_out){
    //              txt_alarm += obj_out[i]+", ";
    //          }
    //          txt_alarm = txt_alarm.slice(0,-2);
    //      }
    //  }
    //
    //  if (txt_alarm) {
    //      return txt_alarm + "<br>";
    //  } else {
    //      return txt_alarm;
    //  }
    //
    // }
    /*########################################################################################################## Check_Alarm_Zones_Outside */
    /**
     * @return {string}
     */
    function Check_Alarm_Zones_Outside(obj_id) {
        var i,ii,obj_out=[],name_zone_old,txt_alarm="";

            //alert("obj_id существует.");
            for(i in Alarm_Obj_Old[obj_id]['zones']){
                if (!Alarm_Obj_Old[obj_id]['zones'].hasOwnProperty(i)){
                    continue;
                }
                name_zone_old = Alarm_Obj_Old[obj_id]['zones'][i];

                for (ii in Alarm_Zones) {
                 if ((Alarm_Zones[ii]['name'] == name_zone_old) && (Alarm_Zones[ii]['type_alarm'] == 1)) {
                     obj_out.push(name_zone_old);
                     if (Alarm_Zones[ii]['url'] != '') {
                         SendAlrm(Alarm_Zones[ii]['url']+"?"+obj_id+":_OUT_" + name_zone_old);
                     }
                    }
                 }
            }

            if (obj_out.length){
                txt_alarm = "ID:" +obj_id;
                txt_alarm += "  OUT:";
                for (i in obj_out){
                    txt_alarm += obj_out[i] + ", ";
                }
                txt_alarm = txt_alarm.slice(0, -2);
            }

        if (txt_alarm){
            return  txt_alarm + "<br>";
        } else {
            return txt_alarm;
        }

    }

    /*########################################################################################################## SendAlrm_HandleServerResponse */
    function SendAlrm_HandleServerResponse(){}
    /*########################################################################################################## SendAlrm */
    function SendAlrm(alrm){
        var st = alrm;
        var req_alrm = new XMLHttpRequest();
        req_alrm.open('GET', st, true);
        req_alrm.onreadystatechange = SendAlrm_HandleServerResponse; // Подключаем функцию для обработки данных
        req_alrm.send();
    }

    /*########################################################################################################## Modify_Alarm_Zone */
    /**
     * @return {boolean}
     */
    function Modify_Alarm_Zone() {
        if (document.getElementById('id_Modify_Alarm_Zone').getAttribute("action") == 'Modify') {
            ModifyAlarmZone(Select_Alarm_Zone);
            PageState('modify_alarm_zone');
            object_status = 'modify_enable';
            count_check_url=5;
        } else {
            if (ValidateName()==false){return false;}

            document.getElementById("id_Modify_Alarm_Zone").disabled = true;
            if (flag_url == false) {
                count_check_url = 5;
                flag_url = 'wait';
                ValidateUrl();
            }
            if (flag_url != 'wait') {
                document.getElementById("id_Modify_Alarm_Zone").disabled = false;
            }
            if (flag_url == 'err') {
                flag_url = false;
                return false;
            }
            if (flag_url != 'ok') {
                return false;
            }


            flag_url = false;
            if (object_status == 'object_add') {
                SaveAddAlarmZone(Count_Alarm_Zones);
            }
            else if (object_status == 'modify_enable') {
                SaveModifyAlarmZone(Select_Alarm_Zone);
            }

            object_status = 'modify_enable';
            Select_Alarm_Zone=null;
            DisplayAlarmZones(Select_Alarm_Zone);
            PageState('save_alarm_zone');
        }

        return false;
    }


    /*########################################################################################################## window.onresize */
    window.onresize = function(){
        Resize_Canvas();
    };
    /*########################################################################################################## Resize_Canvas */
    function Resize_Canvas() {
        var canv_temp,context,tempContext;
        var tempCanvas = document.createElement('canvas');


        canv_temp = document.getElementById('id_Canv_Grid_Bottom_Canv');
        context = canv_temp.getContext('2d');
        tempCanvas.width = canvas_grid_bottom_width;
        tempCanvas.height = canvas_grid_bottom_height;
        tempContext = tempCanvas.getContext("2d");

        tempContext.drawImage(context.canvas, 0, 0);
        canv_temp.width = canvas_grid_bottom_width;
        canv_temp.height = canvas_grid_bottom_height;
        context.drawImage(tempContext.canvas, 0, 0);
        canvas_grid_bottom.renderAll();

        canv_temp = document.getElementById('id_Canv_Grid_Left_Canv');
        context = canv_temp.getContext('2d');
        tempCanvas.width = canvas_grid_left_width;
        tempCanvas.height = canvas_grid_left_height;
        tempContext = tempCanvas.getContext("2d");

        tempContext.drawImage(context.canvas, 0, 0);
        canv_temp.width = canvas_grid_left_width;
        canv_temp.height = canvas_grid_left_height;
        context.drawImage(tempContext.canvas, 0, 0);
        canvas_grid_left.renderAll();

        canv_temp = document.getElementById('c');
        context = canv_temp.getContext('2d');
        tempCanvas.width = canvas_width;
        tempCanvas.height = canvas_height;
        tempContext = tempCanvas.getContext("2d");

        tempContext.drawImage(context.canvas, 0, 0);
        canv_temp.width = canvas_width;
        canv_temp.height = canvas_height;
        context.drawImage(tempContext.canvas, 0, 0);
        canvas.renderAll();

        canv_temp = document.getElementById('c2');
        context = canv_temp.getContext('2d');
        tempCanvas.width = canvas_width;
        tempCanvas.height = canvas_height;
        tempContext = tempCanvas.getContext("2d");

        tempContext.drawImage(context.canvas, 0, 0);
        canv_temp.width = canvas_width;
        canv_temp.height = canvas_height;
        context.drawImage(tempContext.canvas, 0, 0);
        canvas_down.renderAll();

    }