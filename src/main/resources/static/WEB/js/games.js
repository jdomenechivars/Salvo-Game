/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*global $ */

$(document).ready(function () {
	$.get("/api/games", function (data) {

		createList(data);

		createWall(data);

	});

})

function createList(data) {

	gamesInfo = data.gamesInfo;

	var games = $(".games");

	for (var i = 0; i < gamesInfo.length; i++) {

		var date = gamesInfo[i].gameDate;

		var players = gamesInfo[i].gamePlayers;


		var list = document.createElement("li");
		list.setAttribute("class", "list");
		list.innerHTML = getDate(date) + ", " +

			getPlayers(players);

		games.append(list);

	}

}

function getPlayers(players) {

	var player1 = null;
	var player2 = null;

	for (var j = 0; j < players.length; j++) {

		player1 = players[0].player.email;

		if (players[1] == null) {

			player2 = "Waiting for player";

		} else {

			player2 = players[1].player.email;

		}
	}

	var bothPlayers = player1 + " - VS - " + player2;
	return bothPlayers;


}

function createWall(data) {

	var leaderboard = data.leaderBoard;

	var fame = $(".fame");

	createHeads(fame, leaderboard);

}


function createHeads(fame, leaderboard) {

	var tHead = document.createElement("thead");
	var tr = document.createElement("tr");

	var titles = ["Player", "Score", "Win", "Lost", "Tied"];

	for (var j = 0; j < titles.length; j++) {

		var th = document.createElement("th");

		th.innerHTML = titles[j];

		tr.appendChild(th);

	}

	tHead.appendChild(tr);
	fame.append(tHead);
	createRows(fame, leaderboard, titles);

}

function createRows(fame, leaderboard, titles) {

	var tBody = document.createElement("tbody");
	
    console.log(leaderboard);
	
	
	for (var i = 0; i < leaderboard.length; i++) {

		var row = document.createElement("tr");
		row.setAttribute("class", "trow");

		var eachLeader = leaderboard[i];

		createLeaderInfo(row, eachLeader, titles);

		tBody.appendChild(row);

	}

	fame.append(tBody);

}

function createLeaderInfo(row, eachLeader, titles) {
	
	var player = eachLeader.playerName;
	var wins = eachLeader.scores.win;
	var lost = eachLeader.scores.lost;
	var tied = eachLeader.scores.tied;
		
	for (var k = 0; k < titles.length; k++) {

		var cell = document.createElement("td");
		cell.setAttribute("class", "tcell");

		
		
		switch(titles[k]){
				
			case "Player":
				cell.innerHTML = player;
				break;
			
			case "Win":
				cell.innerHTML = wins;
				break;
				
			case "Lost":
				cell.innerHTML = lost;
				break;
			
			case "Tied":
				cell.innerHTML = tied;
				break;
				
			case "Score":
				
				var totalScore = wins + (lost*0) + (tied*0.5);
				
				cell.innerHTML = totalScore;
				break;
				
		
				
		}
		
		
		row.appendChild(cell);

	}

	

}

function compare(a, b) {

  if (parseFloat(a.scores.win) < parseFloat(b.scores.win))
    return -1;
  if (parseFloat(a.scores.win) > parseFloat(b.scores.win))
    return 1;
  return 0;
}

function getDate(date) {
	var d = new Date(date);
	return d;
}
