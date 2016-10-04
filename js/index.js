
var b = new Board();
var squares = ["r1c1", "r1c2", "r1c3", "r2c1","r2c2","r2c3","r3c1","r3c2","r3c3"];
var icons = ["<i class='fa fa-times fa-2x'></i>","<i class='fa fa-circle-o fa-2x'></i>"];
$(document).ready(function(){
  $(".cube").on("click", function(){
    var s = squares.indexOf($(this).attr("id"));
    if (b.getTurn() == b.getPlayer() ){
      b.playerMove( b.getPlayer(), s);
    }
  });

  $("#btnReset").on("click", function(){
    resetBoard();
  });

  $("#btnChange").on("click", function(){
    b.changePlayer();
  });
});


function resetBoard(){
  for( i=0; i<9; i++){
    $("#"+squares[i]).html("");
  }
  b.reset();
  
}
