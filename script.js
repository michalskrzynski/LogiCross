class Board {
  constructor( div ) {
    this.div = div;
  }

  placePawns( startSequence ) {
    let pawnConfig = Pawn.cleanConfig();
    for( let i = 0; i < 6; i++) this.div.appendChild( document.createElement("div") );

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

    for( let i = 0; i < 6; i++) this.div.appendChild( document.createElement("div") );
  }
}


class Game {

  constructor( levels, originalLevel ) {
    this.game = levels.find( l => l.originalLevel === originalLevel );

    if( !this.game ) alert('Level not found!');

    //TODO code level integrity check!
  }

  get gameSerialized() {
    return this.game.gameSerialized;
  }

  get startSequence() {
    return [...this.gameSerialized.matchAll( /\w+/g )].map( (e) => e[0] );
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
board.placePawns( (new Game(levels, 5)).startSequence ); 


