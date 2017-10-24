/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*global $ */

$(document).ready(function () {


	$.get("/api/games", function (data) {

		if (data.currentUserInfo != null) {

			createPage(data);


		} else {


			showLogPage();

		}
	});


	document.getElementById("login").addEventListener("click", getUserInfo);

	document.getElementById("logout").addEventListener("click", logout);

	document.getElementById("signin").addEventListener("click", signin);

})

function getUserInfo() {

	var user = document.getElementById("user").value;
	var pwd = document.getElementById("pwd").value;

	login(user, pwd);

	document.getElementById("user").value = "";
	document.getElementById("pwd").value = "";

}

function login(user, pwd) {

	$.post("/api/login", {
			username: user,
			password: pwd
		})
		.done(
			function () {
				console.log("logged in!");

				$.get("/api/games", function (data) {
					createPage(data);
				});


			}

		)
		.fail(function () {
			console.log("Fatal Error!")
			alert("Invalid User or Password! Check it and try again!");
		});

}

function logout() {

	$.post("/api/logout").done(function () {
		console.log("logged out");

		showLogPage();

	})

}

function signin() {

	var newUser = document.getElementById("user").value;
	var newPwd = document.getElementById("pwd").value;

	$.post("/api/players", {
			username: newUser,
			password: newPwd
		})
		.done(

			function (response) {
				console.log(response);
				login(newUser, newPwd);

			}
		)
		.fail(function (response) {
			console.log(response.responseText);
			alert("Your user registration fail! Check it and try again!");

		});


	document.getElementById("user").value = "";
	document.getElementById("pwd").value = "";

}

function createPage(data) {

	printCurrentUser(data);
	createWall(data);
	createGamesList(data);
	hideLogPage();

}

function showLogPage() {

	$(".spaceship").show();
	$(".pinkspaceship").show();
	$(".log").show();
	$(".welcome").show();
	$(".userInfo").hide();
	$("#logout").hide();
	$(".wall").hide();
	$(".fameTitle").hide();
	$(".playgame").hide();
	$(".games").hide();

}

function hideLogPage() {

	$(".spaceship").hide();
	$(".pinkspaceship").hide();
	$(".welcome").hide();
	$(".log").hide();
	$(".userInfo").show();
	$("#logout").show();
	$(".wall").show();
	$(".fameTitle").show();
	$(".playgame").show();
	$(".games").show();

}

function printCurrentUser(data) {

	var currentUser = data.currentUserInfo.currentUser.username;

	var userField = $(".user-name");

	userField.empty();

	userField.append(currentUser);

}

function createWall(data) {

	var leaderboard = data.leaderBoard;

	var fame = $(".fame");

	fame.empty();

	createHeads(fame, leaderboard);

}

function createHeads(fame, leaderboard) {

	var tHead = document.createElement("thead");
	var tr = document.createElement("tr");

	var titles = ["Player", "Score", "Wins", "Losses", "Draws"];

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

			case "Wins":
				cell.innerHTML = wins;
				break;

			case "Losses":
				cell.innerHTML = lost;
				break;

			case "Draws":
				cell.innerHTML = tied;
				break;

			case "Score":

				cell.innerHTML = total;
				break;

		}

		row.appendChild(cell);

	}

}

function createGamesList(data) {

	var gamesInfo = data.gamesInfo;

	var games = $(".gameList");

	games.empty();

	createGamesHeads(games, gamesInfo);

}

function createGamesHeads(games, gamesInfo) {

	var tHead = document.createElement("thead");
	var tr = document.createElement("tr");

	var titles = ["#", "Date", "Player 1", "Player 2", "Status"];

	for (var j = 0; j < titles.length; j++) {

		var th = document.createElement("th");

		th.innerHTML = titles[j];

		tr.appendChild(th);

	}

	createGamesRows(games, gamesInfo, titles);
	tHead.appendChild(tr);
	games.append(tHead);
}

function createGamesRows(games, gamesInfo, titles) {

	var tBody = document.createElement("tbody");

	for (var i = 0; i < gamesInfo.length; i++) {

		var eachGame = gamesInfo[i];

		var row = document.createElement("tr");
		row.setAttribute("class", "trow");

		createGamesCells(row, eachGame, titles);

		tBody.append(row);
	}

	games.append(tBody);

}

function createGamesCells(row, eachGame, titles) {

	var gameNumber = eachGame.gameId;

	var date = eachGame.gameDate;
	var gameDate = getDate(date);

	var players = eachGame.gamePlayers;
	var gamePlayers = getPlayers(players);

	var button = document.createElement("a");
	button.setAttribute("class", "gameButton");
	button.innerHTML = "PLAY";

	for (var k = 0; k < titles.length; k++) {

		var cell = document.createElement("td");
		cell.setAttribute("class", "tcell");

		switch (titles[k]) {

			case "#":
				cell.innerHTML = gameNumber;
				break;

			case "Date":
				cell.innerHTML = gameDate;
				break;

			case "Player 1":
				cell.innerHTML = gamePlayers[0];
				break;

			case "Player 2":
				cell.innerHTML = gamePlayers[1];
				break;

			case "Status":

				setGameLink(eachGame,button);
				cell.appendChild(button);
				break;

		}

		row.appendChild(cell);

	}

}

function setGameLink(eachGame,button) {
		
	var link = "game.html?gp="
	var gameId = eachGame.gamePlayers[0].gpId;
	
	var fullLink=link+gameId;
	
	button.setAttribute("href",fullLink);
	
}

function getPlayers(players) {

	var player1 = null;
	var player2 = null;

	for (var j = 0; j < players.length; j++) {


		player1 = players[0].player.username;

		if (players[1] == null) {

			player2 = "Waiting for player";

		} else {

			player2 = players[1].player.username;

		}
	}

	var bothPlayers = [player1, player2];
	return bothPlayers;

}

function getDate(date) {

	var d = new Date(date);

	var day = d.getDay();
	var month = d.getMonth();
	var year = d.getFullYear();
	var hour = d.getHours();
	var minutes = d.getMinutes();

	var fullDate = day + "-" + month + "-" + year + ", " + hour + ":" + minutes;

	return fullDate;
}
