define([
  './board',
  './modes',
  'lodash',
  'frozen/utils/distance',
  'frozen/utils/radiansFromCenter'
], function(board, modes, _, distance, radiansFromCenter){

  'use strict';

  var maxVelocity = 3; //how fast the disc can be traveling over the hole

  var nextDisc= function(){

  };

  return function(millis){
    var game = this;

    _.forEach(this.discs, function(disc){
      var dist = distance(disc, board.goalPt);
      var velocity = Math.sqrt(disc.linearVelocity.x * disc.linearVelocity.x + disc.linearVelocity.y * disc.linearVelocity.y);
      if(disc.onSurface && dist > board.surfaceRadius){
        //console.log('off surface');
        game.box.removeBody(disc.id);
        disc.groupIndex = 3;
        disc.onSurface = false;
        game.box.addBody(disc);
        game.box.setLinearVelocity(disc.id, disc.linearVelocity.x, disc.linearVelocity.y);
        //game.box.applyImpulse(disc.id, radiansFromCenter(game.scaledGoalPt, disc), 3);
      }else if (disc.onSurface && dist < board.goalRadius){
        if(velocity > maxVelocity){
          game.box.removeBody(disc.id);
          disc.groupIndex = 3;
          disc.onSurface = false;
          game.box.addBody(disc);
          game.box.setLinearVelocity(disc.id, 0, 0);
          game.box.setPosition(disc.id, disc.startPosition.x, disc.startPosition.y);
          disc.drawMode = 0;
          disc.goal = true;
        }else{
          console.log('velocity', velocity);
        }
      }
    });


    if(this.mode === modes.SHOT){
      var stillInPlay = false;
      _.forEach(this.discs, function(disc){
        if(disc.onSurface ){
          //console.log('off surface');
          var velocity = Math.sqrt(disc.linearVelocity.x * disc.linearVelocity.x + disc.linearVelocity.y * disc.linearVelocity.y);
          if(velocity > 0.01){
            stillInPlay = true;
          }
        }
      });
      if(!stillInPlay){
        if(this.selectedDisc.number >= 0){
          var lastDisc = this.selectedDisc;
          lastDisc.drawMode = 0;
          this.selectedDisc.selected = false;
          this.selectedDisc = this.discs[lastDisc.number - 1];
          this.whiteTurn = this.selectedDisc.white;
          if(this.whiteTurn){
            game.box.setPosition(game.selectedDisc.id, board.goalPt.x, board.goalPt.y + board.outerRing);
          }else{
            game.box.setPosition(game.selectedDisc.id, board.goalPt.x, board.goalPt.y - board.outerRing);
          }
          game.selectedDisc.onSurface = true;
          game.selectedDisc.selected = true;
          this.selectedDisc.drawMode = modes.START_PLACE;
          this.mode = modes.START_PLACE;
        }
      }
    }

  };

});