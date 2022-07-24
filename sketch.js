var bg;
var bear;
var bear2;
var beeImg;
var beeGroup;
var appleGroup
var canvas;
var database, gameState;
var form, player, playerCount,game;
var allPlayers, car1, car2;
var bears = [];
var fuel;
var goldCoin;
var  obstacle2Image ;
var  obstacle1Image ;
var fuels,goldCoins,obstacles;
var slip;
var apple;


function preload(){
  bg = loadImage("background.png")
  bearImg = loadImage("bear.png")
  bear2Img = loadImage("bear2.png")
  beeImg = loadImage("bee.png")
  trackImg = loadImage("track.jpg")
  appleImg = loadImage("apple.png")
  slip = loadImage("slippingBear.png")
}

function setup() {
  createCanvas(displayWidth,displayHeight - 140);

 database = firebase.database();
game = new Game();
game.getState();
game.start();
 //form = new Form()
 //form.display()
}

function draw() {
  background(bg);  
  //image(trackImg,450,-height*5,width-900,height*6)

  if (keyIsDown(UP_ARROW)) {
    bear.velocityY = 10
  }
 //bear.y = camera.position.y
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
//drawSprites();
}
