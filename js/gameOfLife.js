
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by over-population.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

var gol = (function() {
    const RunEnum = {
        RUN: 0,
        STOP: 1,
    }
    
    const CellEnum = {
        ALIVE: 1,
        DEAD: 0,        
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
    };
    
    var evolve = function(grid) {
        for(rule in RuleEnum) {
            next = [];
            for(i = 0; i < gridSize; i++) {
                var row = [];
                for(j = 0; j < gridSize; j++) {  
                    row[j] = evalCell(i, j, next, rule);
                }
                next.push(row)
            }
        }
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
    };  
        
    const RuleEnum = {
        UNDER_POP: 0,
        NEXT_GEN: 1,
        OVER_POP: 2,
        REPRODUCE: 3
    };
    
    function evalCell(x, y, grid, rule) {
        var neighbourhood = [ grid[x][y], grid[x][y+1], grid[x+1][y+1],
                              grid[x+1][y], grid[x+1][y-1], grid[x][y-1],
                              grid[x-1][y-1], grid[x-1][y], grid[x-1][y-1] ];  
                                    
        var cellState = grid[x][y];
        var numNeighbours = neighbourhood.length;
        var numLiveNeighbours = 0;
        for(i = 0; i < numNeighbours; i++) {
              if(neighbourhood[i] === CellEnum.ALIVE) {
                  numLiveNeighbours++;
              }         
        }
        
        switch (rule) {
            case UNDER_POP:
                // 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population. 
                if(grid[x][y] === RuleEnum.ALIVE && numLiveNeighbours < 2) {
                     cellState = CellEnum.ALIVE;
                }
                break;
            
            case NEXT_GEN:
                // 2. Any live cell with two or three live neighbours lives on to the next generation.
                if(grid[x][y] === RuleEnum.ALIVE && numLiveNeighbours === 2 || numLiveNeighbours === 3) {
                     cellState = CellEnum.ALIVE;
                }
                break;
            
            case OVER_POP:
                // 3. Any live cell with more than three live neighbours dies, as if by over-population.
                if(grid[x][y] === RuleEnum.ALIVE && numLiveNeighbours > 3) {
                    cellState = CellEnum.DEAD;
                }
                break;
            
            case REPRODUCE:
                // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if(grid[x][y] === RuleEnum.DEAD && numLiveNeighbours === 2) {
                    cellState = CellEnum.ALIVE
                }
                break;
        }
        return cellState;
    };
    
    return {
        start: start,
        stop: stop
    };    
    
})();

var golDraw = (function() {
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
        for(i = rowSize - 1; i >= 0; i--) {
            for(j = 0; j < rowSize; j++) { 
                console.log(i + ':' + j + ':' + grid[i][j]);
                if(grid[i][j] === 0) {
                    cellState = dead;
                } else {
                    cellState = alive;
                }
                cells += "<div id=\"cell"  + i + j + "\" " + "class=\"cell " 
                    + cellState + "\"></div>";
            }
        }
        $('#grid').empty();
        $('#grid').append(cells); 
    };
    
    
    var initGridDimensions = function(size) {
        gridWidth = cellWidth * size;
        gridHeight = gridWidth;
        $('#grid').css("width", gridWidth);
        $('#grid').css("height", gridHeight);
    };
    
    return {
        drawGrid: drawGrid
    }; 
    
})();

