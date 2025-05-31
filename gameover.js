export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "gameover" });
  }

    init(data) {
      this.escenaAnterior = data.escenaAnterior;
      this.puntosFinales = data.puntos || 0;
    }

  create() {
    const { width, height } = this.sys.game.config;

    // Fondo oscuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setDepth(4);

    // Texto "game over"
    this.add.text(width / 2, height / 2 - 80, "GAME OVER", {
      fontSize: "48px",
      fontFamily:"SnowForSanta",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(4);

    this.add.text(width / 2, height / 2 - 30, "Puntos: " + this.puntosFinales, {
    fontSize: "32px",
    fontFamily: "SnowForSanta",
    color: "#ffffff"
    }).setOrigin(0.5).setDepth(4);

    // Botón: Volver al menú
    const volverMenu = this.add.text(width / 2, height / 2 + 50, "Volver al menu", {
      fontSize: "28px",
      fontFamily:"SnowForSanta",
      color: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(4);

    volverMenu.on("pointerdown", () => {
    // Reiniciar valores globales
    window.GameState.lives = 3;  // Número inicial de vidas
    this.registry.set('puntosTotales', 0); // Restablecer puntuación

    // Detener todas las escenas activas antes de volver al menú
    this.scene.stop("gameover");  
    this.scene.stop("nivelActual"); // Detener la escena del nivel (cámbialo por el nombre correcto)

    // Iniciar la escena del menú
    this.scene.start("menu");
});


  }

}