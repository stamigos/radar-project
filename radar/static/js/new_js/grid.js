var grid = new function CanvasGrid() {
    this.init = function() {
        this.grid_width = 644;
        this.grid_height = 455;
        this.left = 36;
        this.top = 10;
        this.convert_coordinates()
    };

    this.convert_coordinates = function() {
        this.real_width = 300;
        this.real_height = 350;
        this.point_x = this.grid_width/this.real_width;
        this.point_y = this.grid_height/this.real_height;
        this.step_x = this.point_x * 50;
        this.step_y = this.point_y * 50;
    }
};

grid.drawgrid = {
    DrawGrid: function(scale) {
        console.log(grid.left, grid.top, grid.grid_width);
        var rect = new fabric.Rect({
                left: grid.left,
                top: grid.top,
                bottom: grid.bottom,
                width: grid.grid_width,
                height: grid.grid_height,
                fill: 'transparent',
                angle: 0,
                padding: 10,
                strokeWidth: 1,
                stroke: '#dddddd',
                selectable: false,
                hasBorders: true,
                hasControls: false,
                evented: false,
                overflow: 'hidden'
          });

        grid.drawgrid.DrawLeftScale();
        grid.drawgrid.DrawBottomScale();


        grid_canvas.add(rect);
        grid_canvas.renderAll()
    },
    DrawLeftScale: function() {
        var y = 10;
        var x1 = grid.left-10;
        var x2 = grid.left;
        var map_y = 350;

        grid.drawgrid.DrawDash(x1, y, x2, y);
        grid.drawgrid.WriteDashText(map_y, x1-13, y-10);

        while (y < grid.grid_height) {
            var sub_y = y;
            while (sub_y < y + grid.step_y) {
                grid.drawgrid.DrawDash(x1+5, sub_y, x2, sub_y);
                sub_y = sub_y + grid.point_y*10;
            }
            y = y + grid.step_y;
            map_y = map_y - 50;

            grid.drawgrid.DrawDash(x1, y, x2, y);
            grid.drawgrid.WriteDashText(map_y, x1-13, y-10);
        }
    },
    DrawBottomScale: function() {
        var y1 = grid.grid_height + 10;
        var y2 = grid.grid_height + 15;
        var x = 36;
        var map_x = -150;

        grid.drawgrid.DrawDash(x, y1, x, y2+5);
        grid.drawgrid.WriteDashText(map_x, x, y2+5);

        while (x < grid.grid_width) {
            var sub_x = x;
            while (sub_x < x + grid.step_x) {
                sub_x = sub_x + grid.point_x*10;
                grid.drawgrid.DrawDash(sub_x, y1, sub_x, y2);
            }
            x = x + grid.step_x;
            map_x = map_x + 50;
            if (map_x == 0) {
                // canvas.setZoom(canvas.getZoom() * 1.1 ) ;
                radar.Draw(1.0)
            }
            grid.drawgrid.DrawDash(x, y1, x, y2+5);
            grid.drawgrid.WriteDashText(map_x, x, y2+5);
            console.log("x:", x)
        }
    },

    DrawDash: function(x1, y1, x2, y2) {
        var dash_grid =  new fabric.Line([x1, y1, x2, y2], {
                    strokeWidth: 1,
                    fill: 'transparent',
                    stroke: '#dddddd',
                    selectable: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false
                });
        grid_canvas.add(dash_grid);
        return dash_grid;
    },

    WriteDashText: function(point_to_add, left, top) {
        var text = new fabric.Text((point_to_add).toString(), {
            left: left,
            top: top,
            fontSize: 13,
            fontFamily: 'Roboto Light',
            fill: '#666666',
            originX: 'center',
            evented: false,
            selectable: false});
        grid_canvas.add(text);
        return text;
    }
};
