class Move {

  constructor( colorAnimal, position, row, col ) {
    this.colorAnimal = colorAnimal;
    this.position = position;

    this.row = row;
    this.col = col;
  }

  get color() {
    return this.colorAnimal[0];
  }

  get animal() {
    return this.colorAnimal[1];
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
  }

  
  //
  // Starts the game, i.e sets up all Moves on the imaginary board => currentSetting
  //
  restart() {
    this.solution = [];
    this.currentSetting = [];
    
    
    let count = 1;
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

  moveBack() {
    let lastMove = this.solution.pop();
    this.currentSetting[ lastMove.row, lastMove.col ] = lastMove;
    return lastMove;
  }

  #transposeCountFrom1( count ) {
    return Math.floor((count-1) / 4) + ((count-1) % 4)*4 + 1;
  }

  isMoveAllowed( colorAnimal ) {
    let move = this.#findMove( colorAnimal );
    //cannot make a move if the pawn not in the currentSetting
    if( move === null ) return false;

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

  #findMove( colorAnimal ) {
    return this.currentSetting.flat().find( m => m !== null && m.colorAnimal === colorAnimal );
  }

  //
  //  Removes the pawn from currentSetting, puts it to the solution.
  //
  makeMove( colorAnimal ) {
    if( this.isMoveAllowed( colorAnimal ) ) {

        let theMove = this.#findMove( colorAnimal );
        this.solution.push( theMove );
        
        // find and remove from currentSetting
        let coord = this.#coordinatesForMove( theMove );
        this.currentSetting[ coord.row ][ coord.col ] = null;

        return theMove;
    }
    else throw new Error( 'Move not allowed' );
  }

  isDeadlock() {
    return !this.currentSetting.flat().some( m => m !== null && this.isMoveAllowed( m.colorAnimal ) );
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
