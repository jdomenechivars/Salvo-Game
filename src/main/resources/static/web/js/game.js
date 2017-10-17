$(document).ready(function () {

	var sea = $(".sea");
	var salvoSea = $(".salvoSea");

	createGrid(sea);
	createGrid(salvoSea);

	$.get("/api/game_view/" + getParameterByName("gp"), function (data) {

		getPlayers(data);
		getShips(data);
		getSalvoes(data);

	});

})

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getPlayers(data) {

	var gpId = getParameterByName("gp");

	var player1 = null;
	var player2 = null;

	for (var f = 0; f < data.gamePlayers.length; f++) {

		if (data.gamePlayers[f].gpId == gpId) {

			player1 = data.gamePlayers[f].player.email;

		} else {

			player2 = data.gamePlayers[f].player.email;

		}


	}

	printPlayers(player1, player2)
}

function printPlayers(player1, player2) {

	//player 2 null //

	var players = $(".players");

	var p1 = document.createElement("p");
	p1.setAttribute("class", "p1");
	p1.innerHTML = "- " + player1;

	var p2 = document.createElement("p");
	p2.setAttribute("class", "p2");

	p2.innerHTML = player2 + " -";

	var vs = document.createElement("p");
	vs.setAttribute("class", "vs");
	vs.innerHTML = " VS ";

	players.append(p1);
	players.append(vs);
	players.append(p2);

}

function createGrid(grid) {

	var ABC = ["0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

	for (var i = 0; i < ABC.length; i++) {

		var content = ABC[i];
		var row = document.createElement("div");
		row.setAttribute("class", "row");

		createCell(row, content, grid);
		grid.append(row);

	}

}

function createCell(row, content, grid) {

	for (var j = 0; j < 11; j++) {

		var cellName = content + j;
		var sCellName = cellName + "s";


		var cell = document.createElement("div");

		if (grid[0].className == "salvoSea") {

			cell.setAttribute("id", sCellName);

		} else {

			cell.setAttribute("id", cellName);

		}

		cell.setAttribute("class", "cell");


		if (content == 0) {

			if (j == 0) {

				cell.innerHTML = "";

			} else {

				cell.innerHTML = j;

			}

		} else {

			if (j == 0) {

				cell.innerHTML = content;

			} else {

				cell.innerHTML = "";

				cell.setAttribute("title", cellName);

			}
		}

		row.appendChild(cell);

	}
}

function getShips(data) {

	var ships = data.ships;

	for (var x = 0; x < ships.length; x++) {

		var shipType = ships[x].type;

		var shipLocation = ships[x].locations;

		printShips(shipType, shipLocation);

	}
}

function printShips(shipType, shipLocation) {

	for (var y = 0; y < shipLocation.length; y++) {

		var cellLocation = shipLocation[y];

		var gridLocation = document.getElementById(cellLocation);

		//		gridLocation.setAttribute("class", "cell ship");
		gridLocation.classList.add("ship");

	}

}

function getSalvoes(data) {

	//	console.log(data);	

	var salvoes = data.salvoes;

	var gpId = getParameterByName("gp");

	var salvoesP1 = null;
	var salvoesP2 = null;

	for (var k = 0; k < salvoes.length; k++) {

		if (data.gamePlayers[k].gpId == gpId) {

			salvoesP1 = salvoes[k];

		} else {

			salvoesP2 = salvoes[k];

		}

	}

	printMySalvoes(salvoesP1);
	printEnemySavloes(salvoesP2);

}

function printMySalvoes(salvoes) {

	for (var t = 0; t < salvoes.length; t++) {

		var turn = salvoes[t].turn;

		var myLocations = salvoes[t].salvoLocations;

		for (var u = 0; u < myLocations.length; u++) {

			var bomb = myLocations[u] + "s";

			var bombLocation = document.getElementById(bomb);

			bombLocation.classList.add("aqua");

		}

	}

}

function printEnemySavloes(salvoes) {

	for (var t = 0; t < salvoes.length; t++) {

		var turn = salvoes[t].turn;

		var myLocations = salvoes[t].salvoLocations;

		for (var u = 0; u < myLocations.length; u++) {

			var bomb = myLocations[u];

			var bombLocation = document.getElementById(bomb);

			if (bombLocation.classList == "cell") {

				bombLocation.classList.add("aqua");
			}else if(bombLocation.classList == "cell ship") {

				bombLocation.classList.remove("ship");
				bombLocation.classList.add("bomb");
			}
		}

	}

}
