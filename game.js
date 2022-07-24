class Game {
    constructor() {
      this.resetTitle = createElement("h2");
      this.resetButton = createButton();
  
      this.leaderBoardTitle = createElement("h2")
      this.leader1 = createElement("h2")
      this.leader2 = createElement("h2")
      this.playerMoving = false;
      this.leftKeyActive = false;
      this.slip = false;
    }
  
    handleResetButton() {
      this.resetButton.mousePressed(()=> {
        database.ref("/").set({
          playerCount:0,
          gameState:0,
          players:{},
          bearsAtEnd:0
        })
        window.location.reload()
      })
    }
  
    getState() {
      var gameStateRef = database.ref("gameState");
      gameStateRef.on("value", function(data) {
        gameState = data.val();
      });
    }
    update(state) {
      database.ref("/").update({
        gameState: state
      });
    }
  
    start() {
      player = new Player();
      playerCount = player.getCount();
  
      form = new Form();
      form.display();
  
      bear = createSprite(displayWidth - 950,displayHeight - 300);
      bear.addImage("bear",bearImg)
      bear.addImage("slippingBear",slip)
      bear.scale = 0.3;
     
      bear2 = createSprite(displayWidth - 550,displayHeight - 300);
      bear2.addImage("bear2",bear2Img)
      bear2.addImage("slippingBear",slip)
      bear2.scale = 0.3;
     
  
      bears = [bear, bear2];
  
      fuels =new Group()
      goldCoins = new Group()
      obstacles = new Group()
      beeGroup = new Group()
      this.addSprites(beeGroup,10,beeImg,0.05)
      appleGroup = new Group()
      this.addSprites(appleGroup,8,appleImg,0.1)
  
      //this.addSprites(fuels,4,fuel,0.02)
      //this.addSprites(goldCoins,18,goldCoin,0.09)
  
      var obstaclesPositions = [
        { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
        { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
        { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
        { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
        { x: width / 2, y: height - 2800, image: obstacle2Image },
        { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
        { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
        { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
        { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
        { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
        { x: width / 2, y: height - 5300, image: obstacle1Image },
        { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
      ];
      //this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)
  
    }
     handleFuel(index){
       bears[index-1].overlap(fuels,function(collector,collected){
         player.fuel = 185
         collected.remove()
  
       })
       if(player.fuel>0&&this.playerMoving){
        player.fuel-=0.3
       }
       if(player.fuel<=0){
         gameState = 2
         this.gameOver()
       }
     }
  
     handleGoldCoins(index){
       bears[index-1].overlap(appleGroup,function(collector,collected){
         player.score +=21
         player.update()
         collected.remove()
       })
     }
     addSprites(spriteGroup,numberOfSprites,spriteImage,scale,positions = []){
      for(var i = 0;i<numberOfSprites;i++){
        var x,y
  
        if(positions.length>0) {
         x = positions[i].x
         y = positions[i].y
         spriteImage = positions[i].image
        }
        else{
          x = random(width/2 + 150,width/2 - 150)
          y = random(-height*4.5,height-400)
        }
       
        var sprite = createSprite(x,y)
        sprite.addImage("sprite",spriteImage)
        sprite.scale = scale
        spriteGroup.add(sprite)
      }
    }
  
  
    handleElements() {
      form.hide();
      //form.titleImg.position(40, 50);
      //form.titleImg.class("gameTitleAfterEffect");
  
      this.resetTitle.html("resetGame")
      this.resetTitle.class("resetText")
      this.resetTitle.position(width/2 + 200,40)
      
      this.resetButton.class("resetButton")
      this.resetButton.position(width/2 + 230,100)
  
      this.leaderBoardTitle.html("LeaderBoard")
      this.leaderBoardTitle.class("resetText")
      this.leaderBoardTitle.position(width/3 - 60,40)
  
      this.leader1.class("leadersText")
      this.leader1.position(width/3 -50,80)
      this.leader2.class("leadersText")
      this.leader2.position(width/3 - 50,130)
    }
  
    play() {
      this.handleElements();
      this.handleResetButton();
      Player.getPlayersInfo();
      player.getBearsAtEnd();
      
      if (allPlayers !== undefined) {
        //image(track, 0, -height * 5, width, height * 6);
        image(trackImg,0,-height*5,width,height*6)
        this.showLife()
        this.showFuelBar()
        this.showLeaderboard()
        //index of the array
        var index = 0;
        for (var plr in allPlayers) {
          //add 1 to the index for every loop
          index = index + 1;
  
          //use data form the database to display the bears in x and y direction
          var x = allPlayers[plr].positionX;
          var y = height - allPlayers[plr].positionY;
          var currentLife = allPlayers[plr].life
          if (currentLife <= 0) {
            bears[index-1].changeImage("slippingBear")
            bears[index-1].scale = 0.3
          }
  
          bears[index - 1].position.x = x;
          bears[index - 1].position.y = y;
  
          if (index === player.index) {
            stroke(10);
            fill("red");
            ellipse(x, y, 60, 60);
  
            this.handleFuel(index)
            this.handleGoldCoins(index)
            this.handleObstaclesCollision(index)
            this.handleCarACollisionWithCarB(index)
            if(player.life<=0){
              this.slip = true
              this.playerMoving = false
  
            }
            // Changing camera position in y direction
            //camera.position.x = bears[index - 1].position.x;
            camera.position.y = bears[index - 1].position.y;
  
  
          }
        }
        if(this.playerMoving){
          player.positionY+=5
          player.update()
        }
        this.handlePlayerControls();
        const finishLine = height*6-100
        if(player.positionY>finishLine){
          gameState = 2
          player.rank += 1
          Player.updateBearsAtEnd(player.rank)
          player.update()
          this.showRank()
        }
  
        drawSprites();
      }
    }
  
    showRank(){
      swal({
        title:`Awesome!${"\n"} Rank${"\n"}${player.rank}`,
        text:"You Reached The Finished Line Succesfully",
        imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
        ImageSize:"100x100",
        confirmButtonText:"Ok"
      })
    }
    handlePlayerControls() {
      if (!this.slip) {
        
      
      // handling keyboard events
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }
      if(keyIsDown(LEFT_ARROW)){
        this.leftKeyActive = true
        player.positionX -= 5;
        player.update();
      }
      if(keyIsDown(RIGHT_ARROW)){
        this.leftKeyActive = false
        player.positionX += 5;
        player.update();
      }
      }
    }
    showLeaderboard() {
      var leader1, leader2;
      var players = Object.values(allPlayers);
      if (
        (players[0].rank === 0 && players[1].rank === 0) ||
        players[0].rank === 1
      ) {
        // &emsp;    This tag is used for displaying four spaces.
        leader1 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
  
        leader2 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
      }
  
      if (players[1].rank === 1) {
        leader1 =
          players[1].rank +
          "&emsp;" +
          players[1].name +
          "&emsp;" +
          players[1].score;
  
        leader2 =
          players[0].rank +
          "&emsp;" +
          players[0].name +
          "&emsp;" +
          players[0].score;
      }
  
      this.leader1.html(leader1);
      this.leader2.html(leader2);
    }
    showLife()
    {
      push()
      //image(life,width/2-130,height-player.positionY-200,20,20)
      fill ("white")
      rect (width/2-100,height-player.positionY-200,185,20)
      fill ("#f50057")
      rect (width/2-100,height-player.positionY-200,player.life,20)
      noStroke()
      pop()
    }
    showFuelBar()
    {
      push()
      //image(fuel,width/2-130,height-player.positionY-100,20,20)
      fill ("white")
      rect(width/2-100,height-player.positionY-100,185,20)
      fill ("#ffc400")
      rect (width/2-100,height-player.positionY-100,player.fuel,20)
      noStroke()
      pop()
    }
    gameOver(){
      swal({
        title:`Game Over!`,
        text:"Oops You lost the race!",
        imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
        ImageSize:"100x100",
        confirmButtonText:"Thanks For Playing!"
      })
    }
    handleObstaclesCollision(index){
      if(bears[index -1].collide(beeGroup)){
        if (this.leftKeyActive ) {
          player.positionX += 100
        } else {
          player.positionX -= 100
        }
        if (player.life > 0) {
          player.life -= 185/4
        }
        player.update()
      }
    }
  
    handleCarACollisionWithCarB(index){
      if(index == 1){
        if (bears[index-1].collide(bears[1])) {
          if (this.leftKeyActive) {
            player.positionX += 100
          } else {
            player.positionX -= 100
          }
          if (player.life>0) {
            player.life -= 185/4
          }
          player.update()
        }
      }
      if(index == 2){
        if (bears[index-1].collide(bears[0])) {
          if (this.leftKeyActive) {
            player.positionX += 100
          } else {
            player.positionX -= 100
          }
          if (player.life>0) {
            player.life -= 185/4
          }
          player.update()
        }
      }
    }
  
  }
  
  