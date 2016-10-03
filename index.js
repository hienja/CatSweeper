var board = [];
var rows = 9;
var columns = 9;
var totalCats = 10;
var catsLocation = {};
var safeCount = rows * columns - totalCats;
var audio = {};
audio['meow'] = new Audio();
audio['meow'].src = "assets/Cat-meow-mp3.mp3";
audio['meow'].volume = 0.1;

var eachSquare = function (callback, initialize) {
  for (var i = 0; i < rows; i++) {
    if (initialize) {
      board[i] = initialize(i);
    }
    for (var j = 0; j < columns; j++) {
      board[i][j] = callback(i, j);
    }
  }
};

var randomizeBoard = function (catsNeeded) {
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
}; 

var withinRange = function (value, length) {
  if (value >= 0 && value < length) {
    return true;
  } else {
    return false;
  }
};

var surroundingArea = function (x, y, callback, startsAtOne) {
  var count = 0;
  startsAtOne = startsAtOne ? 1 : 0;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      // countCenter = (i === 0 && j === 0);
      if (withinRange(x + i - startsAtOne, rows) && withinRange(y + j - startsAtOne, columns) && !(i === 0 && j === 0)) {
        count += callback(x + i, y + j);
      }
    }
  }
  return count;
};

var countCats = function (x, y) {
  if (board[x][y] === 'cat') {
    return 'cat';
  } else {
    return surroundingArea(x, y, function (i, j) {
      if (board[i][j] === 'cat') {
        return 1;
      } else {
        return 0;
      }
    });
  }
};

var blankAffect = function (x, y) {
  if (x <= rows && !findElementsFromCoordinates(x, y).hasClass('sink') && !findElementsFromCoordinates(x, y).hasClass('poop')) {
    safeCount--;
    findElementsFromCoordinates(x, y).addClass('sink').addClass('show');
    checkSquare(x, y);
  }
};

var checkSquare = function (x, y) {
  if (findElementsFromCoordinates(x, y).text() === 'cat') {
    return false;
  } else if (findElementsFromCoordinates(x, y).text()) {
    return true;
  } else {
    surroundingArea(x, y, blankAffect, true);
    return 1;
  }
};

var findElementsFromCoordinates = function(x, y) {
  var args = Array.from(arguments).slice(2);
  var notHave = ':not('

  for (var i = 0; i < args.length; i++) {
    if (i === 0) {
      notHave += args[i];
    } else {
      notHave += ', ' + args[i];
    }
  }
  notHave += ')';

  if (args.lenght === 0) {
    return $('.' + y + ' :nth-child(' + x + ')');
  } else {
    return $('.' + y + ' :nth-child(' + x + ')' + notHave);
  }
};

var placeGamePiece = function (x, y) {
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
      color = color;
  }

  if (board[x][y] !== 0) {
    findElementsFromCoordinates(x + 1, y + 1).text(board[x][y]).css('color', color);
  }
};

var initializeGame = function (restart) {
  //Initialize matrix on board of the game
  eachSquare(function () {
    return 0;
  }, function () {
    return [];
  });
  randomizeBoard(totalCats);
  eachSquare(countCats);
  eachSquare(placeGamePiece);

  $('.board').on('mousedown', function (event) {
    var currentSquare = event.target;
    var x = Number(currentSquare.classList[1]);
    var y = Number(currentSquare.parentElement.classList[1]);

    //Logic for left mouse click
    if (event.button === 0 && $(currentSquare).hasClass('square') && !$(currentSquare).hasClass('poop') && !$(currentSquare).hasClass('sink')) {
      if ($(currentSquare).text() === 'cat') {
        $(currentSquare).addClass('sink').addClass('poop');
        $('.board').off();
        $('.start').css('background-image', 'url(assets/images/fugCat.gif)');
        audio['meow'].play();
      } else {
        safeCount--;
        $(currentSquare).addClass('sink').addClass('show');
        $('.start').css('background-image', 'url(assets/images/eyesCat.gif)');
        checkSquare(x, y);
        if (safeCount === 0) {
          $('.square:not(.sink)').addClass('poop');
          $('.board').off();
          $('.start').css('background-image', 'url(assets/images/glassesCat.gif)');
          $('#container').append('<span class="win"><span>');
        } else {
          $(document).one('mouseup', function () {
            $('.start').css('background-image', 'url(assets/images/cat.png)');
          });
        }
      }
    }

    //Logic when both left and right mouse button are clicked
    if (event.button === 1 && $(currentSquare).hasClass('square')) {
      var flags = surroundingArea(x, y, function (i, j) {
        findElementsFromCoordinates(i, j, 'show', 'poop').addClass('sink');
        $(document).one('mouseup', function () {
          findElementsFromCoordinates(i, j, 'show', 'poop').removeClass('sink');
        });
        return $('.' + j + ' :nth-child(' + i + ').poop').length;
      }, true);

      console.log(findElementsFromCoordinates(x, y).filter('poop').length);
      if (flags == findElementsFromCoordinates(x, y)) {
        surroundingArea(x, y, function (i, j) {
          if (!findElementsFromCoordinates(i, j).hasClass('poop')) {
            if (findElementsFromCoordinates(i, j).text() === 'cat') {
              findElementsFromCoordinates(i, j).addClass('sink').addClass('poop');
              $('.board').off();
              $('.start').css('background-image', 'url(assets/images/fugCat.gif)');
              audio['meow'].play();
            } else {
              safeCount--;
              findElementsFromCoordinates(i, j).addClass('sink').addClass('show');
              $('.start').css('background-image', 'url(assets/images/eyesCat.gif)');
              checkSquare(x, y);
              if (safeCount === 0) {
                $('.square:not(.sink)').addClass('poop');
                $('.board').off('mousedown');
                $('.start').css('background-image', 'url(assets/images/glassesCat.gif)');
              } else {
                $(document).one('mouseup', function () {
                  $('.start').css('background-image', 'url(assets/images/cat.png)');
                });
              }
            }
          }
        }, true);
      }
    }

    //Logic for right mouse click
    if (event.button === 2 && $(currentSquare).hasClass('square') && !$(currentSquare).hasClass('sink')) {
      $(currentSquare).toggleClass('poop');
    }
  }); 
}

$(document).ready(function () {
  //Disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };

  initializeGame();

  //Restart game
  $('.start').mousedown(function (event) {
    board = [];
    safeCount = rows * columns - totalCats;
    $('.win').remove();
    $('.board').off();
    $('.start').css('background-image', 'url(assets/images/cat.png)').addClass('sink');
    $(document).one('mouseup', function (event) {
      $('.start').removeClass('sink');
    });
    $('.square').removeClass('show').removeClass('sink').removeClass('poop').text('');
    
    initializeGame();
  });
});