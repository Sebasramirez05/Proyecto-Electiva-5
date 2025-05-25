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
    this.load.image('hielo', 'images/plataforma_de_hielo-removebg-preview.png');
  }

  create() {
  // Fondo
  this.add.image(400, 250, 'background').setDisplaySize(800, 500);

  // Game Over (oculto al inicio)
  this.gameoverImage = this.add.image(400, 90, 'gameover').setVisible(false);

  // Crear jugador
  this.jugador = this.physics.add.sprite(400, 50, 'jugador');
  this.jugador.setCollideWorldBounds(true);
  this.jugador.setScale(1.5);
  this.jugador.setMaxVelocity(500, 800);
  this.jugador.setBounce(0);

  // Crear grupo de plataformas fijas
  this.platforms = this.physics.add.staticGroup();

  // Crear la base blanca (plataforma grande inferior)
  const base = this.add.rectangle(400, 150, 800, 50, 0xffffff);
  this.physics.add.existing(base, true);
  this.platforms.add(base);

  // Crear grupo de plataformas móviles
  this.movingPlatforms = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  const positions = [
    { x: 100, y: 350, dir: 1 },
    { x: 300, y: 300, dir: -1 },
    { x: 500, y: 200, dir: 1 }
  ];

  positions.forEach(p => {
    const plataforma = this.movingPlatforms.create(p.x, p.y, 'hielo');
    plataforma.setVelocityX(100 * p.dir);
    plataforma.setData('dir', p.dir);
  });

  // Animaciones
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('run', { start: 0, end: 5 }),
    frameRate: 12,
    repeat: -1
  });

  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }),
    frameRate: 8,
    repeat: 0
  });

  this.jugador.play('idle');
  this.cursors = this.input.keyboard.createCursorKeys();

  // Función para permitir atravesar plataformas si se presiona flecha abajo
  const permitirAtravesar = (jugador, plataforma) => {
    const tocandoDesdeArriba =
      jugador.body.velocity.y >= 0 &&
      jugador.body.bottom <= plataforma.body.top + 10;

    if (tocandoDesdeArriba && this.cursors.down.isDown) {
      jugador.body.checkCollision.down = false;
      this.time.delayedCall(250, () => {
        jugador.body.checkCollision.down = true;
      });
    }
  };

  // Colisiones
  this.physics.add.collider(this.jugador, this.platforms, permitirAtravesar);
  this.physics.add.collider(this.jugador, this.movingPlatforms, (jugador, plataforma) => {
    permitirAtravesar(jugador, plataforma);
    if (jugador.body.touching.down && plataforma.body.touching.up) {
      jugador.x += plataforma.body.velocity.x * this.game.loop.delta / 1000;
    }
  });
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

