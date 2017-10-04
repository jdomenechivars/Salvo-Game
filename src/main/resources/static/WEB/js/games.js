$(document).ready(function () {
    $.get("/api/games", function (data) {
        createList(data);
    });

})

function createList(data) {

    var games = $(".games");

    for (var i = 0; i < data.length; i++) {

        var date = data[i].date;
        
        var players = data[i].gamePlayers;

        var list = document.createElement("li");
        list.setAttribute("class", "list");
        list.innerHTML = getDate(date) + ", " + getPlayers(players);

        games.append(list);

    }
    
}

function getPlayers(players){
    
    for (var j = 0; j < players.length; j++){
        
        var player1 = players[0].player.email;
        var player2 = players[1].player.email;
        
    }
    
    var bothPlayers = player1 + ", " + player2;
    return bothPlayers;
    
    
}

function getDate(date) {
    var d = new Date(date);
    return d;
}
