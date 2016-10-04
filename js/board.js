function Board(){
  this.boardstate = [0,0,0,0,0,0,0,0,0];
  this.full = false;
  this.moves = 2;
  this.p1 = "X";
  this.AI = "O";
  this.turn = "X";
  this.players = ["X","O"];
  this.icons = ["<i class='fa fa-times fa-3x'></i>","<i class='fa fa-circle-o fa-3x'></i>"];
  this.p1Score = 0;
  this.AIScore = 0;
}

Board.prototype.isFull = function(board){
  for(i=0;i<board.length;i++){
    if (board[i] == 0){
      return false;
    }
  }
  this.full=true;
  return this.full;
}

Board.prototype.copyBoard = function(board){
  return board.slice(0);
}

Board.prototype.checkWinner = function(player, board){
  if(
         board[0] == player && board[1] == player && board[2] == player
      || board[3] == player && board[4] == player && board[5] == player
      || board[6] == player && board[7] == player && board[8] == player
      || board[0] == player && board[3] == player && board[6] == player
      || board[1] == player && board[4] == player && board[7] == player
      || board[2] == player && board[5] == player && board[8] == player
      || board[0] == player && board[4] == player && board[8] == player
      || board[2] == player && board[4] == player && board[6] == player
    ){
       return true;
     }
  return false;
  //winnners
  //111000000
  //000111000
  //000000111
  //100100100
  //010010010
  //001001001
  //100010001
  //001010100
}
Board.prototype.updateScore = function(){
  $("#score").html( "<u>Score</u><br>Player 1: " + this.p1Score + "<br>Computer: " + this.AIScore);
}
Board.prototype.playerMove = function( player, square){
  if (this.checkMove(square)){
    this.boardstate[square] = player;
    $("#"+squares[square]).html(b.icons[b.players.indexOf(player)]);
    if( this.checkWinner(player, this.boardstate) ){
      if (player == this.p1){
        this.p1Score++;
        $("#popup").html(this.icons[ this.players.indexOf(this.p1)] + "<br>wins the game!");
        $("#popup").velocity( "transition.fadeIn", {duration: 1500, visibility:"visible"})
                   .velocity( "transition.fadeOut", {duration: 1500, delay: 1000, complete:function(){resetBoard();}});
      } else {
        this.AIScore++;
        $("#popup").html(this.icons[ this.players.indexOf(this.AI)] + "<br>wins the game!");
        $("#popup").velocity( "transition.fadeIn", {duration: 1500, visibility:"visible"})
                   .velocity( "transition.fadeOut", {duration: 1500, delay: 1000, complete:function(){resetBoard();}});
      }
      this.updateScore();
      //resetBoard();
      return;
    } else if (this.isFull(this.boardstate)){
      $("#popup").html("Draw!");
      $("#popup").velocity( "transition.fadeIn", {duration: 1500, visibility:"visible"})
                 .velocity( "transition.fadeOut", {duration: 1500, delay: 1000, complete:function(){resetBoard();}});
      return;
    }
    this.moves++;
    this.changeTurn();
    if (this.getTurn() == this.AI){
      var rand = getRandomIntInclusive(1, 8);
      if ( rand == 3){
        nextMove = this.findRandomMove(this.boardstate);
      } else {
        nextMove = this.findMove(this.boardstate);
      }
      this.playerMove( this.AI, nextMove);
    }
 }

}

Board.prototype.checkMove = function(square){
  if( this.boardstate[square] == 0){
    return true;
  } else {
    return false;
  }
}
Board.prototype.getMoves = function(){
  return this.moves;
}
Board.prototype.getTurn = function(){
  return this.turn;
}
Board.prototype.changeTurn = function(){
  if (this.turn == "X"){
    this.turn = "O";
  } else {
    this.turn = "X";
  }
}
Board.prototype.changePlayer = function(){
  b.reset();
  if ( this.p1 == "X"){
    this.p1 = "O";
    this.turn = "O";
    this.AI = "X"

  } else {
    this.p1 = "X";
    this.turn="X";
    this.AI = "O";
  }
  if (this.getTurn() == this.AI){
    nextMove = this.findMove(this.boardstate);
    this.playerMove( this.AI, nextMove);
  }
  $("#symbol").html( "<u>Your Symbol</u><br>" + this.icons[ this.players.indexOf(this.p1)]);
  this.reset();
  resetBoard();
}

Board.prototype.getPlayer = function(){
  return this.p1;
}
Board.prototype.reset = function(){
  this.boardstate = [0,0,0,0,0,0,0,0,0];
  this.full = false;
  this.terminal = false;
  this.moves = 2;
  this.turn = this.p1
}
Board.prototype.makeMove = function(move, player, board) {

    var newBoard = this.copyBoard(board);
    if (newBoard[move] == 0) {
        newBoard[move] = player;
        return newBoard;
    } else {
        return null;
    }
};
Board.prototype.findMove = function(board) {
    var bestMoveValue = -100;
    var move = 0;
    for (var i = 0; i < board.length; i++) {
        var newBoard = this.makeMove(i, this.AI, board);
        if (newBoard) {
            var predictedMoveValue = this.minValue(newBoard);
            if (predictedMoveValue > bestMoveValue) {
                bestMoveValue = predictedMoveValue;
                move = i;
            }
        }
    }
    return move;
};
Board.prototype.findRandomMove = function(board){
  var randomMoves = [];
  for (i=0; i<board.length;i++){
    if(board[i] == 0){
      randomMoves.push(i);

    }
  }
  var index = getRandomIntInclusive(0,randomMoves.length-1);
  return randomMoves[ index ];
}
Board.prototype.minValue = function(board) {

    // The first three conditions check are the stop
    // conditions for the loop.
    if (this.checkWinner(this.AI, board)) {
        return 1;
    } else if (this.checkWinner(this.p1, board)) {
        return -1;
    } else if (this.isFull(board)) {
        return 0;
    } else {
        var bestMoveValue = 100;
        var move = 0;
        for (var i = 0; i < board.length; i++) {
            var newBoard = this.makeMove(i, this.p1, board);
            if (newBoard) {
                var predictedMoveValue = this.maxValue(newBoard);
                if (predictedMoveValue < bestMoveValue) {
                    bestMoveValue = predictedMoveValue;
                    move = i;
                }
            }
        }
        return bestMoveValue;
    }
};
Board.prototype.maxValue = function(board) {
    if (this.checkWinner(this.AI, board)) {
        return 1;
    } else if (this.checkWinner(this.p1, board)) {
        return -1;
    } else if (this.isFull(board)) {
        return 0;
    } else {
        var bestMoveValue = -100;
        var move = 0;
        for (var i = 0; i < board.length; i++) {
            var newBoard = this.makeMove(i, this.AI, board);
            if (newBoard) {
                var predictedMoveValue = this.minValue(newBoard);
                if (predictedMoveValue > bestMoveValue) {
                    bestMoveValue = predictedMoveValue;
                    move = i;
                }
            }
        }
        return bestMoveValue;
    }
};

function  getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
