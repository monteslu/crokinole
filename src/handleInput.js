define([
  './board',
  './modes',
  './rotateVector',
  'dojo/has',
  'dojo/keys',
  'lodash',
  'frozen/utils/distance',
  'frozen/utils/scalePoints',
  'frozen/utils/radiansFromCenter'
], function(board, modes, rotateVector, has, keys, _, distance, scalePoints, radiansFromCenter){

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
    var dist, angle, distPerc, newPos;

    if(this.mode === modes.START_PLACE){
      if(im.mouseAction.isPressed() && position){
        console.log('change to placing');
        this.mode = modes.PLACING;
      }
    }
    else if(this.mode === modes.PLACING){
      if(im.mouseAction.isPressed()){
        angle = radiansFromCenter(im.mouseAction.startPosition, position);
        dist = im.mouseAction.startPosition.x - position.x;
        distPerc = Math.min(Math.abs(dist), board.unscaledMiddleRing) / board.unscaledMiddleRing;
        if(dist < 0){
          distPerc = -distPerc;
        }
        var rotationAngle = distPerc * Math.PI / 4;
        if(this.whiteTurn){
          newPos = rotateVector({x: 0, y: board.outerRing}, rotationAngle);
        }
        else{
          newPos = rotateVector({x: 0, y: -board.outerRing}, -rotationAngle);
        }
        // console.log(newPos, distPerc, rotationAngle);
        this.box.setPosition(sd.id, board.goalPt.x + newPos.x, board.goalPt.y + newPos.y );
      }else{
        if(this.mode === modes.PLACING){
          sd.drawMode = modes.START_SHOOT;
          this.mode = modes.START_SHOOT;
        }
        im.mouseAction.position = null;
      }
    }
    else if(this.mode === modes.START_SHOOT){
      if(im.mouseAction.isPressed() && position){
        console.log('change to placing');
        this.mode = modes.SHOOTING;
      }
    }
    else if(this.mode === modes.SHOOTING){


      if(!im.mouseAction.isPressed() && position && sd && sd.onSurface){
        var dPx = scalePoints(sd, sd.scale);
        dist = distance(im.mouseAction.startPosition, position);

        // Flick
        angle = radiansFromCenter(im.mouseAction.startPosition, position) + Math.PI;
        var impulse = Math.min(dist * this.IMPULSE_PER_PIXEL, this.MAX_IMPULSE_PIXELS * this.IMPULSE_PER_PIXEL);
        console.log('hit', angle, impulse);
        this.box.applyImpulse(sd.id, angle, impulse);
        // Reset mouse position
        im.mouseAction.position = null;
        this.mode = modes.SHOT;
      }
    }

  };

});