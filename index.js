var board = [];
var rows = 9;
var columns = 9;
var catsRemaining = 10;
var catsLocation = {};
var safeCount = rows * columns - catsRemaining;

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
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < columns; j++) {
      if (board[i][j] !== 0) {
        $('.' + (i + 1) + ' :nth-child(' + (j + 1) + ')').text(board[i][j]);
      }
    }
  }

  //disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };

  $('.body').mousedown(function(event){
    var currentSquare = event.target;
    var x = Number(currentSquare.classList[1]);
    var y = Number(currentSquare.parentElement.classList[1]);

    if (event.button === 2 && currentSquare.classList.contains('square') && !currentSquare.classList.contains('sink')) {
      event.target.classList.toggle('poop');
    }
    if (event.button === 0 && currentSquare.classList.contains('square') && !currentSquare.classList.contains('poop') && !currentSquare.classList.contains('sink')) {
      if (currentSquare.innerHTML === 'cat') {
        currentSquare.classList.add('sink', 'poop');
        var audio = {};
        audio['meow'] = new Audio();
        audio['meow'].src = "assets/Cat-meow-mp3.mp3";
        audio['meow'].volume = 0.1;
        audio['meow'].play();
      } else {
        currentSquare.classList.add('sink', 'show');

        check(x, y);
        safeCount--;
        if (safeCount === 0) {
          alert('YOU WIN!!!!');
        }
      }
    }
  }); 
});

var check = function(x, y) {
  if ($('.' + y + ' :nth-child(' + x + ')')[0].innerHTML === 'cat') {
    return false;
  } else if ($('.' + y + ' :nth-child(' + x + ')')[0].innerHTML) {
    return true;
  } else {
    if (y - 1 > 0 && !$('.' + (y - 1) + ' :nth-child(' + x + ')')[0].classList.contains('sink')) {
      safeCount--;
      $('.' + (y - 1) + ' :nth-child(' + x + ')').addClass('sink');
      $('.' + (y - 1) + ' :nth-child(' + x + ')').addClass('show');
      check(x, y - 1);
    }
    if (y + 1 <= columns && !$('.' + (y + 1) + ' :nth-child(' + x + ')')[0].classList.contains('sink')) {
      safeCount--;
      $('.' + (y + 1) + ' :nth-child(' + x + ')').addClass('sink');
      $('.' + (y + 1) + ' :nth-child(' + x + ')').addClass('show');
      check(x, y + 1);
    }
    if (x - 1 > 0 && !$('.' + y + ' :nth-child(' + (x - 1) + ')')[0].classList.contains('sink')) {
      safeCount--;
      $('.' + y + ' :nth-child(' + (x - 1) + ')').addClass('sink');
      $('.' + y + ' :nth-child(' + (x - 1) + ')').addClass('show');
      check(x - 1, y);
    }
    if (x + 1 <= rows && !$('.' + y + ' :nth-child(' + (x + 1) + ')')[0].classList.contains('sink')) {
      safeCount--;
      $('.' + y + ' :nth-child(' + (x + 1) + ')').addClass('sink');
      $('.' + y + ' :nth-child(' + (x + 1) + ')').addClass('show');
      check(x + 1, y);
    }
    return 1;
  }
};