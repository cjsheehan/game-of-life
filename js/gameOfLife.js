var gol = (function() {
    "use strict";
    
    const RunEnum = {
        RUN: 0,
        STOP: 1,
    }
    
    const CellEnum = {
        ALIVE: 1,
        DEAD: 0,        
    }
    
    const RuleEnum = {
        UNDER_POP: 0,
        NEXT_GEN: 1,
        OVER_POP: 2,
        REPRODUCE: 3
    };
    
    const CellLocation = {
        LOWER_LEFT: 0,
        LOWER_RIGHT: 1,
        TOP_LEFT: 2,
        TOP_RIGHT: 3,
        LOWER_ROW: 4,
        UPPER_ROW: 5,
        LEFT_COLUMN: 6,
        RIGHT_COLUMN: 7
    };
    
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
            // grid = seedGrid(gridSize);
            grid = seedKnown();
            golDraw.drawGrid(grid);
            // evolve(grid);
            runControl = setInterval(function() { evolve(); }, frameTime);
        }
    };  
    
    var stop = function() {
        if(isRunning) {
            clearTimeout(runControl);
            runState = RunEnum.STOP;
            isRunning = false;
        }
    };
    
    var evolve = function () {
        gen++;
        var successor = [];
        for (var i = 0; i < gridSize; i++) {
            var row = [];
            for (var j = 0; j < gridSize; j++) {
                row[j] = evalCell(i, j, grid);
            }
            successor.push(row);
        }
        grid = successor;
        console.log("gen" + ':' + gen);  
        gridToConsole(grid);
        golDraw.drawGrid(grid);
    };

    var seedGrid = function(gridSize) {
        var grid = [];
        for(var i = 0; i < gridSize; i++) {
            var row = [];
            for(var j = 0; j < gridSize; j++) {  
                row[j] = randInt(0,1);
            }
            grid.push(row);
        }
        return grid;
    };  
    
    var gridToConsole = function(grid) {
        // reverse print grid so that it is 
        // aligned with coords
        var length = grid.length - 1;
        for(var i = length; i >= 0; i--) {
            console.log(grid[i]);
        }
    };
    
    var seedKnown = function(gridSize) {
        var a = [ [0,0,0,0,0], 
                  [0,0,1,0,0],
                  [0,0,1,0,0],
                  [0,0,1,0,0],
                  [0,0,0,0,0] ];
        var known = a;
        return known;
    }; 

    var randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };  
    
    function evalCell(v, h, grid) {
        var neighbourhood = genNeighbourhood(v, h, grid);
        var cellState = grid[v][h];
        var numLiveNeighbours = countLiveCells(neighbourhood);

        if (cellState === CellEnum.ALIVE && numLiveNeighbours < 2) {
            // 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population. 
            cellState = CellEnum.DEAD;
        } else if (cellState === CellEnum.ALIVE && numLiveNeighbours === 2 || numLiveNeighbours === 3) {
            // 2. Any live cell with two or three live neighbours lives on to the next generation.
            cellState = CellEnum.ALIVE;
        } else if (cellState === CellEnum.ALIVE && numLiveNeighbours > 3) {
            // 3. Any live cell with more than three live neighbours dies, as if by over-population.
            cellState = CellEnum.DEAD;
        } else if (cellState === CellEnum.DEAD && numLiveNeighbours === 3) {
            // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
            cellState = CellEnum.ALIVE
        }
        return cellState;
    }
    
    function countLiveCells(grid) {
        var numLive = 0;
        var length = grid.length;
        for (var i = 0; i < length; i++) {
            if (grid[i] === CellEnum.ALIVE) {
                numLive++;
            }
        }
        return numLive;
    }
      
    var genNeighbourhood = function(v, h, grid) {
        var neighbourhood = [];  
        // Note: convention is using (y,x) coords to align with 2d array iteration in memory
        // where y is horizontal and x is vertical
        if(v === 0 && h === 0) {
            // LOWER_LEFT
            neighbourhood = [grid[v+1][h], grid[v+1][h+1], grid[v][h+1], CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD];
        } else if(v ===  0 && h === gridSize-1) {
            // LOWER_RIGHT
            neighbourhood = [grid[v+1][h], CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, grid[v][h-1], grid[v+1][h-1]];
        } else if(v === 0 && h === gridSize-1) {
            // TOP_LEFT
            neighbourhood = [CellEnum.DEAD, CellEnum.DEAD, grid[v][h+1], grid[v-1][h+1], grid[v-1][h], CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD];
        } else if(v === gridSize-1 && h === gridSize-1) {
            // TOP_RIGHT
            neighbourhood = [CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, grid[v-1][h], grid[v-1][h-1], grid[v][h-1], CellEnum.DEAD];
        } else if(v === 0) {
            // LOWER_ROW
            neighbourhood = [grid[v+1][h], grid[v+1][h+1], grid[v][h+1], CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, grid[v][h-1], grid[v+1][h-1]];
        } else if(v === gridSize-1) {
            // UPPER_ROW
            neighbourhood = [CellEnum.DEAD, CellEnum.DEAD, grid[v][h+1], grid[v-1][h+1], grid[v-1][h], grid[v-1][h-1], grid[v][h-1], CellEnum.DEAD];
        } else if(h === 0) {
            // LEFT_COLUMN
            neighbourhood = [grid[v+1][h], grid[v+1][h+1], grid[v][h+1], grid[v-1][h+1], grid[v-1][h], CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD];
        } else if(h === gridSize-1) {
            // RIGHT_COLUMN
            neighbourhood = [grid[v+1][h], CellEnum.DEAD, CellEnum.DEAD, CellEnum.DEAD, grid[v-1][h], grid[v-1][h-1], grid[v][h-1], grid[v+1][h-1]];
        } else {
            // CENTRAL
            neighbourhood = [grid[v+1][h], grid[v+1][h+1], grid[v][h+1], grid[v-1][h+1], grid[v-1][h], grid[v-1][h-1], grid[v][h-1], grid[v+1][h-1]];
        }
       
        return neighbourhood;
    };
      
    return {
        start: start,
        stop: stop
    };    
    
})();

var golDraw = (function() {
    "use strict";
    var cellWidth = 5;
    var gridWidth = 100;
    var gridHeight = 100;
    var alive = "alive";
    var dead = "dead";    
    
    var drawGrid = function(grid) {
        var rowSize = grid.length;
        var cells = '';
        var cellState = alive;

        initGridDimensions(rowSize);
        for(var i = rowSize - 1; i >= 0; i--) {
            for(var j = 0; j < rowSize; j++) { 
                if(grid[i][j] === 0) {
                    cellState = dead;
                } else {
                    cellState = alive;
                }
                cells += "<div id=\"cell"  + i + j + "\" " + "class=\"cell " 
                    + cellState + "\"></div>";
            }
        }
        var gridNode = document.getElementById("grid");
        while(gridNode.firstChild) {
            gridNode.removeChild(gridNode.firstChild);
        }
        
        gridNode.innerHTML = cells;        
        // $('#grid').empty();
        // $('#grid').append(cells); 
    };
    
    
    var initGridDimensions = function(size) {
        gridWidth = cellWidth * size;
        gridHeight = gridWidth;
        // $('#grid').css("width", gridWidth);
        // $('#grid').css("height", gridHeight);
    };
    
    return {
        drawGrid: drawGrid
    }; 
    
})();

