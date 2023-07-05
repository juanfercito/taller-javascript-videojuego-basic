const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

const toUp = document.querySelector('#up');
const toLeft = document.querySelector('#left');
const toRight = document.querySelector('#right');
const toDown = document.querySelector('#down');

const countLives = document.querySelector('#lives');
const timeCount = document.querySelector('#time');
const score = document.querySelector('#score');
const message = document.querySelector('#message');

const endgame = document.querySelector('#endgame');
const endgameButton = document.querySelector('#play-again');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosit = {
    x: undefined,
    y: undefined,
}

const giftPosit = {
    x: undefined,
    y: undefined,
}

let bombsPosit = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
endgameButton.addEventListener('click', resetGame);

function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosit.x = undefined;
    playerPosit.y = undefined;
    startGame();
}

function startGame() {
    console.log({canvasSize, elementsSize});
    
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 1);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    showLives();

    bombsPosit = [];
    game.clearRect(0, 0, canvasSize, canvasSize);
   
    mapRowCols.forEach((row, row1) => {
        row.forEach((col, col1) => {

            const emoji = emojis[col];
            const posX = elementsSize * (col1 + 1);
            const posY = elementsSize * (row1 + 1);
            game.fillText(emoji, posX, posY);

            if (col == 'O') {
                if (!playerPosit.x && !playerPosit.y) {
                    playerPosit.x = posX;
                    playerPosit.y = posY;
                    console.log(playerPosit);
                }
            } else if (col == 'I') {
                giftPosit.x = posX;
                giftPosit.y = posY;
            } else if (col == 'X') {
                bombsPosit.push({
                    x: posX,
                    y: posY,
                })
            }

            game.fillText(emoji, posX, posY);
        }); 

    });

    movePlayer();
}


// muestra en pantalla:
function movePlayer() {

    const getGiftX = playerPosit.x.toFixed(3) == giftPosit.x.toFixed(3);
    const getGiftY = playerPosit.y.toFixed(3) == giftPosit.y.toFixed(3);

    const getGift = getGiftX && getGiftY;

    if (getGift) {
        levelWin();
    }

    const bombCrash = bombsPosit.find(bomb => {
        const bombCrashX = bomb.x.toFixed(3) == playerPosit.x.toFixed(3);
        const bombCrashY = bomb.y.toFixed(3) == playerPosit.y.toFixed(3);
        return bombCrashX && bombCrashY;
    });

    if (bombCrash) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosit.x, playerPosit.y);
}

function levelWin() {
    console.log('level up');
    level++;
    startGame();
}

function levelFail() {
    console.log('Kabooom!!!');
    lives--;

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosit.x = undefined;
    playerPosit.y = undefined;
    startGame();
}

function gameWin() {
    clearInterval(timeInterval);
    endgame.innerText = 'Congratulations.. You won the game!!';

    const recordTime = localStorage.getItem('score');
    const playerTime = Date.now() - timeStart;

    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('score', playerTime);
            console.log(recordTime);
            message.innerText = 'up the score!!';
        } else {
            message.innerText = 'sorry, score not enough!!';
        }
    } else {
        localStorage.setItem('score', playerTime);
    }

    console.log(recordTime, playerTime);
}

function showLives() {
    console.log('lives: ', Array(lives).fill(emojis['LIVES']));
    countLives.innerText = emojis['LIVES'].repeat(lives);
}

function showTime() {
    timeCount.innerText = Date.now() - timeStart;
}

function showRecord() {
	score.innerText = localStorage.getItem('score') + " seg";
}
function resetGame() {
    location.reload();
}



//funciones de movimiento:
window.addEventListener('keydown', pressKey);
toUp.addEventListener('click', moveUp);
toLeft.addEventListener('click', moveLeft);
toRight.addEventListener('click', moveRight);
toDown.addEventListener('click', moveDown);

function pressKey(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
}

function moveUp() {
    console.log('ir hacia arriba');

    if ((playerPosit.y - elementsSize) < elementsSize)  {
        console.log('OUT');
    } else {
        playerPosit.y -= elementsSize;
        startGame();
    }
}
function moveLeft() {

    console.log('ir hacia izquierda');
    if ((playerPosit.x - elementsSize) < elementsSize)  {
        console.log('OUT');
    } else {
        playerPosit.x -= elementsSize;
        startGame();
    }
    
}
function moveRight() {

    console.log('ir hacia derecha');
    if ((playerPosit.x + elementsSize) > canvasSize)  {
        console.log('OUT');
    } else {
        playerPosit.x += elementsSize;
        startGame();
    }
}
function moveDown() {

    console.log('ir hacia abajo');
    if ((playerPosit.y + elementsSize) > canvasSize)  {
        console.log('OUT');
    } else {
        playerPosit.y += elementsSize;
        startGame();
    }
}