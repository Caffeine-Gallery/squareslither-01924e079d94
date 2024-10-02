import { backend } from 'declarations/backend';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 3;

let snake = [];
let direction = 'right';
let food = null;
let gameInterval = null;
let score = 0;

const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const nameInput = document.getElementById('name-input');
const submitScoreButton = document.getElementById('submit-score');
const highScoresList = document.getElementById('high-scores-list');

function createGrid() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameBoard.appendChild(cell);
    }
}

function initializeGame() {
    snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({ x: Math.floor(GRID_SIZE / 2) - i, y: Math.floor(GRID_SIZE / 2) });
    }
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    createFood();
    render();
}

function createFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function render() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('snake', 'food'));

    snake.forEach(segment => {
        const index = segment.y * GRID_SIZE + segment.x;
        cells[index].classList.add('snake');
    });

    const foodIndex = food.y * GRID_SIZE + food.x;
    cells[foodIndex].classList.add('food');
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        createFood();
    } else {
        snake.pop();
    }

    render();
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

function startGame() {
    initializeGame();
    gameOverElement.classList.add('hidden');
    gameInterval = setInterval(moveSnake, 100);
}

startButton.addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
    }
});

submitScoreButton.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (name) {
        await backend.addHighScore(name, score);
        updateHighScores();
        gameOverElement.classList.add('hidden');
    }
});

async function updateHighScores() {
    const highScores = await backend.getHighScores();
    highScoresList.innerHTML = '';
    highScores.forEach(([name, score]) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${score}`;
        highScoresList.appendChild(li);
    });
}

createGrid();
updateHighScores();
