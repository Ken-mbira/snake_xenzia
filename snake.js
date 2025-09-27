import { Cell } from "./cell.js";

const SHADED_CLASS = "shadedCell";
const FOOD_CLASS = "foodCell";

export class SnakeGame {
    playGroundCells = [];

    frontCellDirectionBuffer = [];
    lastCellDirectionBuffer = [];

    isEating = false;

    originalDirection = "";
    originalSnakeLength = 0;


    constructor(
        playGroundElement,
        playGroundHeight,
        playGroundWidth,
        snakeLength,
        snakeDirection,
        snakeSpeed,
        showResetUI
    ) {
        this.playGroundHeight = playGroundHeight;
        this.playGroundElement = playGroundElement;
        this.playGroundWidth = playGroundWidth;

        this.snakeLength = snakeLength;
        this.originalSnakeLength = snakeLength;

        this.frontCellDirection = snakeDirection;
        this.originalDirection = snakeDirection;
        this.lastCellDirection = snakeDirection;

        this.snakeSpeed = snakeSpeed;
        this.showResetUI = showResetUI;

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
            case ("UP"): {
                return [cell[0] - 1, cell[1]];
            } case ("RIGHT"): {
                return [cell[0], cell[1] + 1];
            } case ("DOWN"): {
                return [cell[0] + 1, cell[1]];
            } case ("LEFT"): {
                return [cell[0], cell[1] - 1];
            } default: {
                return cell
            }
        };
    };

    renderSnake(startingPosition) {
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

    isCellWithinPlayground(coordinates) {
        return coordinates[0] >= 0 && coordinates[0] < this.playGroundHeight && coordinates[1] >= 0 && coordinates[1] < this.playGroundWidth;
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
            case ("UP"): {
                return "DOWN";
            }
            case ("DOWN"): {
                return "UP";
            }
            case ("LEFT"): {
                return "RIGHT";
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
        if(!this.isCellWithinPlayground(coordinates)) {
            return false;
        }

        let checkCell = this.getCell(coordinates);
        if (checkCell.isOccupied) {
            return false;
        }

        return true;
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

    eatFood(foodCell) {
        this.isEating = true;
        foodCell.eatFood();
    };

    moveSnake() {
        this.frontCellDirection = this.getFrontCellNextDirection();

        let nextFrontCellCoordinates = this.getNextCellCoordinates(this.frontCellDirection, this.frontCellCoordinates);

        if (this.cellCheck(nextFrontCellCoordinates)) {
            this.frontCellCoordinates = nextFrontCellCoordinates;

            let newCell = this.getCell(this.frontCellCoordinates);
            if (newCell.hasFood) {
                this.eatFood(newCell);
            }

            let frontCell = this.getCell(this.frontCellCoordinates);
            frontCell.shadeCell();

            if (!this.isEating) {
                let lastCell = this.getCell(this.lastCellCoordinates);
                lastCell.unshadeCell();

                this.lastCellDirection = this.getLastCellNextDirection();
                this.lastCellCoordinates = this.getNextCellCoordinates(this.lastCellDirection, this.lastCellCoordinates);
            } else {
                this.isEating = false;
                this.positionFood();
            }

            setTimeout(() => {
                this.moveSnake()
            }, this.snakeSpeed)
        } else {
            this.resetGame();
        };
    };

    resetGame() {
        this.showResetUI();

        this.frontCellDirectionBuffer = [];
        this.lastCellDirectionBuffer = [];
        this.isEating = false;

        this.frontCellDirection = this.originalDirection;
        this.lastCellDirection = this.originalDirection;
        this.snakeLength = this.originalSnakeLength;
    }

    startGame() {
        this.playGroundCells.forEach(row => {
            row.forEach(cell => {
                cell.unshadeCell();
                cell.removeFood();
            });
        });

        this.frontCellCoordinates = [this.getMedian(this.playGroundHeight), this.getMedian(this.playGroundWidth)];
        
        let startingCell = this.getCell(this.frontCellCoordinates);
        // Shade the initial cell
        startingCell.shadeCell();

        this.lastCellCoordinates = this.renderSnake(this.frontCellCoordinates);
        this.moveSnake();
        this.positionFood();
    };
}