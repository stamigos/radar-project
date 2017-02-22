var grid_canvas;
var map_canvas;

$(window).on('load', function() {
    grid_canvas = new fabric.Canvas('id_canvas_grid', {renderOnAddRemove: false});
    map_canvas = new fabric.Canvas('id_canvas_map', {hoverCursor: 'default', selection: false});


    grid.init();
    radar.init();
    grid.drawgrid.DrawGrid(1)
    radar.Draw(1.2);

});

