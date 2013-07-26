define([
  './rotateVector',
  './board',
  './modes',
  'frozen/plugins/loadImage!images/board.png',
  'frozen/utils/distance',
  'frozen/utils/scalePoints',
  'frozen/utils/translatePoints',
  'frozen/utils/radiansFromCenter'
], function(rotateVector, board, modes, boardImg, distance, scalePoints, translatePoints, radiansFromCenter){

  'use strict';


  return function(context){

    context.font = 'bold 55px Arial';
    context.strokeStyle = '#000';
    context.textAlign = 'center';

    var im = this.inputManager;

    context.drawImage(boardImg,0, 0, this.width, this.height);
    for(var id in this.entities){
      if(!this.entities[id].staticBody){
        this.entities[id].draw(context);
      }
    }


    var MIN_TRANSPARENCY = 0.5;
    var MIN_STROKE_LINE = 2;
    var style;
    if(this.mode === modes.START_PLACE){
      context.fillStyle = '#FF0';
      context.fillText('Drag anywhere to place disc.', board.unscaledGoalPt.x, board.unscaledGoalPt.y);
      context.strokeText('Drag anywhere to place disc.', board.unscaledGoalPt.x, board.unscaledGoalPt.y);

    }
    else if(this.mode === modes.START_SHOOT){
      context.fillStyle = '#0F0';
      context.fillText('Drag anywhere to shoot.', board.unscaledGoalPt.x, board.unscaledGoalPt.y);
      context.strokeText('Drag anywhere to shoot.', board.unscaledGoalPt.x, board.unscaledGoalPt.y);
    }
    else if(this.mode === modes.PLACING){

    }else if(this.mode === modes.SHOOTING){
      if(im.mouseAction.position && this.selectedDisc){

        var ogLineWidth = context.lineWidth;

        if(this.selectedDisc.onSurface){

          var dPx = scalePoints(this.selectedDisc, this.selectedDisc.scale);
          var length = Math.min(distance(im.mouseAction.startPosition, im.mouseAction.position), this.MAX_IMPULSE_PIXELS);
      
          var impPerc = length / this.MAX_IMPULSE_PIXELS;
          var angle = radiansFromCenter(im.mouseAction.startPosition, im.mouseAction.position) + Math.PI;

          //end of the arrow head
          var p2 = translatePoints(rotateVector({x: 0, y: impPerc * this.MAX_IMPULSE_PIXELS / 3 }, angle), dPx);

          //corners of the triangle
          var p3 = translatePoints(rotateVector({x: 0, y: length/10 }, angle + Math.PI/2),p2);
          var p4 = translatePoints(rotateVector({x: 0, y: length/10 }, angle + Math.PI * 1.5), p2);

          //end of arrow
          var p5 = translatePoints(rotateVector({x: 0, y: impPerc * this.MAX_IMPULSE_PIXELS }, angle), dPx);

          

          style = 'rgba(255,0,0,' + (impPerc > MIN_TRANSPARENCY ? impPerc : MIN_TRANSPARENCY) + ')';
          context.fillStyle = style;
          context.strokeStyle = style;

          //arrow head
          context.beginPath();
          context.moveTo(dPx.x, dPx.y);
          context.lineTo(p3.x, p3.y);
          context.lineTo(p4.x, p4.y);
          context.lineTo(dPx.x, dPx.y);
          context.closePath();
          context.fill();

          //arrow shaft
          var lineWidth = impPerc * 6 + 1;
          context.lineWidth = lineWidth > MIN_STROKE_LINE ? lineWidth : MIN_STROKE_LINE;
          context.beginPath();
          context.moveTo(p2.x, p2.y);
          context.lineTo(p5.x, p5.y);
          context.closePath();
          context.stroke();

          
        }

        context.lineWidth = ogLineWidth;
      }

    }
    

  };

});