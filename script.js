
let game = new Game(levels, 60);
game.restart();

Board.initiate( document.getElementById( "theBoard" ), document.getElementById( "theSolution"), game);
Board.placeAllPawns(); 

document.getElementById('repeatLevel').addEventListener('click', e => { game.restart(); Board.resetLevel() });
document.getElementById('goBack').addEventListener('click', e=> { let lastMove = game.moveBack(); Board.putPawnBack( lastMove ) } );


