var gol = (function() {
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
            grid = seedGrid(gridSize);
            golDraw.drawGrid(grid);
            // testArray();
            evolve(grid);
            //runControl = setInterval(function() { evolve(grid); }, frameTime);
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
        var last = grid;
        for(var rule in RuleEnum) {
            next = [];
            for(var i = 0; i < gridSize; i++) {
                var row = [];
                for(var j = 0; j < gridSize; j++) {  
                    row[j] = evalCell(i, j, last, RuleEnum[rule]);
                    // console.log(i, ':', j, ':', row[j] );
                }
                next.push(row)
            }
            last = next;
        }
        golDraw.drawGrid(next);
        gen++;
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

    var randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };  
    
    var testArray = function () {
        var array = [ [0, 1, 2, 3], [4, 5, 6, 7]];
        for(var i = 0; i < array.length; i++) {
            for(var j = 0; j < array[i].length; j++) {  
                console.log(i, ':', j, ':', array[i][j]);
            }
        }
        
    };
           
    function evalCell(x, y, grid, rule) {
        console.log(x + ':' + y + ':' + grid[x][y]);
        var neighbourhood = genNeighbourhood(x, y, grid);
        var cellState = grid[x][y];
        var numNeighbours = neighbourhood.length;
        var numLiveNeighbours = 0;
        for(var i = 0; i < numNeighbours; i++) {
              if(neighbourhood[i] === CellEnum.ALIVE) {
                  numLiveNeighbours++;
              }         
        }
        
        switch (rule) {
            case RuleEnum.UNDER_POP:
                // 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population. 
                if(grid[x][y] === CellEnum.ALIVE && numLiveNeighbours < 2) {
                     cellState = CellEnum.ALIVE;
                }
                break;
            
            case RuleEnum.NEXT_GEN:
                // 2. Any live cell with two or three live neighbours lives on to the next generation.
                if(grid[x][y] === CellEnum.ALIVE && numLiveNeighbours === 2 || numLiveNeighbours === 3) {
                     cellState = CellEnum.ALIVE;
                }
                break;
            
            case RuleEnum.OVER_POP:
                // 3. Any live cell with more than three live neighbours dies, as if by over-population.
                if(grid[x][y] === CellEnum.ALIVE && numLiveNeighbours > 3) {
                    cellState = CellEnum.DEAD;
                }
                break;
            
            case RuleEnum.REPRODUCE:
                // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if(grid[x][y] === CellEnum.DEAD && numLiveNeighbours === 2) {
                    cellState = CellEnum.ALIVE
                }
                break;
        }
        return cellState;
    };
    
    var genNeighbourhood = function(x, y, grid) {
        var neighbourhood = [];    
        if(x === 0 && y === 0) {
            // LOWER_LEFT
            neighbourhood = [ grid[x][y+1], grid[x+1][y+1], grid[x+1][y] ];
        } else if(x === gridSize-1 && y === 0) {
            // LOWER_RIGHT
            neighbourhood = [ grid[x][y+1], grid[x-1][y], grid[x-1][y+1],  ];
        } else if(x === 0 && y === gridSize-1) {
            // TOP_LEFT
            neighbourhood = [ grid[x+1][y], grid[x+1][y-1], grid[x][y-1] ];
        } else if(x === gridSize-1 && y === gridSize-1) {
            // TOP_RIGHT
            neighbourhood = [ grid[x][y-1], grid[x-1][y-1], grid[x-1][y] ];
        } else if(x === 0) {
            // LOWER_ROW
            neighbourhood = [ grid[x][y+1], grid[x+1][y+1], grid[x+1][y], grid[x-1][y], grid[x-1][y+1] ];
        } else if(x === gridSize-1) {
            // UPPER_ROW
            neighbourhood = [ grid[x+1][y], grid[x+1][y-1], grid[x][y-1], grid[x-1][y-1], grid[x-1][y] ];
        } else if(y === 0) {
            // LEFT_COLUMN
            neighbourhood = [ grid[x][y+1], grid[x+1][y+1], grid[x][y+1], grid[x+1][y-1], grid[x][y-1] ];
        } else if(y === gridSize-1) {
            // RIGHT_COLUMN
            neighbourhood = [ grid[x][y+1], grid[x][y-1], grid[x-1][y-1], grid[x-1][y], grid[x-1][y+1] ];
        } else {
            // CENTRAL
            neighbourhood = [ grid[x][y+1], grid[x+1][y+1], grid[x+1][y], grid[x+1][y-1], 
                                grid[x][y-1], grid[x-1][y-1], grid[x-1][y], grid[x-1][y+1] ];
        }
       
        return neighbourhood;
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
        for(var i = rowSize - 1; i >= 0; i--) {
            for(var j = 0; j < rowSize; j++) { 
                // console.log(i + ':' + j + ':' + grid[i][j]);
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

