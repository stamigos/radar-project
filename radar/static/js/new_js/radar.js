var radar = new function CanvasRadar() {
    this.init = function () {
        this.width = 500;
        this.height = 455;
        this.color = '#d6e6ff';
        this.left = 320;
        this.top = 0;
        this.angle = 180;
    };

    this.Draw = function(scale) {

        var clipRect1 = new fabric.Rect({
            originX: 'left',
            originY: 'top',
            left: 36,
            top: 0,
            width: 644,
            height: 456,
            fill: '#DDD', /* use transparent for no fill */
            strokeWidth: 0,
            selectable: false
        });

        clipRect1.set({
            clipFor: 'triangle'
        });
        map_canvas.add(clipRect1);

        function findByClipName(name) {
            return _(map_canvas.getObjects()).where({
                    clipFor: name
                })[0]
        }

        // Since the `angle` property of the Image object is stored
        // in degrees, we'll use this to convert it to radians.
        function degToRad(degrees) {
            return degrees * (Math.PI / 180);
        }

        var clipByName = function (ctx) {
            this.setCoords();
            var clipRect = findByClipName(this.clipName);
            var scaleXTo1 = (1 / this.scaleX);
            var scaleYTo1 = (1 / this.scaleY);
            ctx.save();

            var ctxLeft = -( this.width / 2 ) + clipRect.strokeWidth;
                var ctxTop = -( this.height / 2 ) + clipRect.strokeWidth;
                var ctxWidth = clipRect.width - clipRect.strokeWidth;
                var ctxHeight = clipRect.height - clipRect.strokeWidth;

            ctx.translate( ctxLeft, ctxTop );

            ctx.rotate(degToRad(this.angle * -1));
            ctx.scale(scaleXTo1, scaleYTo1);
            ctx.beginPath();
            ctx.rect(
                clipRect.left - this.oCoords.tl.x,
                clipRect.top - this.oCoords.tl.y,
                clipRect.width,
                clipRect.height
            );
            ctx.closePath();
            ctx.restore();
        };

        var triangle = new fabric.Triangle({
            originX: 'center',
            originY: 'bottom',
            width: this.width * scale,
            height: this.height * scale,
            fill: this.color,
            left: this.left,
            top: this.top * scale,
            angle: this.angle,
            hasBorders: false,
            hasControls: false,
            clipName: 'triangle',
            hoverCursor: 'pointer',
            clipTo: function(ctx) {
                return _.bind(clipByName, triangle)(ctx)
            }
        });
        // triangle.set('flipY', true);

        map_canvas.add(triangle);

        // map_canvas.renderAll()

    };
};
// radar.installation = {
//     Draw: function(scale) {
//         var triangle = new fabric.Triangle({
//             width: 550 * scale,
//             height: 455 * scale,
//             fill: '#d6e6ff',
//             left: 634,
//             top: 464 * scale,
//             angle: 180,
//             selectable: false,
//             hasBorders: false,
//             hasControls: false,
//             evented: false
//             // clipTo: function(ctx) {
//             //     console.log(ctx)
//             //     ctx.rect(-322, -230, grid.grid_width, grid.grid_height);
//             // }
//         });
//         canvas.add(triangle);
//         // canvas.on('after:render', function() {
//         //     var bound = triangle.getBoundingRect();
//         //
//         //     canvas.contextContainer.strokeRect(
//         //         bound.left,
//         //         bound.top,
//         //         bound.width,
//         //         bound.height
//         //     );
//         // });
//     }
// };