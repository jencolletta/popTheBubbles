/*Initalize canvas*/
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.setAttribute('width', '650');
canvas.setAttribute('height', '640');
var speed = -1;

/*Initalize dot array*/
var dots = [];

/*Starts new game*/
var interval;

/*Timer variables*/
var msec = 0;
var sec = 0;
var min = 0;
var timer;
/*Generates a number between min and max*/
function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*Generate a random color to fill dots*/
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color.toString();
  }

/*gets speed value from slider*/
var speedVal = document.getElementById("speedValue");
speedVal.innerHTML = document.getElementById("speedSlider").value;
document.getElementById("speedSlider").oninput = function() {
    speedVal.innerHTML = this.value;
    speed = Math.ceil(-(this.value)/8)
    return speed;
}

/*Pushes first dot into dot array*/
dots.push({
    x: generateRandomInteger(25, 500),
    y: canvas.height,
    color: getRandomColor(),
    radius: generateRandomInteger(30, 70)
})

/*Creates dot game object*/
function createDot() {
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.closePath();
    });
}

/*Updates game canvas, detects collision of dot with top of canvas */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createDot();
    dots.forEach(dot => {
        if (dot.y + speed > canvas.height || dot.y + speed < 0) {
            speed = -speed;
        }
        if (dot.y + speed <= dot.radius) {
            clearInterval(interval);
            clearTimeout(timer);
            setTimeout(function(){ 
                document.getElementById('gameover').style.display = 'block' 
            }, 1000);

        }
        dot.y += speed;
    });
}

/*Detects if a dot gets clicked on and removes it and adds additional dot after previous dot has been destroyed*/
function getMousePosition(canvas) {
    canvas.addEventListener("mousedown", function (e) {
        let rect = canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        dots.forEach(dot => {
            if (mouseX >= (dot.x - dot.radius + 10) && mouseX <= (dot.x + dot.radius + 10) 
            && mouseY > (dot.y - dot.radius + 10) && mouseY <= (dot.y + dot.radius + 10)) {
                dots.splice(dots.indexOf(dot), 1);
                dots.push({ x: generateRandomInteger(25, 500), y: canvas.height, color: getRandomColor(), radius: generateRandomInteger(30, 70), status: true })

            }
        });
    });
}
getMousePosition(canvas);

/*Starts game when hitting start button*/
function startGame() {
    document.getElementById('start').style.visibility = 'hidden';
    interval = setInterval(draw, 10);
    timer = setInterval(stopWatch, 1000);
}

/*Displays game over/play again button and restarts the game*/
function gameOver() {
    document.getElementById('gameover').style.display = 'hidden';
    document.location.reload();
    clearInterval(interval);
    interval = setInterval(draw, 5);
}

/*Increments timer and adds additional dot after every half a millisecond*/
function stopWatch() {
    msec += 1;
    if (msec%2==1) {
        dots.push({ x: generateRandomInteger(30, 500), y: canvas.height, color: getRandomColor(), radius: generateRandomInteger(30, 70), status: true })
     }
    if (msec == 60) {
        sec += 1;
        msec = 0;
        if (sec == 60) {
            sec = 0;
            min += 1;
        }
    }
    document.getElementById("timer").innerHTML = min + ":" + sec + ":" + msec;
}