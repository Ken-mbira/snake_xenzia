import { SnakeGame } from './snake.js';

const SNAKE_LENGTH = 3;
const SNAKE_DIRECTION = "SOUTH";
const SNAKE_SPEED = 300;

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

    let snakeGame = new SnakeGame(playGroundElement, playGroundHeight, playGroundWidth, SNAKE_LENGTH, SNAKE_DIRECTION, SNAKE_SPEED);
    document.getElementById('play-button').addEventListener('click', () => {
        document.getElementById('play-screen').style.display = 'none';
        document.getElementById('playground').style.display = 'grid';
        snakeGame.startGame();
    })
}

// Frontend
(() => {
    game();
})();
