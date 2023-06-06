class Game {
  constructor() {
    this.resetButton = createButton("");
    this.resetTitle = createElement("h2");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", (data) => {
      gameState = data.val();

    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    form = new Form();
    form.show();

    player = new Player();
    playerCount = player.getCount();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.addImage("blast", blastImage);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 50, height - 100);
    car2.addImage("car2", car2_img);
    car2.addImage("blast", blastImage);
    car2.scale = 0.07;

    cars = [car1, car2];

    var obstaclesPositions = [{
      x: width / 2 + 250,
      y: height - 800,
      image: obstacle2Image
    }, {
      x: width / 2 - 150,
      y: height - 1300,
      image: obstacle1Image
    }, {
      x: width / 2 + 250,
      y: height - 1800,
      image: obstacle1Image
    }, {
      x: width / 2 - 180,
      y: height - 2300,
      image: obstacle2Image
    }, {
      x: width / 2,
      y: height - 2800,
      image: obstacle2Image
    }, {
      x: width / 2 - 180,
      y: height - 3300,
      image: obstacle1Image
    }, {
      x: width / 2 + 180,
      y: height - 3300,
      image: obstacle2Image
    }, {
      x: width / 2 + 250,
      y: height - 3800,
      image: obstacle2Image
    }, {
      x: width / 2 - 150,
      y: height - 4300,
      image: obstacle1Image
    }, {
      x: width / 2 + 250,
      y: height - 4800,
      image: obstacle2Image
    }, {
      x: width / 2,
      y: height - 5300,
      image: obstacle1Image
    }, {
      x: width / 2 - 180,
      y: height - 5500,
      image: obstacle2Image
    }];

    powerCoins = new Group();
    fuels = new Group();
    obstacles = new Group();

    this.addSprites(fuels, 4, fuelImage, 0.02);
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, position = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      if (position.length > 0) {
        x = position[i].x;
        y = position[i].y;
        spriteImage = position[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;

      spriteGroup.add(sprite);
    }
  }

  handleElement() {
    form.hide();
    form.titleImage.position(40, 50);
    form.titleImage.class("gameTitleAfterEffect");

    this.resetButton.position(width / 2 + 200, 100);
    this.resetButton.class("resetButton");

    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 165, 50);
    this.resetTitle.html("Reset Game");

    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width / 2 - 360, 50);
    this.leaderBoardTitle.html("Leaderboard");

    this.leader1.class("leadersText");
    this.leader1.position(width / 2 - 300, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 2 - 300, 120);
  }

  play() {
    this.handleElement();
    this.handleResetButton();
    Player.getPlayersInfo();

    player.getCarsAtEnd();

    if (allPlayers != undefined) {
      image(track, 0, -height * 5, width, height * 6);

      this.showLeaderBoard();
      this.showLife();
      this.showFuel();

      var carIndex = 0;

      for (var a in allPlayers) {
        carIndex += 1;

        var x = allPlayers[a].positionX;
        var y = height - allPlayers[a].positionY;

        var currentLife = allPlayers[a].life;
        console.log(currentLife);

        if (currentLife <= 0) {
          cars[carIndex - 1].changeImage("blast");
          cars[carIndex - 1].scale = 0.3;

          this.blast = true;
          this.playerMoving = false;

          //this.gameOver();
        }

        cars[carIndex - 1].position.x = x;
        cars[carIndex - 1].position.y = y;

        if (carIndex == player.i) {
          fill("red");
          ellipse(x, y, 60, 70);

          this.handleFuels(carIndex);
          this.handlePowerCoins(carIndex);

          this.handleCarCollision(carIndex);
          this.handleObstacleCollision(carIndex);

          camera.position.y = cars[carIndex - 1].position.y;
        }
      }
      const finishLine = 5200;

      if (player.positionY > finishLine) {
        gameState = 2;
        player.rank += 1;

        this.update(2);
        Player.updateCarsAtEnd(player.rank);
        this.showRank();
        player.update();
      }

      this.handlePlayerControl();

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  handlePlayerControl() {
    if (!this.blast) {
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();

        this.playerMoving = true;
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 2 - 320) {
        player.positionX -= 2;
        player.update();

        this.leftKeyActive = true;
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 2;
        player.update();

        this.leftKeyActive = false;
      }
    }
  }

  showLeaderBoard() {
    var leader1, leader2;

    var players = Object.values(allPlayers);

    //console.log(players[0].rank);

    if ((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1) {
      leader1 = players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp" +
        players[1].score

      leader2 =
        players[0].rank +
        "&emsp" +
        players[0].name +
        "&emsp" +
        players[0].score
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handleFuels(index) {
    cars[index - 1].overlap(fuels, function (collector, collected) {
      collected.remove();
      player.fuel = 185;
    });

    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;

      this.update(2);
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, (collector, collected) => {
      collected.remove();
      player.score += 50;

      player.update();
    });
  }

  handleObstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }
      if (player.life > 0) {
        player.life -= 185 / 4;
      }
      player.update();
    }
  }

  handleCarCollision(index) {
    if (index == 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
        player.update();
      }
    }

    if (index == 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 100;
        } else {
          player.positionX -= 100;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }
        player.update();
      }
    }
  }

  showFuel() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 200, 20, 20);
    fill("white");
    rect(width / 2 - 130, height - player.positionY - 200, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 130, height - player.positionY - 200, player.fuel, 20);
    noStroke();
    pop();
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 150, 20, 20);
    fill("white");
    rect(width / 2 - 130, height - player.positionY - 150, 185, 20);
    fill("#f50057");
    rect(width / 2 - 130, height - player.positionY - 150, player.life, 20);
    noStroke();
    pop();
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: `Congratulations for finishing the game!`,
      imageUrl: `https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png`,
      textSize: `150x150`,
      confirmButtonText: `Play Again!`
    });
  }

  gameOver() {
    swal({
      title: `Game Over!`,
      text: `YOU SNOOZE, YOU LOSE!`,
      imageUrl: `https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png`,
      textSize: `150x150`,
      confirmButtonText: `Play Again!`
    });
  }

  end() {
    //console.log("Game Over!");
  }
}