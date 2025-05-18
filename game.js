export class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'game' });
    this.jugador = null;
    this.cursors = null;
  }

  preload() {
    this.load.image('background', 'images/background.png');
    this.load.image('gameover', 'images/gameover.png');
    this.load.spritesheet('jugador', 'images/player.png', {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet('run', 'images/Run.png', {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet('jump', 'images/Jump.png', {
      frameWidth: 96,
      frameHeight: 96
    });
  }

  create() {
    this.add.image(400, 250, 'background').setDisplaySize(800, 500);
    this.gameoverImage = this.add.image(400, 90, 'gameover');
    this.gameoverImage.setVisible(false);

    this.jugador = this.physics.add.sprite(400, 250, 'jugador');
    this.jugador.setCollideWorldBounds(true);
    this.jugador.setScale(1.5);
    this.jugador.setMaxVelocity(500, 800);
    this.jugador.setBounce(0);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 480, null).setDisplaySize(800, 20).refreshBody();
    this.physics.add.collider(this.jugador, this.platforms);

    // Animacion de estar quieto
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    // Animacion de correr
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('run', { start: 0, end: 5 }),
      frameRate: 12,
      repeat: -1
    });

    // Animacion de Saltar
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }),
      frameRate: 8,
      repeat: 0
    });

    this.jugador.play('idle');
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.jugador.setVelocityX(0);
    let moving = false;

    if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(200);
      this.jugador.flipX = false;
      if (this.jugador.body.onFloor()) {
        this.jugador.play('run', true);
      }
      moving = true;
    } else if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-200);
      this.jugador.flipX = true;
      if (this.jugador.body.onFloor()) {
        this.jugador.play('run', true);
      }
      moving = true;
    }


    if (this.cursors.up.isDown && this.jugador.body.onFloor()) {
      this.jugador.play('jump', true);
      this.time.delayedCall(80, () => {
        this.jugador.setVelocityY(-450);
      });
    }


    if (!this.jugador.body.onFloor() && this.jugador.body.velocity.y > 0) {
      this.jugador.play('jump', true);
    }


    if (!moving && this.jugador.body.onFloor()) {
      this.jugador.play('idle', true);
    }


    if (this.jugador.y > 500) {
      this.gameoverImage.setVisible(true);
      this.jugador.setTint(0xff0000);
      this.physics.pause();
    }
  }
}

