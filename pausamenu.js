export class PausaMenu extends Phaser.Scene {
  constructor() {
    super({ key: "pausamenu" });
  }

    init(data) {
      this.escenaAnterior = data.escenaAnterior;
    }

  create() {
    const { width, height } = this.sys.game.config;

    // Fondo oscuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0).setDepth(4);

    // Texto "Pausa"
    this.add.text(width / 2, height / 2 - 80, "Pausa", {
      fontSize: "48px",
      fontFamily:"SnowForSanta",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(4);

    // Botón: Continuar
    const continuar = this.add.text(width / 2, height / 2 - 10, "Continuar", {
      fontSize: "28px",
      fontFamily:"SnowForSanta",
      color: "#00ff00",
      backgroundColor: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(4);

    continuar.on("pointerdown", () => {
      this.scene.stop();          
      this.scene.resume(this.escenaAnterior);  
    });

    // Botón: Volver al menú
    const volverMenu = this.add.text(width / 2, height / 2 + 50, "Volver al menu", {
      fontSize: "28px",
      fontFamily:"SnowForSanta",
      color: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(4);

    volverMenu.on("pointerdown", () => {
      // Detener la escena anterior (el nivel en pausa)
      this.scene.stop(this.escenaAnterior);
      // Detener la escena de pausa
      this.scene.stop("pausamenu");
      // Iniciar la escena del menú
      this.scene.start("menu");
    });

  }
}