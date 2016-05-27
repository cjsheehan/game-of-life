
var gol = (function() {
    var grid = [];
    
    var initGame = function(gridSize) {
        grid = randGrid(gridSize);
        console.log(grid);
        golDraw.drawGrid(grid);
    };  

    var randGrid = function(gridSize) {
        var grid = [];
        for(i = 0; i < gridSize; i++) {
            var row = [];
            for(j = 0; j < gridSize; j++) {  
                row[j] = randInt(0,1);
            }
            grid.push(row);
        }
        return grid;
    };  

    var randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }    
    
    return {
        initGame: initGame
    }    
    
})();

var golDraw = (function() {
    var ptWidth = 100;
    var gridWidth = 100;
    var gridHeight = 100;
    
    var drawGrid = function(grid) {
        var rowSize = grid.length;
        console.log("rowSize=" + rowSize);
        var points = '';
        var on = "on";
        var off = "off";
        var ptState = on;

        initGridDimensions(rowSize);
        for(i = rowSize - 1; i >= 0; i--) {
            for(j = 0; j < rowSize; j++) { 
                // console.log(i + ':' + j + ':' + grid[i][j]);
                if(grid[i][j] === 0) {
                    ptState = off;
                } else {
                    ptState = on;
                }
                points += "<div id=\"pt"  + i + j + "\" " + "class=\"point " 
                    + ptState + "\">" + i + ',' + j + "</div>";
            }
        }
        $('#grid').append(points); 
    };
    
    
    var initGridDimensions = function(size) {
        gridWidth = ptWidth * size;
        gridHeight = gridWidth;
        $('#grid').css("width", gridWidth);
        $('#grid').css("height", gridHeight);
    };
    
    return {
        drawGrid: drawGrid
    } 
    
})();

