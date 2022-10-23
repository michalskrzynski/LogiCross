const rulesPopup = document.getElementById( 'rulesPopup' );
const howToPlay = document.getElementById( 'howToPlay' );
howToPlay.addEventListener( 'click', e => rulesPopup.style.display = 'block' );


let game = new Game(levels, 15);
game.restart();

Board.initiate( document.getElementById( "theBoard" ), document.getElementById( "theSolution"), game);
Board.placeAllPawns(); 

document.getElementById('repeatLevel').addEventListener('click', e => { Board.resetLevel() });
document.getElementById('undo').addEventListener('click', e=> { let lastMove = game.lastMove; 
  Board.putPawnBack( lastMove ) 
  game.moveBack();
} );


