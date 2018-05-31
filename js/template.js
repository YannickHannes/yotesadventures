// VARS

var myGamePiece;
var myBackground;
var myObstacles = [];
var mySound;
var myMusic;

var startGameButton = document.getElementById('startGameButton');

var canvasHolder = document.getElementById('canvasHolder');

var introScreen = document.getElementById('introScreen');

var menuButton = document.getElementById('menuButton');
var menuResume = document.getElementById('menuResume');
var menuRestart = document.getElementById('menuRestart');
var menu = document.getElementById('menu');

var score = document.getElementById("score");
var scoreMenu = document.getElementById("scoreMenu");
var highscore = document.getElementById("highscore");

var whiteOverlay = document.getElementById("whiteOverlay");

var soundButton = document.getElementById("sound");
var musicButton = document.getElementById("music");
var soundImage = document.getElementsByClassName("soundHolder")[0];
var musicImage = document.getElementsByClassName("musicHolder")[0];

var placesVisited = document.getElementById("placesVisited");
var placeBack = document.getElementById("placeBack");

var tel = 1;

// SCORE

var c = 0;
var t;
var timer_is_on = 0;

function timedCount() {
    score.innerHTML = c+'m';
    scoreMenu.innerHTML = c+'m';
    c = c + 1 * 5;
    t = setTimeout(function(){ timedCount() }, 1000);
}
function startCount() {
    if (!timer_is_on) {
        timer_is_on = 1;
        timedCount();
    }
}
function stopCount() {
    clearTimeout(t);
    timer_is_on = 0;
}

// SCORE

// STARTBUTTON

startGameButton.onclick = function(){
  canvasHolder.className = "canvasHolder none";
}

// STARTBUTTON

// INTROSCREEN

introScreen.onclick = function(){
  startGame();
  introScreen.className = "canvasHolder none";
  timedCount();
  myMusic = new sound("music/backgroundMusic.mp3");
  myMusic.play();
}

// INTROSCREEN

// TOGGLE MUSIC

musicButton.onclick = function(){
      if (musicImage.className == "imageHolder musicHolderOff") {
          musicImage.className = "imageHolder musicHolder";
          myMusic.play();
      } else {
          musicImage.className = "imageHolder musicHolderOff";
          myMusic.stop();
      }
}

// TOGGLE MUSIC

// TOGGLE SOUND

soundButton.onclick = function(){
      if (soundImage.className == "imageHolder soundHolderOff") {
          soundImage.className = "imageHolder soundHolder";
          mySound.play();
      } else {
          soundImage.className = "imageHolder soundHolderOff";
          mySound.stop();
      }
}

// TOGGLE SOUND

// TOGGLE PLACES

placesVisited.onclick = function(){
  document.getElementById("places").className = "canvasHolder block";
}

placeBack.onclick = function(){
  document.getElementById("places").className = "canvasHolder none";
}

// TOGGLE PLACES

// MENU

menuButton.onclick = function(){
  if (localStorage.getItem("HighestScore") < c) {
    geven();
  }
  function geven(){
  localStorage.setItem("HighestScore", c);
  }
  highscore.innerHTML = localStorage.getItem("HighestScore") - 5+'m';
  myGameArea.stop();
  menu.className = "menuHolder";
  stopCount();
  menuResume.className = "block";
  menuRestart.className = "none";
  whiteOverlay.className = "canvasHolder";
}

menuResume.onclick = function(){
  myGameArea.start();
  menu.className = "menuHolder none";
  whiteOverlay.className = "canvasHolder none";
  timedCount();
}

// MENU

// STARTGAME

function startGame() {
    myGamePiece = new component(40, 55, "img/character-down.png", 10, 120, "image");
    myBackground = new component(656, 270, "img/backgroundZero.png", 0, 0, "background");
    mySound = new sound("music/pat.mp3");
    myObstacles = [];
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;

}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image,
                this.x + this.width,
                this.y,
                this.width, this.height);
        }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }
    this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
        this.y = rockbottom;
        this.gravitySpeed = 0;
    }
    var rocktop = 0;
    if (this.y < rocktop) {
      this.y  = rocktop;
      this.gravitySpeed = 0;
    }

    // Mogelijke toepassing raak de bodem = game over

    //
    // if (this.type == "image") {
    //   if (this.y == rockbottom) {
    //     myGameArea.stop();
    //     return;
    //   }
    // }
}

    this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
           (mytop > otherbottom) ||
           (myright < otherleft) ||
           (myleft > otherright)) {
       crash = false;
    }
    return crash;
}
}

function updateGameArea() {
// HIGHSCORE

  if (localStorage.getItem("HighestScore") < c) {
    geven();
  }
  function geven(){
  localStorage.setItem("HighestScore", c);
  }
  highscore.innerHTML = localStorage.getItem("HighestScore") - 5+'m';

// HIGHSCORE

  var x, y;
  for (i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        if (localStorage.getItem("HighestScore") < c) {
          geven();
        }
        function geven(){
        localStorage.setItem("HighestScore", c);
        }
        highscore.innerHTML = localStorage.getItem("HighestScore") - 5+'m';
        stopCount();
        mySound.play();
        c = 0;
        menu.className = "menuHolder";
        menuResume.className = "none";
        menuRestart.className = "block";
        myGameArea.stop();
        return;
        tel = 0;
      }
  }
        myGameArea.clear();
        myBackground.speedX = -1;
        myBackground.newPos();
        myBackground.update();
        myGameArea.frameNo += 1;
        tel = tel + 1;
        x = myGameArea.canvas.width;
        minHeight = 50;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 75;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        randomPosition1 = Math.floor(Math.random() * 135) + 1;
        randomPosition2 = Math.floor(Math.random() * 270) + 135;

        // BACKGROUND IMAGES + OBSTACLES CHANGES
        if (tel < 1500) {

          if ( myGameArea.frameNo == 1 || everyinterval(150)) {
            myObstacles.push(new component(30, 27, "img/obstacleZero.png" , x, randomPosition1, "image"));
          }
          if ( myGameArea.frameNo == 2 || everyinterval(100)) {
            myObstacles.push(new component(30, 27, "img/obstacleZero.png" , x, randomPosition2, "image"));
          }

        } else if (tel > 2000 && tel < 4000) {
          myBackground.image.src = "img/backgroundOne.png";
          if ( myGameArea.frameNo == 1 || everyinterval(150)) {
              myObstacles.push(new component(20, height - 20, "img/obstacleOneDown.png" , x, 0, "image"));
              myObstacles.push(new component(20,  x - height - gap, "img/obstacleOneUp.png" , x, height + gap, "image"));
          }

        }  else if (tel > 4500 && tel < 6000) {
          myBackground.image.src = "img/backgroundTwo.png";

          if ( myGameArea.frameNo == 1 || everyinterval(150)) {
              myObstacles.push(new component(40, 25, "img/obstacleTwo.png" , x, randomPosition1, "image"));
            }
          if ( myGameArea.frameNo == 2 || everyinterval(100)) {
              myObstacles.push(new component(40, 25, "img/obstacleTwo.png" , x, randomPosition2, "image"));
            }

        } else if (tel > 6500 && tel < 8000) {
            myBackground.image.src = "img/backgroundThree.png";
            if ( myGameArea.frameNo == 1 || everyinterval(150)) {
              myObstacles.push(new component(40, 25, "img/obstacleThree.png" , x, randomPosition1, "image"));
            }
            if ( myGameArea.frameNo == 2 || everyinterval(100)) {
              myObstacles.push(new component(40, 25, "img/obstacleThree.png" , x, randomPosition2, "image"));
            }

        } else if (tel > 8500 && tel < 10000) {
              myBackground.image.src = "img/backgroundFour.png";
              if ( myGameArea.frameNo == 1 || everyinterval(150)) {
                  myObstacles.push(new component(30, height - 20, "img/obstacleFourDown.png" , x, 0, "image"));
                  myObstacles.push(new component(30, x - height - gap, "img/obstacleFourUp.png" , x, height + gap, "image"));
                }
        } else if (tel > 10500 && tel < 12000) {
                  myBackground.image.src = "img/backgroundFive.png";
              if ( myGameArea.frameNo == 1 || everyinterval(150)) {
                  myObstacles.push(new component(25, 40, "img/obstacleFive.png" , x, randomPosition1, "image"));
              }
              if ( myGameArea.frameNo == 2 || everyinterval(100)) {
                  myObstacles.push(new component(25, 40, "img/obstacleFive.png" , x, randomPosition2, "image"));
              }
        } else if (tel > 12500 && tel < 14000) {
                  myBackground.image.src = "img/backgroundSix.png";
                if ( myGameArea.frameNo == 1 || everyinterval(150)) {
                    myObstacles.push(new component(30, height - 20, "img/obstaclesix.png" , x, 0, "image"));
                    myObstacles.push(new component(30, x - height - gap, "img/obstaclesix.png" , x, height + gap, "image"));
                }
        } else if (tel > 14500 && tel < 16000) {
                  myBackground.image.src = "img/backgroundEight.png";
                  if ( myGameArea.frameNo == 1 || everyinterval(150)) {
                      myObstacles.push(new component(30, height - 20, "img/obstacleEight.png" , x, 0, "image"));
                      myObstacles.push(new component(30, x - height - gap, "img/obstacleEight.png" , x, height + gap, "image"));
                  }
        }
        // BACKGROUND IMAGES + OBSTACLES CHANGES

        //PLACES VISITED

          if (localStorage.getItem("HighestScore") > 0) {
            document.getElementById("landOne").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 250) {
            document.getElementById("landTwo").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 450) {
            document.getElementById("landThree").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 650) {
            document.getElementById("landFour").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 850) {
            document.getElementById("landFive").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 1050) {
            document.getElementById("landSix").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 1250) {
            document.getElementById("landSeven").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 1450) {
            document.getElementById("landEight").className = "placeOff";
          }
          if (localStorage.getItem("HighestScore") > 1650) {
            document.getElementById("landNine").className = "placeOff";
          }

          //PLACES VISITED

          for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
          }
          myGamePiece.newPos();
          myGamePiece.update();
        }


        function accelerate(n) {
          myGamePiece.gravity = n;
          myGamePiece.image.src = "img/character-up.png";
        }

// FLY

var butgo = document.getElementById("Move_up");

butgo.ontouchstart = function(){
    myGamePiece.image.src = "img/character-up.png";
    myGamePiece.gravity = -.25;
}
butgo.ontouchend = function(){
    myGamePiece.image.src = "img/character-down.png";
    myGamePiece.gravity = .1;
}


// FLY

// SOUND

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// SOUND

// RESTART

menuRestart.onclick = function(){
    menu.className = "menuHolder none";
    myGameArea.stop();
    myGameArea.clear();
    startGame();
    startCount();
    tel = 0;
}

// RESTART
