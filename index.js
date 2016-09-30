$(document).ready(function(){
  //disable right click context menu
  document.oncontextmenu = function () {
    return false;
  };

  $('.body').mousedown(function(e){ 
      console.log(e.button)  
  }); 
});