//Copyright (C) 2023 thefloppypig - All Rights Reserved

var canvas;
var ctx;
var images;
var audioBoom;
var audioWave;

var startTime;
var wave = 1;
var player;
var playerShoot = false;
var ships = new Set();
var projs = new Set();

const objScale = 0.1;


window.onload = main;

function main() {
    var root = document.documentElement;
    var gameArea = document.getElementById('gameArea');
    canvas = document.getElementById('gameCanvas');
    //canvas.style.width = window.innerWidth - 50;
    //canvas.style.height = window.innerHeight - 50;
    ctx = canvas.getContext('2d');
    ctx.font = "36px impact"
    loadAudio();
    images = loadImages(["s1","s2","s3","st","g","v","d"], startGame);
}

function loadAudio() {
    var music = new Audio('audio/music.wav');
    music.loop = true;
    music.play();
    audioBoom = new Audio('audio/boom.mp3');
    audioWave = new Audio('audio/wave.wav');
}

function startGame() {
    player = new Player("s1", canvas.width/2, canvas.height/2, 5, 0.15, Weapon.PlayerWeaponDefault());
    startTime = Date.now();
    addEventListener('mousemove', function (evt) {
        var mouse = mousePos(evt);
        player?.moveTarget(mouse.mx, mouse.my);
    })
    addEventListener('mousedown', function (evt) {
        playerShoot = true;
    })
    addEventListener('mouseup', function (evt) {
        playerShoot = false;
    })
    console.log("Starting game")
    var targetFps = 60;
    setInterval(gameLoop, 1000/targetFps);
    setTimeout(enemySpawning, 1000);
}

function gameLoop() {
    processing();
    render();
}


function processing() {
    if (playerShoot)
        player?.shootWeapon();
    ships.forEach(ship => {
        if (player != null && !(Object.is(ship, player))) {
            ship.moveTarget(player.x, player.y);
        }
        ship.moveTowards();
    });
    projs.forEach(e => e.move());
}

function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ships.forEach(e => e.draw());
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    projs.forEach(e => e.draw());
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'white'
    ctx.fillText("Time: " + ((Date.now() - startTime)/1000), 10, 50);
    ctx.fillText("Wave: " + wave, 10, 100);
}

function waveNext() {
    wave++;
    audioWave.play();
}

function mousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height; 
    var mx = (evt.clientX - rect.left - root.scrollLeft) * scaleX;
    var my = (evt.clientY - rect.top - root.scrollTop) * scaleY;
    return {
        mx, my
    }
}

function win() {
    let win = new Audio('audio/win.wav');
    win.play();
    alert("You win! Time: " + ((Date.now() - startTime)/1000));
}

function lose() {
    let lose = new Audio('audio/lose.wav');
    lose.play();
    alert("You lose! Wave reached: " + wave);
    location.reload();
}

function playBoom() {
    audioBoom.currentTime = 0;
    audioBoom.play();
}

//https://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
function drawImage(image, x, y, scale, rotation){
    ctx.setTransform(scale, 0, 0, scale, x, y); 
    ctx.rotate(rotation);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
} 

//https://stackoverflow.com/questions/25095548/how-to-draw-a-circle-in-html5-canvas-using-javascript
function drawCircle(x, y, radius, fill, stroke = false, strokeWidth = 0) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    if (stroke) {
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    }
    ctx.closePath();
}

//modified from https://stackoverflow.com/questions/53288059/loading-multiple-images-with-javascript
function loadImages(names, onAllLoaded) {
    var i = 0, numLoading = names.length;
    const onload = () => --numLoading === 0 && onAllLoaded();
    const images = {};
    while (i < names.length) {
        const img = images[names[i]] = new Image;
        img.src = "img/" + names[i] + ".png";
        img.onload = onload;
        i++;
    }   
    return images;
}

//https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

//https://stackoverflow.com/questions/63970781/js-how-to-lerp-rotation-in-radians
function rLerp (startAngle, tagetAngle, t){
    let CS = (1-t)*Math.cos(startAngle) + t*Math.cos(tagetAngle);
    let SN = (1-t)*Math.sin(startAngle) + t*Math.sin(tagetAngle);
    return Math.atan2(SN,CS);
}

//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}