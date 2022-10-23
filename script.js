class GameManager {
  static theBoard;
  static theSolution;
  static gameEasy;
  static gameHard;
  static inputLevel;
  static changeLevel;
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
    GameManager.inputLevel = initObj.inputLevel;
    GameManager.changeLevel = initObj.changeLevel;


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


    GameManager.changeLevel.addEventListener('click', GameManager.newLevel );
    GameManager.repeatLevel.addEventListener('click', e => Board.resetLevel() );
    GameManager.undo.addEventListener('click', GameManager.undoMove );
  } 

  static newGame( level ) {
    GameManager.game = new Game(levels, level);
    GameManager.game.restart();

    Board.initiate( GameManager.theBoard, GameManager.theSolution);
    Board.play( GameManager.game );
  }

  static undoMove() {
    let lastMove = GameManager.game.lastMove; 
    if( lastMove ) {
      Board.putPawnBack( lastMove ) 
      GameManager.game.moveBack();
    }
  }

  static newLevel() {
    Board.destroy();
    GameManager.newGame( Number( inputLevel.value ) );
  }
}




const rulesPopup = document.getElementById( 'rulesPopup' );
const howToPlay = document.getElementById( 'howToPlay' );
const closePopup = document.getElementById( 'closePopup' );
howToPlay.addEventListener( 'click', e => rulesPopup.style.display = 'block' );
closePopup.addEventListener( 'click', e=> rulesPopup.style.display = 'none' );



GameManager.initialize( {
  theBoard: document.getElementById( "theBoard" ),
  theSolution: document.getElementById( "theSolution"),
  gameEasy: document.getElementById( 'gameEasy' ),
  gameHard: document.getElementById( 'gameHard' ),
  inputLevel: document.getElementById( 'inputLevel' ),
  changeLevel: document.getElementById( 'changeLevel' ),
  repeatLevel: document.getElementById('repeatLevel'),
  undo: document.getElementById('undo'),
});

let defaultLevel = 25;
document.getElementById( 'inputLevel').value = defaultLevel;
GameManager.newGame( defaultLevel );







