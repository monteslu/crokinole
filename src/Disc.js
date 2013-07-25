define([
  'dcl',
  'frozen/box2d/entities/Circle',
  'frozen/plugins/loadImage!images/dark_disc.png',
  'frozen/plugins/loadImage!images/light_disc.png'
], function(dcl, Circle, dark_img, light_img){

  'use strict';

  return dcl(Circle, {
    id: 'ball',
    staticBody: false,
    radius: 16,
    linearDamping : 0.9,
    angularDamping : 0.4,
    touching: {},
    black: false,
    disc: true,
    onSurface: false,
    inGutter: false,
    groupIndex: 1,
    draw: function(ctx){

      ctx.save();

      ctx.translate(this.x * this.scale, this.y * this.scale);
      ctx.rotate(this.angle);
      ctx.translate(-(this.x) * this.scale, -(this.y) * this.scale);
      if(this.black){
        ctx.drawImage(dark_img, (this.x * this.scale) - 16, (this.y * this.scale) - 16, 32,32);
      }else{
        ctx.drawImage(light_img, (this.x * this.scale) - 16, (this.y * this.scale) - 16, 32,32);
      }

      ctx.restore();

    }
  });

});
