class Form {
  constructor() {
    this.titleImage = createImg("assets/title.png");
    this.input = createInput("").attribute("placeholder", "Enter your username");
    this.playButton = createButton("Play");
    this.greeting = createElement("h1");
  }

  setElementsPositions() {
    this.titleImage.position(width / 8, 50);
    this.input.position(width / 2 - 120, height / 2 - 50);
    this.playButton.position(width / 2 - 100, height / 2);
    this.greeting.position(width / 2 - 300, 300);
  }

  setElementsStyle() {
    this.titleImage.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  handleButtonPress() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();

      var name = this.input.value();
      var message = `Hello ${name}! <br> Wating for player to join game...`;
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.i = playerCount;
      player.addPlayer();
      player.getDistance();
      player.updateCount(playerCount);
    });
  }

  hide() {
    this.input.hide();
    this.playButton.hide();
    this.greeting.hide();
  }

  show() {
    this.setElementsPositions();
    this.setElementsStyle();
    this.handleButtonPress();
  }
}