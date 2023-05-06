import { Cell } from "./cell";

const SHADED_CLASS = "shadedCell";
const FOOD_CLASS = "foodCell";

export class SnakeGame {
    playGroundCells = [];

    frontCellDirectionBuffer = [];
    lastCellDirectionBuffer = [];

    isEating = false;

    keyMappings = {
        "ARROWRIGHT": "EAST",
        "ARROWLEFT": "WEST",
        "ARROWUP": "NORTH",
        "ARROWDOWN": "SOUTH"
    };

    constructor(
        playGroundElement,
        playGroundHeight,
        playGroundWidth,
        snakeLength,
        snakeDirection,
        snakeSpeed
    ) {
        this.playGroundHeight = playGroundHeight;
        this.playGroundElement = playGroundElement;
        this.playGroundWidth = playGroundWidth;
        this.snakeLength = snakeLength;
        this.frontCellDirection = snakeDirection;
        this.lastCellDirection = snakeDirection;
        this.snakeSpeed = snakeSpeed;

        this.createPlayGround();
    }

    createPlayGround() {
        for (let i = 0; i < this.playGroundHeight; i++) {
            let playGroundCellRow = [];
            for (let j = 0; j < this.playGroundWidth; j++) {
                let cellId = (i.toString() + ',' + j.toString());
                let newCell = new Cell(cellId);
                playGroundCellRow.push(newCell);
                this.playGroundElement.appendChild(newCell.element);
            }
            this.playGroundCells.push(playGroundCellRow);
            playGroundCellRow = [];
        }
    }

    getMedian(number) {
        let isEven = number % 2 === 0;

        if (isEven) {
            return (number / 2) + 1;
        } else {
            return ((number + 1) / 2);
        }
    };

    getNextCellCoordinates(direction, cell) {
        switch (direction) {
            case ("NORTH"): {
                return [cell[0] - 1, cell[1]];
            } case ("EAST"): {
                return [cell[0], cell[1] + 1];
            } case ("SOUTH"): {
                return [cell[0] + 1, cell[1]];
            } case ("WEST"): {
                return [cell[0], cell[1] - 1];
            } default: {
                return cell
            }
        };
    };

    renderSnake(startingPosition) {
        // Draw the snake provided the starting position.
        let shadedUntil = startingPosition;
        for (let i = 1; i < this.snakeLength; i++) {
            // Shade the subsequent cells
            let nextCellCoordinates = this.getNextCellCoordinates(this.getOppositeDirection(this.frontCellDirection), shadedUntil);
            let nextCell = this.getCell(nextCellCoordinates);
            nextCell.shadeCell()
            shadedUntil = nextCellCoordinates;
        };
        return shadedUntil;
    };

    getCellId(cellCoordinates) {
        return cellCoordinates.join(",").toString();
    }

    getCell(cellCoordinates) {
        return this.playGroundCells[cellCoordinates[0]][cellCoordinates[1]];
    }

    cellWithinPlayground(coordinates) {
        let playGroundArea = this.playGroundHeight * this.playGroundWidth;
        let cellId = parseInt(this.getCellId(coordinates));
        return cellId >= 0 && cellId < playGroundArea;
    };

    cellIsOccupied(coordinates) {
        let cellId = this.getCellId(coordinates);
        let cellElement = document.getElementById(cellId);
        return cellElement.classList.contains(SHADED_CLASS);
    };

    cellHasFood(coordinates) {
        let cellId = this.getCellId(coordinates);
        let cellElement = document.getElementById(cellId);
        return cellElement.classList.contains(FOOD_CLASS);
    };

    getOppositeDirection(direction) {
        switch (direction) {
            case ("NORTH"): {
                return "SOUTH";
            }
            case ("SOUTH"): {
                return "NORTH";
            }
            case ("WEST"): {
                return "EAST";
            }
            case ("EAST"): {
                return "WEST";
            }
        };
    };

    handleDirectionChange(direction) {
        let latestDirection = this.frontCellDirectionBuffer[this.frontCellDirectionBuffer.length - 1];
        if (latestDirection === undefined) {
            if (direction !== this.getOppositeDirection(this.frontCellDirection)) {
                this.frontCellDirectionBuffer.push(direction);
            };
        } else if (this.getOppositeDirection(latestDirection) !== direction) {
            this.frontCellDirectionBuffer.push(direction);
        };
    };

    listenForDirectionChange() {
        document.addEventListener("keydown", (event) => {
            let keyPressed = event.key.toUpperCase();
            let directions = ["ARROWUP", "ARROWRIGHT", "ARROWLEFT", "ARROWDOWN"];
            if (directions.includes(keyPressed)) {
                this.handleDirectionChange(this.keyMappings[keyPressed]);
            };
        });
    };

    stopListeningForDirectionChange() {
        document.removeEventListener("keydown", (event) => {
            this.handleDirectionChange(event.key.toUpperCase());
        })
    };

    getLastCellNextDirection() {
        let nextDirection = this.lastCellDirection;
        if (this.lastCellDirectionBuffer.length > 0) {
            let nextDirectionChange = this.lastCellDirectionBuffer[0];
            if (this.getCellId(this.lastCellCoordinates) === this.getCellId(nextDirectionChange.coordinates)) {
                this.lastCellDirectionBuffer.splice(0, 1);
                nextDirection = nextDirectionChange.direction;
            };
        };
        return nextDirection;
    }

    getFrontCellNextDirection() {
        let nextDirection = this.frontCellDirection;
        if (this.frontCellDirectionBuffer.length > 0) {
            nextDirection = this.frontCellDirectionBuffer.splice(0, 1)[0];
            this.lastCellDirectionBuffer.push({
                direction: nextDirection,
                coordinates: this.frontCellCoordinates
            });
        };
        return nextDirection;
    };

    cellCheck(coordinates) {
        let checkCell = this.getCell(coordinates);
        if (this.cellWithinPlayground(coordinates) && !checkCell.isOccupied) {
            return true;
        } else {
            return false;
        };
    };

    getPossibleFoodCells() {
        let possibleFoodCells = [];
        for (let i = 0; i < this.playGroundCells.length; i++) {
            for (let j = 0; j < this.playGroundCells[i].length; j++) {
                let currentCell = this.getCell([i, j]);

                if (!currentCell.hasFood && !currentCell.isOccupied) {
                    possibleFoodCells.push(currentCell);
                };
            };
        };
        return possibleFoodCells;
    };

    getRandomInt(maxValue) {
        return Math.floor(Math.random() * maxValue);
    };

    positionFood() {
        let possibleFoodCells = this.getPossibleFoodCells();
        let newFoodCell = possibleFoodCells[this.getRandomInt(possibleFoodCells.length)];

        newFoodCell.setFood();
    };

    eatFood(coordinates) {
        let foodCell = this.getCell(coordinates);
        if (foodCell.hasFood) {
            this.isEating = true;
            foodCell.eatFood();
        };
    };

    moveSnake() {
        this.frontCellDirection = this.getFrontCellNextDirection();
        let nextFrontCellCoordinates = this.getNextCellCoordinates(this.frontCellDirection, this.frontCellCoordinates);
        if (this.cellCheck(nextFrontCellCoordinates)) {
            this.frontCellCoordinates = nextFrontCellCoordinates;
            this.eatFood(this.frontCellCoordinates);
            let frontCell = this.getCell(this.frontCellCoordinates);
            frontCell.shadeCell();

            if (!this.isEating) {
                let lastCell = this.getCell(this.lastCellCoordinates);
                lastCell.unShadeCell();
                this.lastCellDirection = this.getLastCellNextDirection();
                this.lastCellCoordinates = this.getNextCell(this.lastCellDirection, this.lastCellCoordinates);
            } else {
                this.isEating = false;
                this.positionFood();
            }

            setTimeout(() => {
                this.moveSnake()
            }, this.snakeSpeed)
        } else {
            this.resetGameCallback();
        };
    };

    startGame() {
        this.frontCellCoordinates = [this.getMedian(this.playGroundHeight), this.getMedian(this.playGroundWidth)];
        
        let startingCell = this.getCell(this.frontCellCoordinates);
        // Shade the initial cell
        startingCell.shadeCell();

        this.lastCellCoordinates = this.renderSnake(this.frontCellCoordinates);
        this.listenForDirectionChange();
        this.moveSnake();
        this.positionFood();
    };
}