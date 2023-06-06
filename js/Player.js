class Player {
  constructor() {
    this.name = null;
    this.positionX = 0;
    this.positionY = 0;
    this.i = null;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
  }

  getCount() {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", (data) => {
      playerCount = data.val();
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  addPlayer() {
    var playerIndex = "players/player" + this.i;

    if (this.i == 1) {
      this.positionX = width / 2 - 100;
    } else {
      this.positionX = width / 2 + 100;
    }

    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      fuel: this.fuel,
      life: this.life
    });
  }

  static getPlayersInfo() {
    var playerIndexRef = database.ref("players");

    playerIndexRef.on("value", (data) => {
      allPlayers = data.val();
    });
  }

  update() {
    database.ref("players/player" + this.i).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      fuel: this.fuel,
      life: this.life
    });
  }

  getDistance() {
    database.ref("players/player" + this.i).on("value", (data) => {
      var p = data.val();
      this.positionX = p.positionX;
      this.positionY = p.positionY;
    });
  }

  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", (data) => {
      this.rank = data.val();
    });
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }
}