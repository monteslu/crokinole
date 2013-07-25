define([
  './board',
  'dojo/has',
  'dojo/keys',
  'lodash',
  'frozen/utils/distance',
  'frozen/utils/scalePoints',
  'frozen/utils/radiansFromCenter'
], function(board, has, keys, _, distance, scalePoints, radiansFromCenter){

  'use strict';



  return function(im){
    var sd = this.selectedDisc;
    if(im.mouseAction.isPressed() && !sd){
      var sposition = scalePoints(im.mouseAction.position, 1/this.box.scale);
      //console.log(sposition);
      var game = this;
      _.forEach(this.entities, function(ent){
        if(ent.disc && ent.pointInShape(sposition)){
          game.selectedDisc = ent;
          console.log(game.selectedDisc);
        }
      });
    }
    
    var position = im.mouseAction.position;
    if(!im.mouseAction.isPressed() && position && sd && sd.onSurface){
      var dPx = scalePoints(sd, sd.scale);
      var dist = distance(dPx, position);

      // Flick
      var angle = radiansFromCenter(dPx, position) + Math.PI;
      var impulse = Math.min(dist * this.IMPULSE_PER_PIXEL, this.MAX_IMPULSE_PIXELS * this.IMPULSE_PER_PIXEL);
      console.log('hit', angle, impulse);
      this.box.applyImpulse(sd.id, angle, impulse);
      // Reset mouse position
      im.mouseAction.position = null;
      this.selectedDisc = null;
    }
    else if(!im.mouseAction.isPressed() && position && sd && !sd.onSurface){
      var holeDist = distance(board.unscaledGoalPt, position);
      if(holeDist > 305 && holeDist < 326){
        this.box.removeBody(sd.id);
        sd.groupIndex = 1;
        sd.x = position.x / this.box.scale;
        sd.y = position.y / this.box.scale;
        sd.onSurface = true;
        this.box.addBody(sd);
      }

      // Reset mouse position
      im.mouseAction.position = null;
      this.selectedDisc = null;
    }
    
  };

});