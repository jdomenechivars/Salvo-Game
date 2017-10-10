$(document).ready(function () {

  createGrid();

  $.get("/api/game_view/" + getParameterByName("gp"), function (data) {

    getShips(data);

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

function createGrid() {

  var sea = $(".sea");

  var ABC = ["0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  for (var i = 0; i < ABC.length; i++) {

    var content = ABC[i];
    var row = document.createElement("div");
    row.setAttribute("class", "row");

    createCell(row, content);
    sea.append(row);

  }

}

function createCell(row, content) {

  for (var j = 0; j < 11; j++) {

    var cellName = content + j;

    var cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("id", cellName);

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

    gridLocation.setAttribute("class", "cell ship");

  }

}
