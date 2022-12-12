import './index.css';
/*
Game functionality

1. Render the snake on the first x number of cells, be sure to make note of the first and last cells.
2. Change Direction:
    # it is key for the front cell and last cell to have separate navigation systems
    (i) Front Cell
        When the user selects a new direction:
            - check whether it is the same as the current direction
            if same direction:
                ignore it
            if not same direction:
                - update the front cell direction buffer, which is an array with the subsequent directions that the
                snake should follow
            - For each of the snake's movements take the first value of the front cell direction buffer (if any),
            then remove it from the buffer and use this as the direction when moving the first cell

    (ii) Last Cell
        - When a user had entered a new direction and the
        front cell makes the change in direction, we need to log the cell the front cell has moved from,
        log both the direction and the cell coordinates inside the last cell direction buffer
        - For each of the last cell's movements, check whether the current cell coordinates match the first value in
        the last cell direction buffer, if so, use this new direction to move the last cell and remove the value from
        the last cell direction buffer

3. Move the snake:
    - Here, we need to move two things, the front and last cell. This will entail giving the two new values, the
    coordinates of the cells will change to whatever is evaluated to be the next respectively
    - The only changing item for both is the direction so we need to evaluate what the direction is and then we will
    feed this into a function that will get the next cell's coordinates.

    (i) Front cell
    - To determine what will be the next front cell, 
    - If the front cell direction buffer is not empty:
        change the front cell direction to the value in the first index of the front cell direction buffer 
    - If not:
        do not change the front cell direction
    
    - Get the next direction from the get next cell function

    - Next we need to check whether there actually is a cell with those particular coordinates that is available
    ("that is not shaded")
    - If it is possible to move to the next cell:
        change the front cell coordinates to be the new cell
    - if not:
        stop the game

    (ii) Last Cell
    - To determine what will be the next last cell,
    - If the last cell direction buffer is not empty:
        - If the first item in the last cell direction buffer has the same coordinates as the current cell:
            change the last cell direction to the direction value
        - If not:
            keep the last cell direction
    - If not:
        keep the last cell direction

4. Food
    The snake gets bigger by eating food. The food should be placed randomly on the board, when the head(front cell) of the snake
    occupies a cell with the food, the snake gets one cell bigger.

    (i) Positioning food
    - Check the cells within the board that do not have the SHADED_CLASS and choose one randomly then add the food class.

    With every snake movement, at the start of the game, position food somewhere within the playground
    
    (ii) Eating food
    - When eating, skip all the activities for the last cell, the unshading and changing of last cell coordinates. This delay should
    carry foward to the next sequence.

    - We could have a property to the game class called isEating which when true, the last cell functionalities don't happen, but also
    is turned back on when they don't happend. It will be turned off by default and will be turned on when the front cell lands on a
    cell with the class FOOD
*/

const SHADED_CLASS = "shadedCell";
const FOOD_CLASS = "foodCell";
const SNAKE_LENGTH = 3;
const SNAKE_DIRECTION = "SOUTH";
const SNAKE_SPEED = 300;

let playGroundElement = document.createElement("div");
playGroundElement.id = "playground";
document.body.appendChild(playGroundElement);
let playGroundHeight = 10;
let playGroundWidth = 10;

class SnakeGame{
    playGround = [];

    frontCellDirectionBuffer = [];
    lastCellDirectionBuffer = [];

    isEating = false;

    keyMappings = {
        "ARROWRIGHT" : "EAST",
        "ARROWLEFT" : "WEST",
        "ARROWUP" : "NORTH",
        "ARROWDOWN" : "SOUTH"
    };

    constructor(playGroundElement,playGroundHeight,playGroundWidth,snakeLength,snakeDirection,snakeSpeed){
        this.playGroundHeight = playGroundHeight;
        this.playGroundElement = playGroundElement;
        this.playGroundWidth = playGroundWidth;
        this.snakeLength = snakeLength;
        this.frontCellDirection = snakeDirection;
        this.lastCellDirection = snakeDirection;
        this.snakeSpeed = snakeSpeed;

        this.createPlayGround();
    }
    
    createPlayGround(){
        for(let i=0; i<this.playGroundHeight; i++){
            let playGroundRow = [];
            for(let j=0; j<this.playGroundWidth; j++){
                let cellId = (i.toString() + j.toString());
                let cell = this.createCell(cellId);
                playGroundRow.push(cell.id);
                this.playGroundElement.appendChild(cell);
            }
            this.playGround.push(playGroundRow);
            playGroundRow = [];
        }
    }
    
    createCell(id){
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = id;
        return cell;
    };

    getMedian(number){
        let isEven = number % 2 === 0;

        if(isEven){
            return (number / 2) + 1;
        }else{
            return ((number + 1) / 2);
        }
    };

    getNextCell(direction,cell){
        switch(direction){
            case("NORTH"):{
                return [cell[0] - 1, cell[1]];
            }case("EAST"):{
                return [cell[0], cell[1] + 1];
            }case("SOUTH"):{
                return [cell[0] + 1, cell[1]];
            }case("WEST"):{
                return [cell[0], cell[1] - 1];
            }default:{
                return cell
            }
        };
    };

    shadeCell(cellId){
        let startingCell = document.getElementById(cellId);
        startingCell.classList.add(SHADED_CLASS);
    };

    unshadeCell(cellId){
        let startingCell = document.getElementById(cellId);
        startingCell.classList.remove(SHADED_CLASS);
    };

    renderSnake(startingPosition){
        let shadedUntil = startingPosition;
        for(let i=0; i<this.snakeLength; i++){
            // Shade the subsequent cells
            let nextCell = this.getNextCell(this.getOppositeDirection(this.frontCellDirection),shadedUntil);
            let nextCellId = this.getCellId(nextCell);
            this.shadeCell(nextCellId);
            shadedUntil = nextCell;
        };
        return shadedUntil;
    };

    getCellId(cellCoordinates){
        return cellCoordinates.join("").toString();
    };

    cellWithinPlayground(coordinates){
        let playGroundArea = this.playGroundHeight * playGroundWidth;
        let cellId = parseInt(this.getCellId(coordinates));
        return cellId >= 0 && cellId < playGroundArea;
    };

    cellIsOccupied(coordinates){
        let cellId = this.getCellId(coordinates);
        let cellElement = document.getElementById(cellId);
        return cellElement.classList.contains(SHADED_CLASS);
    };

    cellHasFood(coordinates){
        let cellId = this.getCellId(coordinates);
        let cellElement = document.getElementById(cellId);
        return cellElement.classList.contains(FOOD_CLASS);
    };

    getOppositeDirection(direction){
        switch(direction){
            case("NORTH"):{
                return "SOUTH";
            }
            case("SOUTH"):{
                return "NORTH";
            }
            case("WEST"):{
                return "EAST";
            }
            case("EAST"):{
                return "WEST";
            }
        };
    };

    handleDirectionChange(direction){
        let latestDirection = this.frontCellDirectionBuffer[this.frontCellDirectionBuffer.length - 1];
        if(latestDirection === undefined){
            if(direction !== this.getOppositeDirection(this.frontCellDirection)){
                this.frontCellDirectionBuffer.push(direction);
            };
        }else if(this.getOppositeDirection(latestDirection) !== direction){
            this.frontCellDirectionBuffer.push(direction);
        };
    };

    listenForDirectionChange(){
        document.addEventListener("keydown",(event)=>{
            let keyPressed = event.key.toUpperCase();
            let directions = ["ARROWUP","ARROWRIGHT","ARROWLEFT","ARROWDOWN"];
            if(directions.includes(keyPressed)){
                this.handleDirectionChange(this.keyMappings[keyPressed]);
            };
        });
    };

    stopListeningForDirectionChange(){
        document.removeEventListener("keydown",(event)=>{
            this.handleDirectionChange(event.key.toUpperCase());
        })
    };

    getLastCellNextDirection(){
        let nextDirection = this.lastCellDirection;
        if(this.lastCellDirectionBuffer.length > 0){
            let nextDirectionChange = this.lastCellDirectionBuffer[0];
            if(this.getCellId(this.lastCellCoordinates) === this.getCellId(nextDirectionChange.coordinates)){
                this.lastCellDirectionBuffer.splice(0,1);
                nextDirection = nextDirectionChange.direction;
            };
        };
        return nextDirection;
    }

    getFrontCellNextDirection(){
        let nextDirection = this.frontCellDirection;
        if(this.frontCellDirectionBuffer.length > 0){
            nextDirection = this.frontCellDirectionBuffer.splice(0,1)[0];
            this.lastCellDirectionBuffer.push({
                direction : nextDirection,
                coordinates : this.frontCellCoordinates
            });
        };
        return nextDirection;
    };

    cellCheck(coordinates){
        if(this.cellWithinPlayground(coordinates) && !this.cellIsOccupied(coordinates)){
            return true;
        }else{
            return false;
        };
    };

    getPossibleFoodPositions(){
        let possibleFoodPositions = [];
        for(let i=0; i<this.playGround.length; i++){
            for(let j=0; j<this.playGround[i].length; j++){
                let cellHasFood = this.cellHasFood([i,j]);
                let cellIsOccupied = this.cellIsOccupied([i,j]);

                if(!cellHasFood && !cellIsOccupied){
                    possibleFoodPositions.push(this.getCellId([i,j]));
                };
            };
        };
        return possibleFoodPositions;
    };

    getRandomInt(maxValue){
        return Math.floor(Math.random() * maxValue);
    };

    positionFood(){
        let possibleFoodPositions = this.getPossibleFoodPositions();
        let newFoodCellId = possibleFoodPositions[this.getRandomInt(possibleFoodPositions.length)];

        let foodCell = document.getElementById(newFoodCellId);
        foodCell.classList.add(FOOD_CLASS);
    };

    eatFood(coordinates){
        if(this.cellHasFood(coordinates)){
            this.isEating = true;
            let cellWithFood = document.getElementById(this.getCellId(coordinates));
            cellWithFood.classList.remove(FOOD_CLASS);
        };
    };

    moveSnake(){
        this.frontCellDirection = this.getFrontCellNextDirection();
        let nextFrontCellCoordinates = this.getNextCell(this.frontCellDirection,this.frontCellCoordinates);
        if(this.cellCheck(nextFrontCellCoordinates)){
            this.frontCellCoordinates = nextFrontCellCoordinates;
            this.eatFood(this.frontCellCoordinates);
            this.shadeCell(this.getCellId(this.frontCellCoordinates));

            if(!this.isEating){
                this.unshadeCell(this.getCellId(this.lastCellCoordinates));
                this.lastCellDirection = this.getLastCellNextDirection();
                this.lastCellCoordinates = this.getNextCell(this.lastCellDirection,this.lastCellCoordinates);
            }else{
                this.isEating = false;
                this.positionFood();
            }
            
            setTimeout(()=>{
                this.moveSnake()
            },this.snakeSpeed)
        }else{
            console.log("problem")
        };
    };

    startGame(){
        this.frontCellCoordinates = [this.getMedian(this.playGroundHeight),this.getMedian(this.playGroundWidth)];
        let startingCellId = this.playGround[this.frontCellCoordinates[0]][this.frontCellCoordinates[1]];
        
        // Shade the initial cell
        this.shadeCell(startingCellId);

        this.lastCellCoordinates = this.renderSnake(this.frontCellCoordinates);
        this.listenForDirectionChange();
        this.moveSnake();
        this.positionFood();
    };
}

// Frontend
(()=>{
    let snakeGame = new SnakeGame(playGroundElement,playGroundHeight,playGroundWidth,SNAKE_LENGTH,SNAKE_DIRECTION,SNAKE_SPEED);
    snakeGame.startGame();
})();