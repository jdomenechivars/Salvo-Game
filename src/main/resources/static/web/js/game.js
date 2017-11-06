/*eslint-env browser*/
/*eslint "no-console": "off"*/
/*global $ */

$(document).ready(function () {

	var sea = $(".sea");
	var salvoSea = $(".salvoSea");

	createGrid(sea);
	createGrid(salvoSea);

	$.get("/api/game_view/" + getParameterByName("gp"), function (data) {

		getPlayers(data);
		getShips(data);
		getSalvoes(data);

	}).fail(function () {
		alert("UNAUTHORIZED USER!");
		location.href = "index.html";
	});

	//The eventListener below run the hover when you select a ship from the ships fleet board:
	$(document).on("click", ".shipsTable", function () {


		if ($(this).hasClass("blink")) {

			$(this).removeClass("blink");

			$(".cell").unbind('mouseenter mouseleave')


		} else {

			$(".shipsTable").removeClass("blink");
			$(".cell").unbind('mouseenter mouseleave');

			$(this).addClass("blink");

			var shipSize = this.getAttribute("data-size");

			$(".cell").hover(

				function () {

					var mouseLocation = this.getAttribute("id");

					hoverShip(shipSize, mouseLocation);

				});
		}
	});

	//Next eventListener set the Ships when click on a cell
	$(document).on("click", ".cell", function () {

		var mouseLocation = this.getAttribute("id");
		var shipSize = "";
		var shipType = "";

		$(".shipsTable").each(function (i, ele) {

			if ($(ele).hasClass("blink")) {

				shipSize = ele.getAttribute("data-size");
				shipType = ele.getAttribute("data-type");

				$(ele).removeClass("blink");
				$(ele).prev(".shipsTitle").hide();
				$(ele).hide();
				$(".cell").unbind('mouseenter mouseleave');
				setShip(shipSize, mouseLocation, shipType);

			};
		});

	});

	//Next eventListener set firing Salvos
	$(document).on("click", ".scell", function () {

		if (this.classList.contains("aqua")) {

			alert("Fired yet!");

		} else {

			var mouseLocation = this.getAttribute("id");


			buildSalvo(mouseLocation);

		}

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

			player1 = data.gamePlayers[f].player.username;

		} else {

			player2 = data.gamePlayers[f].player.username;

		}


	}

	printPlayers(player1, player2)
}

function printPlayers(player1, player2) {

	//player 2 null //

	if (player2 == null) {

		player2 = "Waiting for player";
	}

	var players = $(".players");

	var p1 = document.createElement("p");
	p1.setAttribute("class", "p1");
	p1.innerHTML = "- " + player1;

	var p2 = document.createElement("p");
	p2.setAttribute("class", "p2");

	if (player2 == "Waiting for player") {

		p2.classList.add("blink");

	}

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
		var row = document.createElement("tr");
		row.setAttribute("class", "row");

		createCell(row, content, grid);
		grid.append(row);

	}



}

function createCell(row, content, grid) {

	for (var j = 0; j < 11; j++) {

		var cellName = content + j;
		var sCellName = cellName + "s";


		var cell = document.createElement("td");

		if (grid[0].className == "salvoSea") {

			cell.setAttribute("id", sCellName);

		} else {

			cell.setAttribute("id", cellName);

		}

		//		cell.setAttribute("class", "cell");

		if (content == 0) {

			if (j == 0) {

				cell.innerHTML = "";
				cell.setAttribute("class", "tcell");

			} else {

				cell.innerHTML = j;
				cell.setAttribute("class", "tcell");

			}

		} else {

			if (j == 0) {

				cell.innerHTML = content;
				cell.setAttribute("class", "tcell");


			} else {

				cell.innerHTML = "";
				cell.setAttribute("title", cellName);

				if (grid[0].className == "salvoSea") {

					cell.setAttribute("class", "scell");

				} else {
					cell.setAttribute("class", "cell");

				}

			}
		}

		row.appendChild(cell);

	}

}

function getShips(data) {

	var ships = data.ships;

	console.log(ships);

	if (ships.length < 5) {

		$(".fleet").show();
	}

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

	if (salvoes.length > 1) {

		for (var k = 0; k < salvoes.length; k++) {

			//chequeo si salvo [k] tiene size o no.
			if (salvoes[k][0].gpId == gpId) {

				salvoesP1 = salvoes[k];


			} else {

				salvoesP2 = salvoes[k];

			}

		}

		printMySalvoes(salvoesP1);
		printEnemySavloes(salvoesP2);
	}
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
			} else if (bombLocation.classList == "cell ship") {

				bombLocation.classList.remove("ship");
				bombLocation.classList.add("bomb");
			}
		}

	}

}

function hoverShip(shipSize, mouseLocation) {

	var letter = mouseLocation.charAt(0);
	var number = parseFloat(mouseLocation.substr(1));

	var totalPosition = (parseFloat(shipSize) + parseFloat(number));

	for (var i = 0; i < shipSize; i++) {

		var increaseCellNumber = number + i;
		var nextCells = letter + increaseCellNumber;

		var hoverCells = $("#" + nextCells);

		if (totalPosition > 11 || hoverCells.hasClass("ship")) {

			hoverCells.toggleClass("red-ship");
			hoverCells.click(false);

		} else {

			hoverCells.toggleClass("black-ship");

		}
	}
}

function setShip(shipSize, mouseLocation, shipType) {

	var shipLocation = [];

	var letter = mouseLocation.charAt(0);
	var number = parseFloat(mouseLocation.substr(1));

	var totalPosition = (parseFloat(shipSize) + parseFloat(number));

	for (var i = 0; i < shipSize; i++) {

		var increaseCellNumber = number + i;
		var nextCells = letter + increaseCellNumber;

		var selectedCells = $("#" + nextCells);

		if (totalPosition < 11 || selectedCells.not(".ship")) {

			selectedCells.addClass("ship");
			selectedCells.removeClass("black-ship");
			selectedCells.removeClass("red-ship");
			shipLocation.push(nextCells);

		}

	}

	if (shipLocation.length > 0) {
		buildShip(shipType, shipLocation);
	}
}

function buildShip(type, locations) {

	var ship = new Object;

	ship["type"] = type;
	ship["locations"] = locations;

	createShipsFleet(ship);
}

function createShipsFleet(ship) {

	if (createShipsFleet.ships == undefined) {
		createShipsFleet.ships = [];
	}

	createShipsFleet.ships.push(ship);

	console.log(createShipsFleet.ships);

	if (createShipsFleet.ships.length == 5) {

		$(".fleet").hide();
		placeShips(createShipsFleet.ships);
	}

}

function placeShips(ships) {

	$.ajax({
			method: "POST",
			url: "/api/games/players/" + getParameterByName("gp") + "/ships",
			contentType: "application/json",
			data: JSON.stringify(ships)
		}).done(

			function (response) {

				console.log(response);

			})
		.fail(function (response) {
			console.log(response.responseText);
			alert("ERROR");

		});


}

function buildSalvo(mouseLocation) {

	console.log(mouseLocation);

	if (buildSalvo.salvos == undefined) {
		buildSalvo.salvos = [];
	}

	var salvo = "#" + mouseLocation;
	$(salvo).addClass("fire");


	if (buildSalvo.salvos.length == 4) {
		$(".scell").click(false);
		removeFires();
	} else {

		buildSalvo.salvos.push(salvo);
		console.log(buildSalvo.salvos);
	}
}

function removeFires(){
	
	$(document).on("click",".fire",function(){
		
		console.log(this.getAttribute("id"));
		
	});
	
}