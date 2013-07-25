define([
  './board',
  'lodash',
  'frozen/utils/distance',
  'frozen/utils/radiansFromCenter'
], function(board, _, distance, radiansFromCenter){

  'use strict';

  var maxVelocity = 3; //how fast the disc can be traveling over the hole w

  return function(millis){
    var game = this;
    _.forEach(this.discs, function(disc){
      var dist = distance(disc, board.goalPt);
      if(disc.onSurface && dist > board.surfaceRadius){
        //console.log('off surface');
        var velocity = Math.sqrt(disc.linearVelocity.x * disc.linearVelocity.x + disc.linearVelocity.y * disc.linearVelocity.y);
        
        game.box.removeBody(disc.id);
        disc.groupIndex = 3;
        disc.onSurface = false;
        game.box.addBody(disc);
        game.box.setLinearVelocity(disc.id, disc.linearVelocity.x, disc.linearVelocity.y);
        //game.box.applyImpulse(disc.id, radiansFromCenter(game.scaledGoalPt, disc), 3);
      }
    });
  };

});