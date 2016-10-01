var board = [];
var rows = 9;
var columns = 9;
var catsRemaining = 10;
var catsLocation = {};

for (var i = 0; i < rows; i++) {
  var row = [];
  for (var j = 0; j < columns; j++) {
    row.push(0);
  }
  board.push(row);
}

while (catsRemaining > 0) {
  var condition  = true;
  while (condition) {
    var x = Math.floor(Math.random() * rows) + 1;
    var y = Math.floor(Math.random() * columns) + 1;
    if (!catsLocation[x]) {
      catsLocation[x] = [y];
      board[x - 1][y - 1] = 'cat';
      condition = false;
    } else if (!catsLocation[x].includes(y)) {
      catsLocation[x].push(y);
      board[x - 1][y - 1] = 'cat';
      condition = false;
    }
  }
  catsRemaining--;
}

for (var i = 0; i < rows; i++) {
  for (var j = 0; j < columns; j++) {
    if (board[i][j] !== 'cat') {
      var count = 0;
      if(board[i - 1]) {
        if (board[i - 1][j - 1] === 'cat') {
          count++;
        }
        if (board[i - 1][j] === 'cat') {
          count++;
        }
        if (board[i - 1][j + 1] === 'cat') {
          count++;
        }
      }
      if (board[i][j - 1] === 'cat') {
        count++;
      }
      if (board[i][j + 1] === 'cat') {
        count++;
      }
      if(board[i + 1]) {
        if (board[i + 1][j - 1] === 'cat') {
          count++;
        }
        if (board[i + 1][j] === 'cat') {
          count++;
        }
        if (board[i + 1][j + 1] === 'cat') {
          count++;
        }
      }
      board[i][j] = count;
    }
  }
}

$(document).ready(function(){
  for (var key in catsLocation) {
    for (var i = 0; i < catsLocation[key].length; i++) {
      $('.' + Number(key) + ' :nth-child(' + catsLocation[key][i] + ')').addClass('poop');
    }
  }
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      if (board[i][j] !== 'cat') {
        $('.' + (i + 1) + ' :nth-child(' + (j + 1) + ')').text(board[i][j]);
      }
    }
  }

  //disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };

  $('.body').mousedown(function(event){ 
    if (event.button === 2 && event.target.classList.contains('square') && !event.target.classList.contains('sink')) {
      event.target.classList.toggle('poop');
    }
    if (event.button === 0 && event.target.classList.contains('square') && !event.target.classList.contains('poop')) {
      event.target.classList.add('sink', 'show');
    }
  }); 
});