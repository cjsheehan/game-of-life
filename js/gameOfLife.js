function drawGrid(grid) {
    var rowSize = grid.length;
    console.log("rowSize=" + rowSize);
    var points = '';
    for(i = rowSize - 1; i >= 0; i--) {
        for(j = 0; j < rowSize; j++) {          
            points += "<div id=\"pt"  + i + j + "\">" + i + ',' + j + "</div>";
            console.log(i + ',' + j);
        }
    }
    $('#grid').append(points); 
}

/* function drawGrid(grid) {
    var rowSize = grid.length;
    for(i = 0; i < rowSize; i++) {
        var row = "<div class=\"row\">";
        var columnSize = grid[i].length;
        for(j = 0; j < columnSize; j++) {          
            var point = "<div class=\"point\">" + i + ',' + j + "</div>";
            row += point;
        }
        row += "</div>";
        $('#grid').append(row); 
    }
}
 */