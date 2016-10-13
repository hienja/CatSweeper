var board = [];
var rows = 9;
var columns = 9;
var totalCats = 10;
var catsLocation = {};
var safeCount = rows * columns - totalCats;
var timer = true;
var time;
var count = 0;
var audio = {};
audio['meow1'] = new Audio();
audio['meow1'].src = "assets/audio/Cat-meow-mp3.mp3";
audio['meow1'].volume = 0.2;

audio['meow2'] = new Audio();
audio['meow2'].src = "assets/audio/Cat-meow-6.mp3";
audio['meow2'].volume = 1.0;

audio['meow3'] = new Audio();
audio['meow3'].src = "assets/audio/Cat-meow-8.mp3";
audio['meow3'].volume = 1.0;

var eachSquare = function (board, callback, initialize) {
  for (var i = 0; i < rows; i++) {
    if (initialize) {
      board[i] = initialize(i);
    }
    for (var j = 0; j < columns; j++) {
      board[i][j] = callback(board, i, j);
    }
  }

  return board;
};

var randomizeBoard = function (board, catsNeeded) {
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

  return board;
};

var aroundEachCat = function (board, catsLocation, callback) {
  for (var row in catsLocation) {
    var column = catsLocation[row];
    row = Number(row);

    for (var i = 0; i < column.length; i++) {
      surroundingArea(board, Number(row), column[i], callback);
    }
  }

  return board;
};

var catCount = function (board, x, y) {
  if (board[x][y] !== 'cat') {
    board[x][y]++;
  }
};

var withinRange = function (value, length) {
  if (value >= 0 && value < length) {
    return true;
  } else {
    return false;
  }
};

var surroundingArea = function (board, x, y, callback, startsAtOne) {
  var count = 0;
  startsAtOne = startsAtOne ? 1 : 0;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      // countCenter = (i === 0 && j === 0);
      if (withinRange(x + i - startsAtOne, rows) && withinRange(y + j - startsAtOne, columns) /*&& !(i === 0 && j === 0)*/) {
        count += callback(board, x + i, y + j);
      }
    }
  }

  return count;
};

var blankAffect = function (board, x, y) {
  if (x <= rows && !findElementsFromCoordinates(board, x, y).hasClass('sink') && !findElementsFromCoordinates(board, x, y).hasClass('mark')) {
    safeCount--;
    findElementsFromCoordinates(board, x, y).addClass('sink show');
    checkSquare(board, x, y);
  }
};

var checkSquare = function (board, x, y) {
  if (board[x - 1][y - 1] === 'cat') {
    return false;
  } else if (board[x - 1][y - 1]) {
    return true;
  } else {
    surroundingArea(board, x, y, blankAffect, true);
    return 1;
  }
};

var findElementsFromCoordinates = function(board, x, y) {
  var args = Array.from(arguments).slice(3);
  var notHave = ':not('

  for (var i = 0; i < args.length; i++) {
    if (i === 0) {
      notHave += '.' + args[i];
    } else {
      notHave += ', ' + '.' + args[i];
    }
  }
  notHave += ')';

  if (args.length === 0) {
    return $('.' + y + ' :nth-child(' + x + ')');
  } else {
    return $('.' + y + ' :nth-child(' + x + ')' + notHave);
  }
};

var placeGamePiece = function (board, x, y) {
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
    findElementsFromCoordinates(board, x + 1, y + 1).text(board[x][y]).css('color', color);
  }

  return board[x][y];
};

var randomMeow = function () {
  var number = Math.floor(Math.random() * 3) + 1;
  var meow = 'meow' + number;
  audio[meow].play();
}

var initializeGame = function (board, catsLocation) {
  //Initialize matrix on board of the game
  board = eachSquare(board, function () {
    return 0;
  }, function () {
    return [];
  });
  board = randomizeBoard(board, totalCats);
  board = aroundEachCat(board, catsLocation, catCount);
  board = eachSquare(board, placeGamePiece);

  $('.board').on('mousedown', function (event) {
    var currentSquare = event.target;
    var currentValue = currentSquare.innerHTML;
    var x = Number(currentSquare.classList[1]);
    var y = Number(currentSquare.parentElement.classList[1]);

    //Logic for left mouse click
    if (event.button === 0 && $(currentSquare).hasClass('square') && !$(currentSquare).hasClass('mark') && !$(currentSquare).hasClass('sink')) {
      if (timer) {
        timer = false;
        time = setInterval(function() {
          count++
          if (count < 10) {
            var stringCount = '00' + count;
          } else if (count < 100){
            var stringCount = '0' + count
          } else {
            var stringCount = count;
          }
          $('.timer').text(stringCount);          
        }, 1000);
      }
      //When you lose
      if (currentValue === 'cat') {
        clearInterval(time);
        $(currentSquare).addClass('sink lose');
        $('.board').off();
        $('.start').css('background-image', 'url(assets/images/fugCat.gif)');
      } else {
        safeCount--;
        randomMeow();
        $(currentSquare).addClass('sink show');
        $('.start').css('background-image', 'url(assets/images/eyesCat.gif)');
        checkSquare(board, x, y);
        //When you win
        if (safeCount === 0) {
          clearInterval(time);
          $('.remainder').text('000');
          $('.square:not(.sink)').addClass('mark');
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

    //Logic when both left and right mouse buttons are clicked
    if (event.button === 1 && $(currentSquare).hasClass('square')) {
      var foundCat = false;
      var marks = surroundingArea(board, x, y, function (board, i, j) {
        if (!findElementsFromCoordinates(board, i, j).hasClass('mark')) {
          findElementsFromCoordinates(board, i, j).addClass('sink');
          $(document).one('mouseup', function () {
            if(!findElementsFromCoordinates(board, i, j).hasClass('show')) {
              findElementsFromCoordinates(board, i, j).removeClass('sink');
            }
          });
        }
        return findElementsFromCoordinates(board, i, j).hasClass('mark') ? 1 : 0;
      }, true);

      if (marks == currentValue && currentValue != 0) {
        randomMeow();
        surroundingArea(board, x, y, function (board, i, j) {
          var value = findElementsFromCoordinates(board, i, j).text();
          if (!findElementsFromCoordinates(board, i, j).hasClass('mark')) {
            if (value === 'cat') {
              foundCat = true;
              findElementsFromCoordinates(board, i, j).addClass('sink mark');
            } else {
              if (!findElementsFromCoordinates(board, i, j).hasClass('show')) {
                safeCount--;
              }
              findElementsFromCoordinates(board, i, j).addClass('sink show');
              $('.start').css('background-image', 'url(assets/images/eyesCat.gif)');
              checkSquare(board, i, j);
              //When you win
              if (safeCount === 0) {
                clearInterval(time);
                $('.remainder').text('000');
                $('.square:not(.sink)').addClass('mark');
                $('.board').off();
                $(document).off('mouseup');
                $('.start').css('background-image', 'url(assets/images/glassesCat.gif)');
                $('#container').append('<span class="win"><span>');
              } else {
                $(document).one('mouseup', function () {
                  $('.start').css('background-image', 'url(assets/images/cat.png)');
                });
              }
            }
          }
        }, true);
      }
      //When you lose
      if (foundCat) {
        surroundingArea(board, x, y, function (board, i, j){
          var value = findElementsFromCoordinates(board, i, j).text();
          if (findElementsFromCoordinates(board, i, j).hasClass('mark')) {
            if (value !== 'cat') {
              findElementsFromCoordinates(board, i, j).removeClass('mark').addClass('wrong');
            } 
          }
        }, true);
        clearInterval(time);
        $('.board').off();
        $(document).off('mouseup');
        $('.start').css('background-image', 'url(assets/images/fugCat.gif)');
      }
    }

    //Logic for right mouse click
    if (event.button === 2 && $(currentSquare).hasClass('square') && !$(currentSquare).hasClass('sink')) {
      var marksLeft = 10;
      $(currentSquare).toggleClass('mark');
      marksLeft = marksLeft - $('.mark').length;
      if ($('.mark').length === 0) {
        marksLeft = '010';
      } else if (marksLeft >= 0) {
        marksLeft = '00'  + marksLeft;
      }
      $('.remainder').text(marksLeft);
    }
  }); 
};

$(document).ready(function () {
  //Disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };

  initializeGame(board, catsLocation);

  //Restart game
  $('.start').mousedown(function (event) {
    board = [];
    catsLocation = {};
    safeCount = rows * columns - totalCats;
    timer = true;
    count = 0;
    clearInterval(time);
    $('.timer').text('000');
    $('.remainder').text('0' + totalCats);
    $('.win').remove();
    $('.board').off();
    $('.start').css('background-image', 'url(assets/images/cat.png)').addClass('sink');
    $(document).one('mouseup', function (event) {
      $('.start').removeClass('sink');
    });
    $('.square').removeClass('show sink mark wrong lose').text('');

    initializeGame(board, catsLocation);
  });
});