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
    this.load.image("bloque", "images/bloque.png")
  }

  create() {
    // Fondo
    this.add.image(400, 250, 'background').setDisplaySize(800, 500);

    // Game Over (oculto al inicio)
    this.gameoverImage = this.add.image(400, 90, 'gameover').setVisible(false);

    // Crear jugador
    this.jugador = this.physics.add.sprite(400, 100, 'jugador');
    this.jugador.setCollideWorldBounds(true);
    this.jugador.setScale(1.5);
    this.jugador.setMaxVelocity(500, 800);
    this.jugador.setBounce(0);
    this.jugador.setDepth(1);

    // Crear grupo de plataformas fijas
    this.platforms = this.physics.add.staticGroup();

    // Crear la base blanca
// Crear la base blanca
const base = this.add.rectangle(400, 150, 800, 50, 0xffffff);
this.physics.add.existing(base, true);

// Ajustar área de colisión: delgada y en la parte superior
base.body.setSize(800, 10); // solo la parte superior
base.body.setOffset(0, 0);

// Solo colisión desde arriba
base.body.checkCollision.up = true;
base.body.checkCollision.down = false;
base.body.checkCollision.left = false;
base.body.checkCollision.right = false;

this.platforms.add(base);


    // Crear grupo de plataformas móviles
this.movingPlatforms = this.physics.add.group({
  allowGravity: false,
  immovable: true
});

// Crear múltiples filas de plataformas móviles intercaladas
const filas = [
  { y: 450, dir: 1 },
  { y: 370, dir: -1 },
  { y: 290, dir: 1 },
  { y: 210, dir: -1 }
];

filas.forEach((fila, index) => {
  const cantidad = 5;
  const anchoPlataforma = 90; // Ajustado para superposición
  const solapamiento = 5;     // Espacio que se superpone
  const espacio = anchoPlataforma - solapamiento;

for (let i = 0; i < cantidad; i++) {
  const x = espacio * (i + 1);
  const plataforma = this.movingPlatforms.create(x, fila.y, 'hielo');
  plataforma.setScale(0.5);
  plataforma.setVelocityX(100 * fila.dir);
  plataforma.setData('dir', fila.dir);

  // Habilitar solo colisión desde arriba
  plataforma.body.checkCollision.up = true;
  plataforma.body.checkCollision.down = false;
  plataforma.body.checkCollision.left = false;
  plataforma.body.checkCollision.right = false;

  // Ajustar hitbox aún más reducido
  const bodyWidth = plataforma.width * 0.3;
  const bodyHeight = plataforma.height * 0.3;
  const offsetX = (plataforma.width - bodyWidth) / 2;
  const offsetY = plataforma.height * 0.1;

  plataforma.setSize(bodyWidth, bodyHeight);
  plataforma.setOffset(offsetX, offsetY);
}


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

    // Permitir atravesar plataformas (saltar desde abajo o flecha abajo)
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

    // Botón de pausa
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

    //para formar el iglu
    this.bloques = 0;
    this.maxBloques = 14;

    this.igluPosiciones = [
      //fila 1
      { x: 600, y: 450 },
      { x: 630, y: 450 },
      { x: 690, y: 450 },
      { x: 720, y: 450 },
       // Fila 2
      { x: 600, y: 420 },
      { x: 630, y: 420 },
      { x: 660, y: 420 },
      { x: 690, y: 420 },
      // Fila 3
      { x: 620, y: 390 },
      { x: 650, y: 390 },
      { x: 680, y: 390 },
      // Fila 4
      { x: 635, y: 360 },
      { x: 665, y: 360 },
      // Fila 5 (techo)
      { x: 650, y: 330 }
  ];

  this.agregarBloqueIglu = () => {
    if (this.bloques >= this.maxBloques) return;

    const pos = this.igluPosiciones[this.bloques];
    const bloque = this.add.image(pos.x, pos.y, 'bloque');
    bloque.setScale(0.5);

    this.bloques++;

    if (this.bloques === this.maxBloques) {
    console.log("¡Iglú completo!");
    }
  };

  this.physics.add.collider(this.jugador, this.movingPlatforms, (jugador, plataforma) => {
    // Solo cuando toca desde arriba
    if (jugador.body.touching.down && plataforma.body.touching.up) {
    this.agregarBloqueIglu();
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



    this.movingPlatforms.children.iterate(plataforma => {
      if (plataforma.x < -plataforma.displayWidth / 2) {
        // Salió por la izquierda, reaparece por la derecha
        plataforma.x = 800 + plataforma.displayWidth / 2;
      } else if (plataforma.x > 800 + plataforma.displayWidth / 2) {
        // Salió por la derecha, reaparece por la izquierda
        plataforma.x = -plataforma.displayWidth / 2;
      }
    });

  }
}