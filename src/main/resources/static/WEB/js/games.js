/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*global $ */

$(document).ready(function () {
	$.get("/api/games", function (data) {

		createList(data);

		createWall(data);

	});

	document.getElementById("login").addEventListener("click", getUserInfo);
	
	document.getElementById("logout").addEventListener("click",logout);

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

	leaderboard = addTotal(leaderboard);

	leaderboard.sort(function (a, b) {
		return parseFloat(b.total) - parseFloat(a.total);
	});

	for (var i = 0; i < 5; i++) {

		var row = document.createElement("tr");
		row.setAttribute("class", "trow");

		var eachLeader = leaderboard[i];

		createLeaderInfo(row, eachLeader, titles);

		tBody.appendChild(row);
		//			compare(leaderboard);

	}

	fame.append(tBody);

}

function addTotal(leaderboard) {

	for (var i = 0; i < leaderboard.length; i++) {

		var eachLeader = leaderboard[i];

		var wins = eachLeader.win;
		var tied = eachLeader.tied;

		leaderboard[i].total = wins + (tied * 0.5);

	}

	return leaderboard;

}

function createLeaderInfo(row, eachLeader, titles) {

	var player = eachLeader.playerName;
	var wins = eachLeader.win;
	var lost = eachLeader.lost;
	var tied = eachLeader.tied;
	var total = eachLeader.total;

	for (var k = 0; k < titles.length; k++) {

		var cell = document.createElement("td");
		cell.setAttribute("class", "tcell");

		switch (titles[k]) {

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

				cell.innerHTML = total;
				break;

		}

		row.appendChild(cell);

	}

}

function getDate(date) {
	var d = new Date(date);
	return d;
}


function getUserInfo() {
	
	var user = document.getElementById("user").value;
	var pwd = document.getElementById("pwd").value;
	
	console.log(user);
	console.log(pwd);
	
	$.post("/api/login", 
         { username: user,
           password: pwd}).done(function() { console.log("logged in!");});

	document.getElementById("user").value = "";
	document.getElementById("pwd").value = "";



}

function logout(){
	
	$.post("/api/logout").done(function() { console.log("logged out"); })


}