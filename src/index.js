import './index.css';

import play_icon from './assets/play_icon.png';

import { SnakeGame } from './snake';

const SNAKE_LENGTH = 3;
const SNAKE_DIRECTION = "SOUTH";
const SNAKE_SPEED = 300;

// set the icon src
window.play_icon_src = play_icon;
document.getElementById('play-icon').src = window.play_icon_src;


let playGroundHeight = 10;
let playGroundWidth = 10;

function game() {
    let mainElement = document.getElementById('main');
    let playGroundElement = document.createElement('div');
    playGroundElement.id = 'playground';
    playGroundElement.style.display = 'none';
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