export class Nivel2 extends Phaser.Scene {
  constructor() {
    super({ key: 'nivel2' });
    this.jugador = null;
    this.cursors = null;
    this.plataformaActual = null;
  }

  preload() {
    this.load.image('agua', 'images/agua1.png');
    this.load.image('arboles', 'images/arboles1.png');
    this.load.image('gameover', 'images/gameover.png');
    this.load.spritesheet('jugador', 'images/player.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('run', 'images/Run.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('jump', 'images/Jump.png', { frameWidth: 96, frameHeight: 96 });
    this.load.image('hielo', 'images/plataforma_de_hielo-removebg-preview.png');
    this.load.image('bloque', 'images/bloque.png');
    this.load.spritesheet('pajaro', 'images/pajaro.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.add.image(0, 150, 'agua').setOrigin(0, 0).setScale(1.1, 1).setDepth(0);
    this.add.image(0, -180, 'arboles').setOrigin(0, 0).setScale(0.42).setDepth(1);
    this.gameoverImage = this.add.image(400, 90, 'gameover').setVisible(false);

    this.jugador = this.physics.add.sprite(400, 80, 'jugador')
      .setCollideWorldBounds(false)
      .setScale(1.5)
      .setMaxVelocity(500, 800)
      .setBounce(0)
      .setDepth(2)
      .setSize(38, 45)
      .setOffset(30, 50);

    this.pajaros = this.physics.add.group({ allowGravity: false, immovable: true });
    this.platforms = this.physics.add.staticGroup();

    const baseTransparente = this.add.rectangle(400, 166, 800, 10, 0x000000, 0);
    this.physics.add.existing(baseTransparente, true);
    baseTransparente.body.checkCollision.up = true;
    baseTransparente.body.checkCollision.down = false;
    this.platforms.add(baseTransparente);

    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });

    const filas = [
      { y: 490, dir: 1 },
      { y: 410, dir: -1 },
      { y: 330, dir: 1 },
      { y: 250, dir: -1 } 
    ];

    const anchoReal = this.textures.get('hielo').getSourceImage().width * 0.5;
    const espacio = anchoReal + 5;

    filas.forEach(fila => {
      const cantidad = 6;

      for (let i = 0; i < cantidad; i++) {
        const x = 70 + espacio * i;
        const plataforma = this.movingPlatforms.create(x, fila.y, 'hielo')
          .setScale(0.3)
          .setVelocityX(100 * fila.dir);
        plataforma.setData('dir', fila.dir);
        plataforma.body.checkCollision.up = true;
        plataforma.body.checkCollision.down = false;

        const bodyHeight = plataforma.height * 0.3;
        const offsetY = plataforma.height * 0.1;

        plataforma.setSize(160, bodyHeight);
        plataforma.setOffset(0, offsetY);
      }
    });

    this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('run', { start: 0, end: 5 }), frameRate: 12, repeat: -1 });
    this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }), frameRate: 8, repeat: 0 });
    this.anims.create({ key: 'volar', frames: this.anims.generateFrameNumbers('pajaro', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });

    this.jugador.play('idle');
    this.cursors = this.input.keyboard.createCursorKeys();

    const crearPajaro = (x, y, velocidadX) => {
      const pajaro = this.pajaros.create(x, y, 'pajaro');
      pajaro.play('volar');
      pajaro.setVelocityX(velocidadX);
      pajaro.setDepth(2);
      pajaro.setScale(1);
      pajaro.body.setSize(20, 20);
      pajaro.body.setOffset(5, 5);
      if (velocidadX < 0) pajaro.setFlipX(true);
    };

    // ✅ Pájaros en la fila más alta (fila 3 visualmente)
    crearPajaro(-50, filas[3].y - 50, 85);
    crearPajaro(-150, filas[3].y - 50, 85);

    const permitirAtravesar = (jugador, plataforma) => {
      const tocandoDesdeArriba = jugador.body.velocity.y >= 0 && jugador.body.bottom <= plataforma.body.top + 10;
      if (tocandoDesdeArriba && this.cursors.down.isDown) {
        jugador.body.checkCollision.down = false;
        this.time.delayedCall(250, () => {
          jugador.body.checkCollision.down = true;
        });
      }
    };

    this.ultimoBloqueAgregado = false;
    this.physics.add.collider(this.jugador, this.platforms, permitirAtravesar);
    this.physics.add.collider(this.jugador, this.movingPlatforms, (jugador, plataforma) => {
      permitirAtravesar(jugador, plataforma);
      if (jugador.body.touching.down && plataforma.body.touching.up) {
        this.plataformaActual = plataforma;
        if (!this.ultimoBloqueAgregado) {
          this.agregarBloqueIglu();
          this.ultimoBloqueAgregado = true;
        }
      } else {
        this.ultimoBloqueAgregado = false;
      }
    });

    this.physics.add.overlap(this.jugador, this.pajaros, (jugador, pajaro) => {
      this.gameoverImage.setVisible(true);
      jugador.setTint(0xff0000);
      this.physics.pause();
    });

    const pauseButton = this.add.text(750, 20, '⏸', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0).setInteractive();

    pauseButton.on('pointerdown', () => {
      this.scene.launch('pausamenu');
      this.scene.pause();
    });

    this.bloques = 0;
    this.maxBloques = 14;
    this.igluPosiciones = [
      { x: 600, y: 450 }, { x: 630, y: 450 }, { x: 690, y: 450 }, { x: 720, y: 450 },
      { x: 600, y: 420 }, { x: 630, y: 420 }, { x: 660, y: 420 }, { x: 690, y: 420 },
      { x: 620, y: 390 }, { x: 650, y: 390 }, { x: 680, y: 390 },
      { x: 635, y: 360 }, { x: 665, y: 360 },
      { x: 650, y: 330 }
    ];

    this.agregarBloqueIglu = () => {
      if (this.bloques >= this.maxBloques) return;
      const pos = this.igluPosiciones[this.bloques];
      const bloque = this.add.image(pos.x, pos.y, 'bloque');
      bloque.setScale(0.3);
      this.bloques++;

      if (this.bloques === this.maxBloques) {
        console.log("¡Iglú completo! Nivel terminado.");
        this.time.delayedCall(1000, () => {
          this.scene.start('menu'); // Cambiar a otra escena si lo deseas
        });
      }
    };
  }

  update() {
    if (this.plataformaActual &&
        this.jugador.body.onFloor() &&
        this.jugador.body.velocity.x === 0) {
      this.jugador.x += this.plataformaActual.body.velocity.x * this.game.loop.delta / 1000;
    } else {
      this.plataformaActual = null;
    }

    this.jugador.setVelocityX(0);
    let moving = false;

    if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(200);
      this.jugador.flipX = false;
      if (this.jugador.body.onFloor()) this.jugador.play('run', true);
      moving = true;
    } else if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-200);
      this.jugador.flipX = true;
      if (this.jugador.body.onFloor()) this.jugador.play('run', true);
      moving = true;
    }

    if (this.cursors.up.isDown && this.jugador.body.onFloor()) {
      this.jugador.play('jump', true);
      this.time.delayedCall(80, () => this.jugador.setVelocityY(-450));
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

    this.movingPlatforms.children.iterate(plataforma => {
      if (plataforma.x < -plataforma.displayWidth / 2) {
        plataforma.x = 800 + plataforma.displayWidth / 2;
      } else if (plataforma.x > 800 + plataforma.displayWidth / 2) {
        plataforma.x = -plataforma.displayWidth / 2;
      }
    });

    this.pajaros.children.iterate(pajaro => {
      if (pajaro.x > 900) {
        pajaro.x = -100;
      }
    });
  }
}
