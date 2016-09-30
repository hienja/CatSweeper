$(document).ready(function(){
  //disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };

  $('.body').mousedown(function(event){ 
    console.log(event);
    if (event.button === 2 && event.target.classList.contains('square') && !event.target.classList.contains('sink')) {
      event.target.classList.toggle('poop');
    }
    if (event.button === 0 && event.target.classList.contains('square') && !event.target.classList.contains('poop')) {
      event.target.classList.add('sink');
    }
  }); 
});