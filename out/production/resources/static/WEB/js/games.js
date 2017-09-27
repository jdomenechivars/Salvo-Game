$(document).ready(function(){
  $.get("/api/games",function(data){
    createList(data);
  });

})

  function createList(data){

    var games = $(".games");

    for(var i = 0; i < data.length; i++){

      var date = data[i].date;

      var list = document.createElement("li");
      list.setAttribute("class", "list");
      list.innerHTML = date;

      games.append(list);



    }

  }
