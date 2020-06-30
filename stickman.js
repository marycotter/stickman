fabric.Object.prototype.originX = 'left';
fabric.Object.prototype.originY = 'top';
fabric.Object.prototype.centeredRotation = false;

fabric.Stickman = fabric.util.createClass(fabric.Group,{
    type: 'stickman',

    config: function(options = {}){
        // shallow extend
        options.locy = options.top || 100;
        options.locx = options.left || 250;
        
        const defaults = Object.assign({
            color: 'purple',
            headRadius: 30,
            armLength: 50,
            legLength: 50,
            legAngle: 30,
            weight: 7,
            walkDuration: 1000,
            box: false,
            walk: false
        }, options);

        // body part location based on locx and locy
        var spine = defaults.locx;
        var hip = defaults.locy + defaults.height - defaults.legLength; // - 10
        var footlvl = defaults.locy + defaults.height;
        var shoulder = defaults.locy + defaults.headRadius + 10;

        defaults.height = (defaults.haedRadius*2) + (hip-shoulder) + (Math.cos(30)*defaults.legLength);
        defaults.width = defaults.headRadius*2;

        var parts = [];

        // Leg variables
        var legMove = -3;

        // set variables with "this" for global access within the class
        this.walkDuration = defaults.walkDuration; // 3 seconds

        // Left Leg
        parts[0] = new fabric.Line([spine+legMove, hip, defaults.locx, footlvl],{
            fill: defaults.color,
            stroke: defaults.color,
            strokeWidth: defaults.weight,
            strokeLineCap: 'round',
            angle: -defaults.legAngle, 
            originX: 'left',
            originY: 'top',
            centeredRotation: false
        });

        // Right Leg
        parts[1] = new fabric.Line([spine-legMove, hip, defaults.locx, footlvl],{
            fill: defaults.color,
            stroke: defaults.color,
            strokeWidth: defaults.weight,
            strokeLineCap: 'round',
            angle: defaults.legAngle,
            originX: 'right',
            originY: 'top',
            centeredRotation: false
        });

        // Body
        parts[2] = new fabric.Line([spine, defaults.locy + defaults.headRadius, spine, hip], {
            fill: defaults.color,
            stroke: defaults.color,
            strokeWidth: defaults.weight,
            strokeLineCap: 'round',
            originX: 'center',
            originY: 'center',
            angle: 0
        });

        // left arm
        parts[3] = new fabric.Line([spine, shoulder, defaults.locx-defaults.armLength, shoulder],{
            fill: defaults.color,
            stroke: defaults.color,
            strokeWidth: defaults.weight,
            strokeLineCap: 'round',
            originX: 'right',
            originY: 'top',
            angle: -defaults.armAngle,
        });

        // right arm
        parts[4] = new fabric.Line([spine, shoulder, defaults.locx + defaults.armLength, shoulder],{
            fill: defaults.color,
            stroke: defaults.color,
            strokeWidth: defaults.weight,
            strokeLineCap: 'round',
            originX: 'left',
            originY: 'top',
            angle: defaults.armAngle,
        });

        // Head
        parts[5] = new fabric.Circle({
            top: defaults.locy,
            left: spine,
            radius: defaults.headRadius,
            fill: defaults.color,
            stroke: defaults.color,
            originX: 'center',
            originY: 'center',
            angle: 0
        });

        //Optional Box (can be changed to something else too)
        parts[6] = new fabric.Rect({
            top: shoulder,
            left: spine,
            width:50,
            height: 50,
            color: 'black',
            opacity: defaults.box ? 100 : 0,
            originX: 'center'
        }); 
        return {parts, ...defaults}
    },

    initialize: function(options){
        fabric.Object.prototype.centeredRotation = false;

        const config = this.config(options);

        this.callSuper('initialize', config.parts, {
            color: config.color,
            locx: config.locx,
            locy: config.locy,
            weight: config.weight,
        });
    },
    _render: function(ctx) {
        this.callSuper('_render', ctx);
    },
    walk: function(duration) {
        const leftLeg = this.item(0);
        const rightLeg = this.item(1);
        rightLeg.set('angle', rightLeg.angle-5);
        leftLeg.set('angle', -rightLeg.angle);
        if(rightLeg.angle>=30 || rightLeg.angle<=-30) {
            rightLeg.set('angle', 30);
            leftLeg.set('angle', -rightLeg.angle);
            theCanvas.renderAll();
        }
        console.log(leftLeg.angle, rightLeg.angle);
        theCanvas.renderAll();
    },
    changeColor: function(newColor) {
        const config = this.config({color: newColor});

        // change color of each item
        for (let i = 0; i < config.parts.length; i++){
            this.item(i).set('fill', config.color);
            this.item(i).set('stroke', config.color);
        }
        theCanvas.renderAll();
    },
    updateLoc: function(newLocx, newLocy, duration) {
        newLocx = Math.random() * (theCanvas.width - this.width);
        newLocy = Math.random() * (theCanvas.height - this.height);
        this
        this.setCoords();
        theCanvas.renderAll();
    },
    showBox: function() {
        this.item(6).set('opacity', 100);
        this.set('box', true);
        theCanvas.renderAll();
        console.log('box shown');
    },
    hideBox: function() {
        this.item(6).set('opacity', 0);
        this.set('box', false);
        theCanvas.renderAll();
        console.log('box not shown');
    }
});