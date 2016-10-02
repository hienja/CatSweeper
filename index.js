var board = [];
var rows = 9;
var columns = 9;
var totalCats = 10;
var catsLocation = {};
var safeCount = rows * columns - totalCats;

var eachSquare = function (callback, initialize) {
  for (var i = 0; i < rows; i++) {
    if (initialize) {
      board[i] = initialize(i);
    }
    for (var j = 0; j < columns; j++) {
      board[i][j] = callback(i, j);
    }
  }
}

var addCats = function(catsNeeded) {
  while (catsNeeded > 0) {
    var condition  = true;
    while (condition) {
      var x = Math.floor(Math.random() * rows);
      var y = Math.floor(Math.random() * columns);
      if (!catsLocation[x]) {
        catsLocation[x] = [y];
        board[x][y] = 'cat';
        condition = false;
      } else if (!catsLocation[x].includes(y)) {
        catsLocation[x].push(y);
        board[x][y] = 'cat';
        condition = false;
      }
    }
    catsNeeded--;  
  }
} 

var withinRange = function (value, length) {
  if (value >= 0 && value < length) {
    return true;
  } else {
    return false;
  }
}

var surroundingArea = function (x, y, callback, startsAtOne) {
  var count = 0;
  startsAtOne = startsAtOne ? 1 : 0;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if(withinRange(x + i - startsAtOne, rows) && withinRange(y + j - startsAtOne, columns)) {
        count += callback(x + i, y + j);
      }
    }
  }
  return count;
}

var countCats = function (x, y) {
  if (board[x][y] === 'cat') {
    return 'cat';
  } else {
    return surroundingArea(x, y, function(i, j) {
      if (board[i][j] === 'cat') {
        return 1;
      } else {
        return 0;
      }
    });
  }
}

var blankAffect = function (x, y) {
  if (x <= rows && !$('.' + y + ' :nth-child(' + x + ')')[0].classList.contains('sink')) {
    safeCount--;
    $('.' + y + ' :nth-child(' + x + ')').addClass('sink').addClass('show');
    checkSquare(x, y);
  }
}

var checkSquare = function(x, y) {
  if ($('.' + y + ' :nth-child(' + x + ')')[0].innerHTML === 'cat') {
    return false;
  } else if ($('.' + y + ' :nth-child(' + x + ')')[0].innerHTML) {
    return true;
  } else {
    surroundingArea(x, y, blankAffect, true);
    return 1;
  }
};

var initializeGame = function () {

  eachSquare(function(){
    return 0;
  }, function () {
    return [];
  });
  addCats(totalCats);
  eachSquare(countCats);
  //Place numbers and cats on the board
  eachSquare(function (x, y){
    var color = 'black';

    switch (board[x][y]) {
      case 1:
        color = 'blue';
        break;
      case 2:
        color = 'green';
        break;
      case 3:
        color = 'red';
        break;
      case 4:
        color = 'purple';
        break;
      case 5:
        color = 'black';
        break;
      case 6:
        color = 'maroon';
        break;
      case 7:
        color = 'gray';
        break;
      case 8:
        color = 'turquoise';
        break;
      default:
        color = color
    }

    if (board[x][y] !== 0) {
      $('.' + (y + 1) + ' :nth-child(' + (x + 1) + ')').text(board[x][y]).css('color', color);
    }
  })

  $('.board').mousedown(function(event){
    var currentSquare = event.target;
    var x = Number(currentSquare.classList[1]);
    var y = Number(currentSquare.parentElement.classList[1]);

    //Logic for left mouse click
    if (event.button === 0 && currentSquare.classList.contains('square') && !currentSquare.classList.contains('poop') && !currentSquare.classList.contains('sink')) {
      if (currentSquare.innerHTML === 'cat') {
        $('.start').css('background-image', 'url(assets/images/fugCat.gif)');
        currentSquare.classList.add('sink', 'poop');
        var audio = {};
        audio['meow'] = new Audio();
        audio['meow'].src = "assets/Cat-meow-mp3.mp3";
        audio['meow'].volume = 0.1;
        audio['meow'].play();
        $('.board').off('mousedown');
      } else {
        $('.start').css('background-image', 'url(assets/images/eyesCat.gif)');
        $(document).one('mouseup', function() {
          $('.start').css('background-image', 'url(assets/images/cat.png)');
        });
        currentSquare.classList.add('sink', 'show');
        checkSquare(x, y);
        safeCount--;
        if (safeCount === 0) {
          $('.start').css('background-image', 'url(assets/images/glassesCat.gif)');
          $('.board').off('mousedown');
          alert('YOU WIN!!!!');
        }
      }
    }

    //Logic for click both left and right mouse click
    if (event.button === 1 && currentSquare.classList.contains('square') && currentSquare.classList.contains('sink')) {
      if (surroundingArea(x, y, countCats, true) === 0) {
        surroundingArea(x, y, checkSquare, true);
      }
    }

    //Logic for right mouse click
    if (event.button === 2 && currentSquare.classList.contains('square') && !currentSquare.classList.contains('sink')) {
      event.target.classList.toggle('poop');
    }
  }); 
}

$(document).ready(function(){
  //Disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };
  initializeGame();
  $('.start').mousedown(function(event) {
    board = [];
    safeCount = rows * columns - totalCats;
    $('.start').css('background-image', 'url(assets/images/cat.png)').addClass('sink')
    $(document).one('mouseup', function(event) {
      $('.start').removeClass('sink');
    });
    $('.square').removeClass('show').removeClass('sink').removeClass('poop').text('');
    initializeGame()
  })
});