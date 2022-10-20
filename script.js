class Board {
  constructor( div ) {
    this.div = div;
  }

  placePawns( startSequence ) {
    let pawnConfig = Pawn.cleanConfig();

    //first div row for board offset purposes
    for( let i = 0; i < 6; i++) this.div.appendChild( document.createElement("div") );


    //drawing pawns
    for(let i = 0; i < 4; i++ ) {
      this.div.appendChild( document.createElement("div") );

      for( let j = 0; j < 4; j++ ) {
        let pawnDiv = document.createElement( "div" );
        this.div.appendChild( pawnDiv ); 


        let animal = startSequence[i*4 + j];
        pawnConfig.imageMargin = Pawn.marginFor( animal );
        let pawn = new Pawn( pawnDiv, pawnConfig );
      }

      this.div.appendChild( document.createElement("div") );
    }


    //last div row
    for( let i = 0; i < 6; i++) this.div.appendChild( document.createElement("div") );
  }
}

class Move {

  constructor( animalColor, position, row, col ) {
    this.animalColor = animalColor;
    this.position = position;

    this.row = row;
    this.col = col;
  }

  get color() {
    return this.animalColor[0];
  }

  get animal() {
    return this.animalColor[1];
  }

}

class Game {

  static animal = ['R', 'D', 'S', 'C'];
  static color = ['W', 'Y', 'B', 'R'];

  //level
  //currentSetting
  //solution


  //
  // @param {levels} array of objects describing all available defined levels
  // @param {originalLevel} a number of level from the LogiCross booklet, consider id of a level
  // 
  constructor( levels, originalLevel ) {
    this.level = levels.find( l => l.originalLevel === originalLevel );
    if( !this.level ) throw new Error('Level not found: ' + originalLevel);

    if( !Game.isIntegral( this.startSequence ) ) throw new Error('Game integrity fail: ' + sequence.join( ' ' ));
    this.solution = [];

  }

  
  //
  // Starts the game, i.e sets up all Moves on the imaginary board => currentSetting
  //
  start() {
    let count = 1;
    this.currentSetting = [];
    let ss = this.startSequence;

    this.startSequence.reduce( (prev, curr) => {
      
      //below calculations because of transposed array in original game booklet, live with it
      prev.push( new Move( curr, this.#transposeCountFrom1( count ), Math.floor((count-1)/4), (count-1) % 4 ) );
      if( count++ % 4 === 0 ) {
        this.currentSetting.push( prev );
        return [];
      }
      else return prev;

    }, []);
  }

  #transposeCountFrom1( count ) {
    return Math.floor((count-1) / 4) + ((count-1) % 4)*4 + 1;
  }

  isMoveAllowed( move ) {
    //if this is the first move, and first pawn in a row
    if( this.lastMove === null ) return move.col === 0;

    //false if colors or animals not match
    if( this.lastMove.color !== move.color && this.lastMove.animal !== move.animal) return false

    //is first in line?
    
    let sliced = this.currentSetting[move.row].slice(0, move.col);
    return move.col === 0 || this.currentSetting[move.row].slice(0, move.col).every( m => m === null);
  }

  #coordinatesForMove( move ) {
    let cs = this.currentSetting;
    for( let i = 0; i < cs.length; i++ ) {
      for( let j = 0; j < cs[i].length; j++ ) {
        if( cs[i][j] !== null && move.position === cs[i][j].position ) { return { row: i, col: j } }
      }
    }
  }

  makeMove( animalColor ) {
    let theMove = this.currentSetting.flat().find( m => m !== null && m.animalColor === animalColor );


    if( theMove ) { //theMove will not be found if already in solution[]
      if( this.isMoveAllowed( theMove ) ) {
          this.solution.push( theMove );
          
          
          // find and remove from currentSetting
          let coord = this.#coordinatesForMove( theMove );
          this.currentSetting[ coord.row ][ coord.col ] = null;
      }
      else throw new Error( 'Move not allowed' );
    }
    else {
      throw new Error( 'Pawn already out.' );
    }

    return theMove;
  }

  get lastMove() {
    return this.solution.length === 0 ? null : this.solution[ this.solution.length - 1 ];
  }

  //
  // Checks if the game is integral, i.e if all pawns are used.
  //
  static isIntegral( sequence ) {
    if( sequence.length !== 16 ) { console.error( "Sequence != 16"); return false; }
    
    let combination = [];
    Game.color.forEach( c => Game.animal.forEach( a => combination.push( c+a ) ));

    return combination.every( e => sequence.includes( e ) );
  }


  //
  // @return string like: "BR BS RR WS  RC WC RS YR  RD WR WD YC  YS BD YD BC"
  //
  get gameSerialized() {
    return this.level.gameSerialized;
  }

  //
  // @return array of pawns like ['BR', 'BS', 'RR', 'WS', 'RC', 'WC', 'RS', 'YR', 'RD', 'WR', 'WD', 'YC', 'YS', 'BD', 'YD', BC]
  //
  get startSequence() {
    return [...this.level.gameSerialized.matchAll( /\w+/g )].map( (e) => e[0] );
  }
}


class Pawn {

  static defaultWidth = 140;
  static defaultHeight = 140;
  static imageOffsetTop = 16;
  static imageOffsetLeft = 56;

  //div - container
  //img - image inside the container

  constructor( div, config ) {
    this.div = div;
    div.style.overflow = "hidden";
    div.style.width = config.width;
    div.style.height = config.height;
    
    this.img = document.createElement('img');
    this.img.src = config.imageSrc;
    this.img.style.margin = config.imageMargin;

    div.appendChild( this.img );
  }

  static marginFor( colorAnimal ) {
    // WR = white rooster, BC = blue cow
    let color = colorAnimal[0];
    let animal = colorAnimal[1];

    let animalIndex = {R: 0, D: 1, S: 2, C: 3};
    let colorIndex = {W: 0, Y: 1, B: 2, R: 3}
    
    let margin = '-';
    margin += (Pawn.imageOffsetTop + animalIndex[ animal ] * Pawn.defaultHeight) + "px";
    margin += ' 0px 0px -';
    margin += (Pawn.imageOffsetLeft + colorIndex[ color ] * Pawn.defaultWidth) + "px";

    return margin;
  }

  static cleanConfig() {
    return {
      width: Pawn.defaultWidth + "px",
      height: Pawn.defaultHeight + "px",
      imageSrc: "./logicross.jpeg",
      imageMargin: Pawn.marginFor( "RC" ),
    };
  }
}

let board = new Board( document.getElementById( "theBoard" ));
let game = new Game(levels, 5);
board.placePawns( game.startSequence ); 

game.start();
console.log( game.currentSetting );

let move = null;

move = game.makeMove( 'RD' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'RC' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'WC' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'WR' );
console.log( move.position, game.currentSetting );

// move = game.makeMove( 'WS' ); //wrong
// console.log( move.position, game.currentSetting );

move = game.makeMove( 'BR' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'BS' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'RS' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'RR' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'YR' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'YS' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'WS' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'WD' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'BD' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'YD' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'YC' );
console.log( move.position, game.currentSetting );

move = game.makeMove( 'BC' );
console.log( move.position, game.currentSetting );

