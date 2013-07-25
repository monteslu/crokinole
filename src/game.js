define([
  './update',
  './draw',
  './handleInput',
  './Disc',
  './discStarts',
  './modes',
  './board',
  'lodash',
  'frozen/box2d/Box',
  'frozen/box2d/BoxGame',
  'frozen/box2d/entities',
  'frozen/utils/scalePoints',
  './boxData'
], function(update, draw, handleInput, Disc, discStarts, modes, board, _, Box, BoxGame, entities, scalePoints, boxData){

  'use strict';

  //setup a GameCore instance
  var game = new BoxGame({
    canvasId: 'canvas',
    gameAreaId: 'gameArea',
    canvasPercentage: 0.99,
    update: update,
    draw: draw,
    handleInput: handleInput,
    box: new Box({
      gravityX: 0,
      gravityY: 0
    }),
    IMPULSE_PER_PIXEL: 0.3,
    MAX_IMPULSE_PIXELS: 150,
    whiteScore: 0,
    blackScore: 0,
    startPts: {black: {x: 45, y: 43}, white: {x: 45, y: 960}},
    discs: []
  });

  _.forEach(boxData.entities, function(entity){
    if(entities[entity.type]){
      game.addBody(new entities[entity.type](entity));
    }
  });

  //scale the board's dimensions to the box scale
  board.goalPt = scalePoints(board.unscaledGoalPt, 1/game.box.scale);
  board.surfaceRadius = board.unscaledSurfaceRadius / game.box.scale;
  board.outerRing = board.unscaledOuterRing / game.box.scale;
  board.middleRing = board.unscaledMiddleRing / game.box.scale;
  board.innerRing = board.unscaledInnerRing / game.box.scale;
  board.goalRadius = board.unscaledGoalRadius / game.box.scale;

  var i;

  for(i = 0; i < 12; i++){
    var bd = new Disc({
      id: 'db' + i,
      number: i,
      black: true,
      x: game.startPts.black.x + i * 64,
      y: game.startPts.black.y
    });

    game.addBody(bd);
    game.discs.push(bd);
  }

  for(i = 0; i < 12; i++){
    var wd = new Disc({
      id: 'dw' + i,
      number: i,
      black: false,
      x: game.startPts.white.x + i * 64,
      y: game.startPts.white.y
    });
    game.addBody(wd);
    game.discs.push(wd);
  }

  //start it up
  game.mode = modes.WHITE_START_PLACE;

  game.selectedDisc = game.discs[23];
  game.box.setPosition(game.selectedDisc.id, board.goalPt.x, board.goalPt.y + board.outerRing);
  game.selectedDisc.onSurface = true;

  //if you want to take a look at the game object in dev tools
  console.log(game);

  //launch the game!
  game.run();

});