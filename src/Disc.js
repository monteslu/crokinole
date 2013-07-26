define([
  './modes',
  'dcl',
  'frozen/box2d/entities/Circle',
  'frozen/plugins/loadImage!images/dark_disc.png',
  'frozen/plugins/loadImage!images/light_disc.png'
], function(modes, dcl, Circle, dark_img, light_img){

  'use strict';

  return dcl(Circle, {
    id: 'ball',
    staticBody: false,
    radius: 16,
    linearDamping : 0.9,
    angularDamping : 0.4,
    touching: {},
    white: true,
    disc: true,
    onSurface: false,
    inGutter: false,
    groupIndex: 1,
    selected: false,
    drawMode: 0,
    goal: false,
    draw: function(ctx){

      ctx.save();

      ctx.translate(this.x * this.scale, this.y * this.scale);
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * this.scale, -(this.y) * this.scale);
      if(this.white){
        ctx.drawImage(light_img, (this.x * this.scale) - 16, (this.y * this.scale) - 16, 32,32);
      }else{
        ctx.drawImage(dark_img, (this.x * this.scale) - 16, (this.y * this.scale) - 16, 32,32);
      }

      if(this.drawMode !== 0 || this.goal){
        ctx.lineWidth = 3;
        if(this.drawMode === modes.START_PLACE){
          ctx.strokeStyle = "#FF0";
        }
        else if(this.goal){
          ctx.strokeStyle = "#FFF";
          ctx.fillStyle = "#0F0";
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('20', this.x * this.scale, this.y * this.scale + 8);
        }
        else{
          ctx.strokeStyle = "#0F0";
        }
        ctx.beginPath();
        ctx.arc(this.x * this.scale, this.y * this.scale, this.radius * this.scale, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();

    }
  });

});
