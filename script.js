class GameManager {
  static gameEasy;
  static gameHard;
  static repeatLevel;
  static undo;

  static game;

  static initialize( initObj ) {
    GameManager.theBoard = initObj.theBoard;
    GameManager.theSolution = initObj.theSolution;
    GameManager.gameEasy = initObj.gameEasy;
    GameManager.gameHard = initObj.gameHard;
    GameManager.repeatLevel = initObj.repeatLevel;
    GameManager.undo = initObj.undo;

    GameManager.gameEasy.addEventListener( 'click', e=> { 
      gameEasy.style.textDecoration = 'underline'; 
      gameHard.style.textDecoration = 'none';
      undo.style.visibility = 'visible'; 
    });
    GameManager.gameHard.addEventListener( 'click', e=> { 
      gameEasy.style.textDecoration = 'none'; 
      gameHard.style.textDecoration = 'underline';
      undo.style.visibility = 'hidden'; 
    });

    GameManager.repeatLevel.addEventListener('click', e => { Board.resetLevel() });
    GameManager.undo.addEventListener('click', GameManager.undoMove );
  } 

  static newGame( level ) {
    GameManager.game = new Game(levels, level );
    GameManager.game.restart();

    Board.initiate( GameManager.theBoard, GameManager.theSolution, GameManager.game);
    Board.placeAllPawns(); 
  }

  static undoMove() {
    let lastMove = GameManager.game.lastMove; 
    Board.putPawnBack( lastMove ) 
    GameManager.game.moveBack();
  }
}




const rulesPopup = document.getElementById( 'rulesPopup' );
const howToPlay = document.getElementById( 'howToPlay' );
howToPlay.addEventListener( 'click', e => rulesPopup.style.display = 'block' );


GameManager.initialize( {
  theBoard: document.getElementById( "theBoard" ),
  theSolution: document.getElementById( "theSolution"),
  gameEasy: document.getElementById( 'gameEasy' ),
  gameHard: document.getElementById( 'gameHard' ),
  repeatLevel: document.getElementById('repeatLevel'),
  undo: document.getElementById('undo'),
});

GameManager.newGame( 15 );







