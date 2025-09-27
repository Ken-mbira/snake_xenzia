import { SnakeGame } from './snake.js';

const SNAKE_LENGTH = 3;
const SNAKE_DIRECTION = "DOWN";
const SNAKE_SPEED = 300;

const keyMappings = {
    "ARROWRIGHT": "RIGHT",
    "ARROWLEFT": "LEFT",
    "ARROWUP": "UP",
    "ARROWDOWN": "DOWN"
};

// set the icon src
document.getElementById('play-icon').src = './assets/play_icon.png';


let playGroundHeight = 10;
let playGroundWidth = 5;

function game() {
    let mainElement = document.getElementById('main');
    let playGroundElement = document.createElement('div');
    playGroundElement.id = 'playground';
    playGroundElement.style.display = 'none';
    playGroundElement.style.gridTemplateColumns = `repeat(${playGroundWidth},1fr)` 
    mainElement.appendChild(playGroundElement);

    let snakeGame = new SnakeGame(
        playGroundElement,
        playGroundHeight,
        playGroundWidth,
        SNAKE_LENGTH,
        SNAKE_DIRECTION,
        SNAKE_SPEED,
        () => {
            playGroundElement.style.opacity = 0.2;
            document.getElementById('play-icon').src = './assets/reset_icon.png';
            document.getElementById('play-screen').style.display = 'block';
            document.getElementById('playground').style.display = 'none';
            document.getElementById('play-button').style.zIndex = 1;
        }
    );

    document.getElementById('play-button').addEventListener('click', () => {
        playGroundElement.style.opacity = 1;
        document.getElementById('play-screen').style.display = 'none';
        document.getElementById('playground').style.display = 'grid';
        snakeGame.startGame();
    })

    document.addEventListener("keydown", (event) => {
        let keyPressed = event.key.toUpperCase();
        let directions = ["ARROWUP", "ARROWRIGHT", "ARROWLEFT", "ARROWDOWN"];
        if (directions.includes(keyPressed)) {
            snakeGame.handleDirectionChange(keyMappings[keyPressed]);
        };
    });
}

// Frontend
(() => {
    game();
})();
