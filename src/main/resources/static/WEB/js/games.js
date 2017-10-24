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
	createList(data);
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

function createList(data) {

	gamesInfo = data.gamesInfo;

	var games = $(".games");

	games.empty();

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

		player1 = players[0].player.username;

		if (players[1] == null) {

			player2 = "Waiting for player";

		} else {

			player2 = players[1].player.username;

		}
	}

	var bothPlayers = player1 + " - VS - " + player2;
	return bothPlayers;


}

function getDate(date) {
	var d = new Date(date);
	return d;
}
