export class PausaMenu extends Phaser.Scene {
  constructor() {
    super({ key: "pausamenu" });
  }

  create() {
    const { width, height } = this.sys.game.config;

    // Fondo oscuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0);

    // Texto "Pausa"
    this.add.text(width / 2, height / 2 - 80, "Pausa", {
      fontSize: "48px",
      color: "#ffffff"
    }).setOrigin(0.5).setDepth(4);

    // Botón: Continuar
    const continuar = this.add.text(width / 2, height / 2 - 10, "Continuar", {
      fontSize: "28px",
      color: "#00ff00",
      backgroundColor: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(4);

    continuar.on("pointerdown", () => {
      this.scene.stop();          
      this.scene.resume("game");  
    });

    // Botón: Volver al menú
    const volverMenu = this.add.text(width / 2, height / 2 + 50, "Volver al menú", {
      fontSize: "28px",
      color: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(4);

    volverMenu.on("pointerdown", () => {
      this.scene.stop("game");  
      this.scene.start("menu");  
    });
  }
}