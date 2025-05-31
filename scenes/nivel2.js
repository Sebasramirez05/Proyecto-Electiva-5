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
    this.load.spritesheet('pez', 'images/pez.png', { frameWidth: 48, frameHeight: 48 });
    this.load.audio("musica", "musica/musicafondo.mp3")
  }

  create() {
    //música de fondo
    this.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
    this.musica.play();
    this.musica.setVolume(1);

    this.respawnPoint = { x: 400, y: 80 }
    let lives = window.GameState.lives;
    this.lifeText = this.add.text(40, 83, 'Vidas: ' + lives, {
      fontSize: '28px',
      fontFamily: 'SnowForSanta',
      fill: '#000000'
    }).setDepth(10);

    this.loseLife = (jugador) => {
      window.GameState.lives--;
      this.lifeText.setText('Vidas: ' + window.GameState.lives);
      
      if (window.GameState.lives > 0) {
        jugador.setPosition(this.respawnPoint.x, this.respawnPoint.y);
        jugador.clearTint();
        jugador.body.setVelocity(0);
      } else {
          this.gameoverImage.setVisible(true);
          jugador.setTint(0xff0000);
          this.physics.pause();
      }
            if (this.musica && window.GameState.lives <= 0) {
        this.musica.pause(); // Pausar la música
        }
    };


    //temporizador
    this.tiempoRestante = 60;
    this.timerText = this.add.text(110, 50, 'Tiempo: 60', {
    fontSize: '28px',
    fontFamily: 'SnowForSanta',
    color: '#000000',
    padding: { x: 10, y: 5 }
    }).setOrigin(0.5, 0).setDepth(10);

    this.timedEvent = this.time.addEvent({
      delay: 1500,
      callback: () => {
        this.tiempoRestante--;
        this.timerText.setText('Tiempo: ' + this.tiempoRestante);
        if (this.tiempoRestante <= 0) {
          this.gameoverImage.setVisible(true);
          this.jugador.setTint(0xff0000);
          this.physics.pause();
          this.timedEvent.remove();
        }
      },
      callbackScope: this,
      loop: true
    });

    // Puntos
    // Inicializar puntos a partir del estado global o usar 0 por defecto
    window.GameState = window.GameState || {};
    let puntos = window.GameState.puntos || 0;
    window.GameState.puntos = puntos;

    window.GameState.puntos = window.GameState.puntos !== undefined ? window.GameState.puntos : 0;
    // Almacenar los puntos en el registry
    this.registry.set('puntosTotales', puntos);

    // Crear el objeto de texto para mostrar los puntos
    this.puntosText = this.add.text(30, 20, 'Puntos: ' + puntos, {
      fontSize: '28px',
      fontFamily: 'SnowForSanta',
      color: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0, 0).setDepth(10);

    console.log("Puntos cargados:", puntos);

        // Función encapsulada para actualizar los puntos
    this.updatePuntos = (nuevoValor) => {
      if (nuevoValor === undefined) {
        console.error("updatePuntos fue llamada sin un valor definido");
        return;
      }
      // Actualiza el estado global y el texto
      window.GameState.puntos = nuevoValor;
      this.registry.set('puntosTotales', nuevoValor);
      this.puntosText.setText('Puntos: ' + nuevoValor);
      console.log("Puntos actualizados:", nuevoValor);
    };


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
    this.peces = this.physics.add.group({ allowGravity: false, immovable: true });
    this.platforms = this.physics.add.staticGroup();

    const baseTransparente = this.add.rectangle(400, 166, 800, 10, 0x000000, 0);
    this.physics.add.existing(baseTransparente, true);
    baseTransparente.body.checkCollision.up = true;
    baseTransparente.body.checkCollision.down = false;
    this.platforms.add(baseTransparente);

    this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });

    const filas = [
      { y: 520, dir: 1 },
      { y: 430, dir: -1 },
      { y: 340, dir: 1 },
      { y: 250, dir: -1 }
    ];

    const anchoReal = this.textures.get('hielo').getSourceImage().width * 0.5;
    const espacio = anchoReal + 5;

    this.barrerasMortales = [];
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

      const barrera = this.add.rectangle(400, fila.y - 7, 800, 1, 0xff0000, 0);
      this.physics.add.existing(barrera, true);
      barrera.body.checkCollision.up = true;
      barrera.body.checkCollision.down = false;
      this.barrerasMortales.push(barrera);

      this.physics.add.overlap(this.jugador, barrera, (jugador, barrera) => {
        const sobrePlataforma = this.physics.overlap(jugador, this.movingPlatforms);
        if (!sobrePlataforma && jugador.body.velocity.y >= 0) {
          this.loseLife(jugador);
        }
      });
    });

    this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('jugador', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('run', { start: 0, end: 5 }), frameRate: 12, repeat: -1 });
    this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }), frameRate: 8, repeat: 0 });
    this.anims.create({ key: 'volar', frames: this.anims.generateFrameNumbers('pajaro', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'nadar', frames: this.anims.generateFrameNumbers('pez', { start: 0, end: 3 }), frameRate: 6, repeat: -1});

    this.jugador.play('idle');
    this.cursors = this.input.keyboard.createCursorKeys();

    const crearPajaro = (x, y, velocidadX) => {
      const pajaro = this.pajaros.create(x, y, 'pajaro');
      pajaro.play('volar');
      pajaro.setVelocityX(velocidadX);
      pajaro.setDepth(2);
      pajaro.setScale(1);
      pajaro.body.setSize(23, 20);
      pajaro.body.setOffset(5, 8);
      if (velocidadX < 0) pajaro.setFlipX(true);
    };

    crearPajaro(-50, filas[3].y - 50, 85);
    crearPajaro(-150, filas[3].y - 50, 85);
    crearPajaro(800, filas[0].y - 50, -85);
    crearPajaro(850, filas[0].y - 50, -85);

    const crearPez = (x, y, velocidadX) => {
        const pez = this.peces.create(x, y, 'pez');
        pez.body.allowGravity = false;
        pez.play('nadar');
        pez.setVelocityX(velocidadX);
        pez.setScale(1.2);
        pez.setDepth(1);
        pez.setFlipX(velocidadX < 0);
        pez.body.setSize(20, 20);
        pez.body.setOffset(13, 13);
        if (velocidadX < 0) pez.setFlipX(true);
    }

    crearPez(800, filas[1].y -50, -70);
    crearPez(850, filas[1].y -50, -70);
    crearPez(-50, filas[2].y -50, 70);
    crearPez(-100, filas[2].y -50, 70);
    crearPez(-150, filas[2].y -50, 70); 

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
      this.loseLife(jugador);
    });

    this.physics.add.overlap(this.jugador, this.peces, (jugador, pez) => {
      pez.disableBody(true, true); // Oculta y desactiva el pez
      //punto de peces
       puntos = window.GameState.puntos + 100;
      this.updatePuntos(puntos);
    }, null, this);

    const pauseButton = this.add.text(750, 20, '⏸', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(1, 0).setInteractive().setDepth(3);

    pauseButton.on('pointerdown', () => {
      this.scene.launch('pausamenu', { escenaAnterior: this.scene.key });
      this.scene.pause();  
      this.scene.bringToTop('pausamenu');  // Asegura que se muestre por encima
    });



    this.bloques = 0;
    this.maxBloques = 12;
    this.igluCompleto = false;
    //IGLU
    this.igluPosiciones = [
      // Fila 1 (base) 
      { x: 600, y: 140 },
      { x: 635, y: 140 },
      null,
      { x: 690, y: 140 },
      { x: 725, y: 140 },

      // Fila 2
      { x: 620, y: 110 },
      { x: 650, y: 110 },
      { x: 680, y: 110 },
      { x: 710, y: 110 },

      // Fila 3
      { x: 635, y: 80 },
      { x: 665, y: 80 },
      { x: 695, y: 80 },
    ];

     this.agregarBloqueIglu = () => {
      while (this.bloques < this.igluPosiciones.length && !this.igluPosiciones[this.bloques]) {
      this.bloques++;
      }
      if (this.bloques >= this.maxBloques) return;
      const pos = this.igluPosiciones[this.bloques];
      if (!pos) return; // Seguridad extra
      const bloque = this.add.image(pos.x, pos.y, 'bloque');
      bloque.setScale(0.13).setDepth(1);
      this.bloques++;
      // Suma puntos solo por bloques normales
      puntos = window.GameState.puntos + 10;
      this.updatePuntos(puntos);

    if (this.bloques === this.maxBloques) {
    // Cuando el iglú está completo, agrega la puerta
    this.puertaPos = { x: 663, y: 125 }; // Usa la posición del null en la base
    this.puerta = this.add.image(this.puertaPos.x, this.puertaPos.y, 'puerta');
    this.puerta.setScale(0.20).setDepth(2);

    // Habilita la comprobación para pasar de nivel en update()
    this.iglúCompleto = true;

      if (this.bloques === this.maxBloques) {
        // Cuando el iglú está completo, agrega la puerta
        this.puertaPos = { x: 663, y: 125 }; // Usa la posición del null en la base
        this.puerta = this.add.image(this.puertaPos.x, this.puertaPos.y, 'puerta');
        this.puerta.setScale(0.20).setDepth(2);

        // Habilita la comprobación para pasar de nivel en update()
        this.iglúCompleto = true;
      }
    }
  }}

  update() {
    if (this.plataformaActual &&
        this.jugador.body.onFloor() &&
        this.jugador.body.velocity.x === 0) {
      this.jugador.x += this.plataformaActual.body.velocity.x * this.game.loop.delta / 1000;
    } else {
      this.plataformaActual = null;
    }

    this.barrerasMortales.forEach(barrera => {
      barrera.x = 400;
    });

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
      this.loseLife(this.jugador);
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
      } else if (pajaro.x < -100) {
        pajaro.x = 900;
      }
    });

    this.peces.children.iterate(pez => {
      if (!pez.active) return;
      if (pez.body.velocity.x > 0 && pez.x > 900) {
        pez.x = -100;
      } else if (pez.body.velocity.x < 0 && pez.x < -300) {
        pez.x = 900;
      }
    });

    if (this.iglúCompleto && this.puerta) {
      const distancia = Phaser.Math.Distance.Between(
      this.jugador.x, this.jugador.y,
      this.puerta.x, this.puerta.y
      );
      if (distancia < 40 && this.cursors.down.isDown) {
        this.puntos = window.GameState.puntos + (this.tiempoRestante * 10);
        this.updatePuntos(this.puntos);
        this.musica.stop(); 
        this.scene.start('nivel3');
      }
    }

  }
}
