export class PausaMenu extends Phaser.Scene {
    constructor(){
        super({key: "pausamenu"})
    }

    create(){
        const {width, heigth}= this.sys.game.confug;

        /*fondo semitransparente*/
        this.add.rectangle(0, 0, width, heigth, 0x000000, 0.5).setOrigin(0);
        this.add.text(width / 2, heigth / 2, "Pausa", {
            fontSize: "48px",
            color: "#ffffff"
        }).setOrigin(0.5);

        const menuvolver = this.add.text(width / 2, heigth / 2, "Volver al menu", {
            fontSize: "28px",
            color: "#ff0000",
            backgroundColor: "#000000",
            padding: {x: 20, y: 10}
        }).setOrigin(0.5).setInteractive();

        menuvolver.on('pointerdown', () => {
            this.scene.stop('game');
            this.scene.start('Menu');
        });
    }
}