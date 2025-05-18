export class Game extends Phaser.Scene {

    constructor() {
      super({ key: 'game' });
    }
  
    preload() {
      this.load.image('background', 'images/background.png');
      this.load.image('gameover', 'images/gameover.png');
      this.load.spritesheet('player', 'images/Larry.png', {
        frameWidth: 20,
        frameHeight:23
      });
    }
  
    create() {
      this.add.image(400, 250, 'background').setDisplaySize(800, 500);
      this.gameoverImage = this.add.image(400, 90, 'gameover');
      this.player = this.physics.add.sprite(400, 500, 'player');
      this.player.setCollideWorldBounds(true);
    }
  
  }