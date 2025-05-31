export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "gameover" });
  }

  init(data) {
    this.escenaAnterior = data.escenaAnterior;
    this.puntosFinales = data.puntos || 0;
  }

  preload() {
    this.load.audio("gameoverSound", "./musica/GameOver.mp3"); 
  }

  create() {
    this.musicaGameOver = this.sound.add("gameoverSound", { loop: false, volume: 0.8 });
    this.musicaGameOver.play();

    const { width, height } = this.sys.game.config;

    // Fondo oscuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setDepth(4);

    // Texto "Game Over"
    this.add.text(width / 2, height / 2 - 80, "GAME OVER", {
      fontSize: "48px",
      fontFamily: "SnowForSanta",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(4);

    // Mostrar los puntos finales
    this.add.text(width / 2, height / 2 - 30, "Puntos: " + this.puntosFinales, {
      fontSize: "32px",
      fontFamily: "SnowForSanta",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(4);

    // Botón: Volver al menú
    const volverMenu = this.add.text(width / 2, height / 2 + 50, "Volver al menú", {
      fontSize: "28px",
      fontFamily: "SnowForSanta",
      color: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(4);

    volverMenu.on("pointerdown", () => {
      if (this.musicaGameOver) {
        this.musicaGameOver.stop();
      }

      // Reiniciar valores globales
      window.GameState.lives = 3;
      this.registry.set("puntosTotales", 0);

      // Detener escenas activas antes de cambiar al menú
      this.scene.stop("gameover");  
      this.scene.stop(this.escenaAnterior); 

      // Iniciar la escena del menú
      this.scene.start("menu");
    });
  }
}
