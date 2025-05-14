export class Game extends Phaser.Scene {

    constructor() {
      super({ key: 'game' });
    }
  
    preload() {
      this.load.image('background', 'images/background.png');
      this.load.image('gameover', 'images/gameover.png');
    }
  
    create() {
      this.add.image(400, 250, 'background').setDisplaySize(800, 500);
      this.gameoverImage = this.add.image(400, 90, 'gameover');
    }
  
  }