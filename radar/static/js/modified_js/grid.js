
$(window).on('load', function() {
    grid.Init();
    console.log("canvas width:", canvas.width);
    console.log("canvas height:", canvas.height);
    // grid.drawgrid.GridBottom(1);
    // grid.drawgrid.GridLeft(1);
    grid.drawgrid.Grid(1)
    console.log("in grid")
});

var grid = new function () {
    this.Init = function () {
     }

};

grid.drawgrid = {
    Grid: function(scale){
          var rect = new fabric.Rect({
                left: 100,
                top: 50,
                width: 100,
                height: 100,
                fill: 'green',
                angle: 20,
                padding: 10
          });
    },

    GridLeft: function(sc_y) {
        var point_x = 35;
        var point_y = 0; // starting y point
        var vertical_line = new fabric.Line([point_x,point_y,point_x,canvas.height], {
                    strokeWidth: 1,
                    fill: '#dddddd',
                    stroke: '#dddddd',
                    class: 'line',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false
                });
        canvas_grid_left.add(vertical_line);
        canvas_grid_left.renderAll()

    },
    GridBottom: function(sc_x) {
        var point_x = 0; // starting x point
        var point_y = 0;
        var horizontal_line = new fabric.Line([point_x, point_y, canvas.width, point_y], {
                    strokeWidth: 1,
                    fill: '#dddddd',
                    stroke: '#dddddd',
                    class: 'line',
                    originX: 'center',
                    originY: 'center',
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false
        });
        canvas_grid_bottom.add(horizontal_line);
        canvas_grid_bottom.renderAll()
    }
};
// grid.drawgrid = {
//     /*########################################################################################################## GRID BOTTOM */
//
//     GridBottom: function (p_x,sc_x) {
//             var POINT_X=Math.floor(p_x);
//             var SCALE_X=sc_x;
//             var step_GRID_X=canvas.width/35;
//             var ind_step_POINT_X=Math.round(POINT_X/step_GRID_X);
//             var step_scale_GRID_X=step_GRID_X*SCALE_X;
//             var quan_step_scale_GRID_X_left=Math.round(POINT_X/step_scale_GRID_X)+1;
//             var quan_step_scale_GRID_X_right=Math.round((canvas.width-POINT_X)/step_scale_GRID_X);
//             var offset_left_scale_POINT_X=(POINT_X-ind_step_POINT_X*step_GRID_X)*SCALE_X;
//             var offset_right_scale_POINT_X=((ind_step_POINT_X+1)*step_GRID_X-POINT_X)*SCALE_X;
//             var line_grid,text,x,y,i,txt="none";
//             canvas_grid_bottom.clear();
//             for(i=0; i<quan_step_scale_GRID_X_left;i++){
//                 console.log("line drawed")
//                 x=Math.round(POINT_X-offset_left_scale_POINT_X-step_scale_GRID_X*i);
//                 if((ind_step_POINT_X-i)%5==0){
//                     y=15;
//                     txt=""+(ind_step_POINT_X-i)*10-150+"";
//                 }
//                 else {
//                     y=10;
//                     txt="none";
//                 }
//
//                 line_grid = new fabric.Line([x,0,x,y], {
//                     //strokeWidth: 1,
//                     fill: '#666666',
//                     stroke: '#666666',
//                     class: 'line',
//                     originX: 'center',
//                     originY: 'center',
//                     selectable: false,
//                     hasBorders: false,
//                     hasControls: false,
//                     evented: false
//                 });
//
//                 if(txt != 'none'){
//                     text = new fabric.Text(txt, { left: x, top: y+3, fontSize: 13, fontFamily: 'Roboto Light', originX: 'center', evented: false, selectable: false});
//                     if (i==(quan_step_scale_GRID_X_left-1)) {
//                         text.set({originX: 'left'});
//                     }
//                     canvas_grid_bottom.add(text);
//                 }
//                 canvas_grid_bottom.add(line_grid);
//             }
//
//
//             for(i=0; i<quan_step_scale_GRID_X_right;i++){
//                 x=Math.round(POINT_X+offset_right_scale_POINT_X+step_scale_GRID_X*i);
//                 //console.info(quan_step_scale_GRID_X_right,x);
//                 if((ind_step_POINT_X+i+1) % 5 == 0){
//                     y=15;
//                     txt=""+(ind_step_POINT_X+i+1)*10-150+"";
//                 }
//                 else{
//                     y=10;
//                     txt="none";
//                 }
//
//                 line_grid = new fabric.Line([x,0,x,y], {
//                     //strokeWidth: 1,
//                     fill: '#666666',
//                     stroke: '#666666',
//                     class: 'line',
//                     originX: 'center',
//                     originY: 'center',
//                     selectable: false,
//                     hasBorders: false,
//                     hasControls: false,
//                     evented: false
//                 });
//
//                 if(txt!='none'){
//                     text = new fabric.Text(txt, { left: x, top: y+3, fontSize: 13, fontFamily: 'Roboto Light', originX: 'center', evented: false, selectable: false});
//                     if(i==(quan_step_scale_GRID_X_right-1)){text.set({originX: 'right'});}
//                     canvas_grid_bottom.add(text);
//                 }
//                 canvas_grid_bottom.add(line_grid);
//             }
//         canvas_grid_bottom.renderAll();
//     },
//
//     GridLeft: function (p_y,sc_y) {
//         var POINT_Y=Math.floor(p_y);
//         console.log("POINT_Y:", POINT_Y)
//         var SCALE_Y=sc_y;
//         var step_GRID_Y=canvas.height/35;
//         var ind_step_POINT_Y=Math.round(POINT_Y/step_GRID_Y);
//         var step_scale_GRID_Y=step_GRID_Y*SCALE_Y;
//         var quan_step_scale_GRID_Y_top=Math.round(POINT_Y/step_scale_GRID_Y)+1;
//         var quan_step_scale_GRID_Y_bottom=Math.round((canvas.height-POINT_Y)/step_scale_GRID_Y);
//         var offset_top_scale_POINT_Y=(POINT_Y-ind_step_POINT_Y*step_GRID_Y)*SCALE_Y;
//         var offset_bottom_scale_POINT_Y=((ind_step_POINT_Y+1)*step_GRID_Y-POINT_Y)*SCALE_Y;
//         var line_grid,text,x,y,i,txt="none";
//         canvas_grid_left.clear();
//
//         for(i=0; i < quan_step_scale_GRID_Y_top; i++){
//             y = Math.round(POINT_Y-offset_top_scale_POINT_Y-step_scale_GRID_Y*i);
//             console.info(quan_step_scale_GRID_Y_top,y);
//             if((ind_step_POINT_Y-i) % 5 == 0){
//                 // grid point with text
//                 x = canvas_grid_left.width-10; // coordinate x for long dash
//                 txt = ""+(35-ind_step_POINT_Y+i)*10+"";
//             }
//             else {
//                 // grid point without text
//                 x = canvas_grid_left.width-5; // coordinate x for short dash
//                 txt = "none";
//             }
//
//             line_grid = new fabric.Line([x,y,canvas_grid_left.width,y], {
//                 //strokeWidth: 1,
//                 fill: '#666666',
//                 stroke: '#666666',
//                 class: 'line',
//                 originX: 'center',
//                 originY: 'center',
//                 selectable: false,
//                 hasBorders: false,
//                 hasControls: false,
//                 evented: false
//             });
//
//             if(txt!='none'){
//                 text = new fabric.Text(txt, { left: x-3, top: y-3, fontSize: 13, fontFamily: 'Roboto Light', originX: 'right', originY: 'center', evented: false, selectable: false});
//                 if(i==(quan_step_scale_GRID_Y_top-1)){text.set({originY: 'top'});}
//                 canvas_grid_left.add(text);
//             }
//             canvas_grid_left.add(line_grid);
//         }
//
//
//         for(i=0; i<quan_step_scale_GRID_Y_bottom;i++){
//             y=Math.round(POINT_Y+offset_bottom_scale_POINT_Y+step_scale_GRID_Y*i);
//             //console.info(quan_step_scale_GRID_Y_bottom,y,ind_step_POINT_Y);
//             if((ind_step_POINT_Y+i+1) % 5 == 0){
//                 x=canvas_grid_left.width-10;
//                 txt=""+(35-(ind_step_POINT_Y+1+i))*10+"";
//             }
//             else{x=canvas_grid_left.width-10;txt="none";}
//
//             line_grid = new fabric.Line([x,y,canvas_grid_left.width,y], {
//                 // strokeWidth: 1,
//                 fill: '#666666',
//                 stroke: '#666666',
//                 class: 'line',
//                 originX: 'center',
//                 originY: 'center',
//                 selectable: false,
//                 hasBorders: false,
//                 hasControls: false,
//                 evented: false
//             });
//
//             if(txt!='none'){
//                 text = new fabric.Text(txt, { left: x-3, top: y-3, fontSize: 13, fontFamily: 'Roboto Light', originX: 'right', originY: 'center', evented: false, selectable: false});
//                 if(i==(quan_step_scale_GRID_Y_bottom-1)){text.set({originY: 'bottom'});}
//                 canvas_grid_left.add(text);
//             }
//             canvas_grid_left.add(line_grid);
//         }
//
//         canvas_grid_left.renderAll();
//     }
//
// };
//
//















