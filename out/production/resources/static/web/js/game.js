createGrid();

function createGrid() {

  var sea = $("sea");

  var ABC = ["A", "B", "C", "D", "F", "G", "H", "I", "J"]


  for (var i = 0; i <= ABC.length; i++) {

    var row = document.createElement("div");
    var content = ABC[i];
    row.innerHTML = content;
    sea.append(row);

  }


}
