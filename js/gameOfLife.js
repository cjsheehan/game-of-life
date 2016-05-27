
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by over-population.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

var gol = (function() {
    const RunEnum = {
        RUN: 0,
        STOP: 1,
    }
    var grid = [];
    var isRunning = false;
    
    var gen = 0;
    var runControl;
    var runState = RunEnum.STOP;
    var maxGens = 10;
    var frameTime = 500; // ms
    var gridSize;
    
    var start = function(size) {
        if(!isRunning) {
            isRunning = true;
            gridSize = size;
            runState = RunEnum.RUN; 
            gen = 0;
            grid = seedGrid(gridSize);
            runControl = setInterval(function() { evolve(grid); }, frameTime);
        }
    };  
    
    var stop = function() {
        if(isRunning) {
            clearTimeout(runControl);
            runState = RunEnum.STOP;
            isRunning = false;
        }
    }
    
    var evolve = function(grid) {
        grid = seedGrid(gridSize);
        golDraw.drawGrid(grid);
        gen++;
    };

    var seedGrid = function(gridSize) {
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
        start: start,
        stop: stop
    }    
    
})();

var golDraw = (function() {
    var ptWidth = 20;
    var gridWidth = 100;
    var gridHeight = 100;
    
    var drawGrid = function(grid) {
        var rowSize = grid.length;
        var points = '';
        var alive = "alive";
        var dead = "dead";
        var ptState = alive;

        initGridDimensions(rowSize);
        for(i = rowSize - 1; i >= 0; i--) {
            for(j = 0; j < rowSize; j++) { 
                console.log(i + ':' + j + ':' + grid[i][j]);
                if(grid[i][j] === 0) {
                    ptState = dead;
                } else {
                    ptState = alive;
                }
                points += "<div id=\"pt"  + i + j + "\" " + "class=\"point " 
                    + ptState + "\"></div>";
            }
        }
        $('#grid').empty();
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

