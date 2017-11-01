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
	document.getElementById("createGame").addEventListener("click", createNewGame);

	$(document).on("click", ".play", function () {

		var GPId = this.getAttribute("data-gp");

		playGame(GPId);

	});

	$(document).on("click", ".join", function () {

		var gameId = this.getAttribute("data-game");

		joinGame(gameId);

	});

});

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
	$("#createGame").hide();

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
	$("#createGame").show();

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


	var games = $(".gameList");

	games.empty();

	createGamesHeads(games, data);

}

function createGamesHeads(games, data) {

	var tHead = document.createElement("thead");
	var tr = document.createElement("tr");

	var titles = ["#", "Date", "Player 1", "Player 2", "Status"];

	for (var j = 0; j < titles.length; j++) {

		var th = document.createElement("th");

		th.innerHTML = titles[j];

		tr.appendChild(th);

	}

	createGamesRows(games, data, titles);
	tHead.appendChild(tr);
	games.append(tHead);
}

function createGamesRows(games, data, titles) {

	var gamesInfo = data.gamesInfo;

	var tBody = document.createElement("tbody");

	for (var i = 0; i < gamesInfo.length; i++) {

		var eachGame = gamesInfo[i];

		var row = document.createElement("tr");
		row.setAttribute("class", "trow");

		createGamesCells(row, eachGame, titles, data);

		tBody.append(row);
	}

	games.append(tBody);

}

function createGamesCells(row, eachGame, titles, data) {

	var gameNumber = eachGame.gameId;

	var date = eachGame.gameDate;
	var gameDate = getDate(date);

	var players = eachGame.gamePlayers;
	var gamePlayers = getPlayersName(players);

	for (var k = 0; k < titles.length; k++) {

		var cell = document.createElement("td");
		cell.setAttribute("class", "tcell");

		switch (titles[k]) {

			case "#":
				cell.innerHTML = gameNumber;
				cell.setAttribute("data-gameNumber", gameNumber);
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

				createButtons(eachGame, data, cell);
				break;

		}

		row.appendChild(cell);

	}

}

function createButtons(eachGame, data, cell) {

	var gameId = eachGame.gameId;

	var button = document.createElement("button");
	button.setAttribute("class", "gameButton");

	var currentUserId = data.currentUserInfo.currentUser.playerId;

	var player1 = eachGame.gamePlayers[0];
	var player1id = player1.player.playerId;
	var player1GpId = player1.gpId;

	var player2 = eachGame.gamePlayers[1];
	var player2id = null;
	var player2GpId = null;

	if (player2 != null) {

		player2id = player2.player.playerId;
		player2GpId = player2.gpId;
	}

	if (eachGame.gamePlayers.length == 2) {

		if (currentUserId == player1id) {

			button.innerHTML = "PLAY";
			button.setAttribute("data-game", gameId);
			button.setAttribute("data-GP", player1GpId)
			button.classList.add("play");
			button.classList.remove("join");
			cell.appendChild(button);

		} else if (currentUserId == player2id) {

			button.innerHTML = "PLAY";
			button.setAttribute("data-game", gameId);
			button.setAttribute("data-GP", player2GpId)
			button.classList.add("play");
			button.classList.remove("join");
			cell.appendChild(button);
		}

	} else {

		if (player2 == null && player1id == currentUserId) {

			button.innerHTML = "PLAY";
			button.setAttribute("data-game", gameId);
			button.setAttribute("data-GP", player1GpId);
			button.classList.add("play");
			button.classList.remove("join");
			cell.appendChild(button);

		} else {

			button.innerHTML = "JOIN";
			button.setAttribute("data-game", gameId);
			button.classList.remove("play");
			button.classList.add("join");
			cell.appendChild(button);
		}

	}

}

function getPlayersName(players) {

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

function createNewGame() {

	$.post("/api/games", {})
		.done(

			function (response) {
				console.log(response);

				var gameId = response.gpId;
				console.log(gameId);
				location.href = "game.html?gp=" + gameId;

			}
		)
		.fail(function (response) {
			console.log(response.responseText);
			alert("ERROR");

		});

}

function playGame(GPId) {

	location.href = "/web/game.html?gp=" + GPId;
}

function joinGame(gameId) {

	$.post("/api/game/"+gameId+"/players", {})
		.done(

			function (response) {

				console.log(response);

				var gpId = response.gpId;
				console.log(gameId);
				location.href = "game.html?gp=" + gpId;

			})
		.fail(function (response) {
			console.log(response.responseText);
			alert("ERROR");

		});

}

function getDate(date) {

	var d = new Date(date);

	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var hour = d.getHours();
	var minutes = d.getMinutes();

	var fullDate = day + "-" + month + "-" + year + ", " + hour + ":" + minutes;

	return fullDate;
}
