class Board {
  static theBoardDiv = null;
  static game = null;
  static pawns = [];

  static initiate( theBoardDiv, theSolutionDiv, game ) {
    Board.theBoardDiv = theBoardDiv;
    Board.theSolutionDiv = theSolutionDiv;
  }

  static play( game ) {
    Board.game = game;
    Board.pawns = [];
    Board.#placeAllPawns(); 
  }

  static putPawnBack( lastMove ) {
    let pawn = Board.pawns.find( p => p.move.position === lastMove.position );
    Board.#pawnBackOnTheBoard(pawn);
  }

  static resetLevel() {
    Board.pawns.forEach( p => Board.#pawnBackOnTheBoard( p ) );
    Board.game.restart();
  }


  //
  //  PRIVATE
  //
  static #placeAllPawns() {
    let pawnConfig = Pawn.cleanConfig();

    //first div row for board offset purposes
    for( let i = 0; i < 6; i++) Board.theBoardDiv.appendChild( document.createElement("div") );


    let cs = Board.game.currentSetting;
    for( let i = 0; i < cs.length; i++) {
      Board.theBoardDiv.appendChild( document.createElement("div") );

      for( let j = 0; j < cs[i].length; j++ ) {
        let pawnDiv = document.createElement( "div" );
        Board.theBoardDiv.appendChild( pawnDiv ); 

        pawnConfig.imageMargin = Pawn.marginFor( cs[i][j].colorAnimal );
        let pawn = new Pawn( pawnDiv, cs[i][j], pawnConfig );
        Board.pawns.push( pawn );
      }
      Board.#addAllEventListeners();

      Board.theBoardDiv.appendChild( document.createElement("div") );
    }

    //last div row
    for( let i = 0; i < 6; i++) Board.theBoardDiv.appendChild( document.createElement("div") );
  }

  static #addAllEventListeners() {
    Board.pawns.forEach( p => p.contentDiv.addEventListener( "click", Board.#onPawnClick ) );
  }



  static #onPawnClick( e ) {
    let colorAnimal = Board.#extractPawnDescriptor(e.currentTarget.id); 
    if( Board.game.isMoveAllowed( colorAnimal ) ) {

      //making the move
      e.currentTarget.removeEventListener('click', Board.#onPawnClick);
      Board.game.makeMove( colorAnimal );
      Board.theSolutionDiv.appendChild( e.currentTarget );


      setTimeout( function() {
        if( Board.game.isFinished() === 16 ) alert("You won!");
        else if ( Board.game.isDeadlock() ) alert("You lost!");
      }, 100);

    } 
    else {
      alert( "This move is not allowed."); 
    }
  } 

  static #extractPawnDescriptor( pawnId ) {
    return pawnId.substring(5); 
  }

  static #pawnBackOnTheBoard(pawn) {
    pawn.gridDiv.appendChild(pawn.contentDiv);
    pawn.contentDiv.addEventListener('click', Board.#onPawnClick);
  }
}





class Pawn {

  static defaultWidth = 141;
  static defaultHeight = 136;
  static imageOffsetTop = 23;
  static imageOffsetLeft = 60;
  static borderRadius = 9;

  //gridDiv - parent container
  //contentDiv - div representing this Pawn
  //imageHolder - div holding the image
  //img - image inside the container

  constructor( gridDiv, move, config ) {
    this.gridDiv = gridDiv;
    this.move = move;

    this.contentDiv = document.createElement('div');
    this.contentDiv.id = "pawn_" + move.colorAnimal;
    this.contentDiv.className = "pawn";

    this.imageHolder = document.createElement('div');
    this.imageHolder.style.overflow = "hidden";
    this.imageHolder.style.width = config.width;
    this.imageHolder.style.height = config.height;
    this.imageHolder.style.border = "2px solid green";
    this.imageHolder.style.borderRadius = Pawn.borderRadius + "px";
    
    this.img = document.createElement('img');
    this.img.src = config.imageSrc;
    this.img.style.margin = config.imageMargin;

    this.positionDiv = document.createElement('div');
    this.positionDiv.classList.add('position');
    this.positionDiv.style.zIndex = 100;
    this.positionDiv.innerText = move.position;

    this.imageHolder.appendChild( this.img );
    this.contentDiv.appendChild( this.imageHolder );
    this.contentDiv.appendChild( this.positionDiv );
    this.gridDiv.appendChild( this.contentDiv );
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
      width: (Pawn.defaultWidth - Pawn.borderRadius/2) + "px",
      height: (Pawn.defaultHeight - Pawn.borderRadius/2)+ "px",
      imageSrc: "./animals-640x580.jpeg",
      imageMargin: Pawn.marginFor( "RC" ),
    };
  }
}


