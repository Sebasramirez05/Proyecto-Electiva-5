export class Menu extends Phaser.Scene {
    constructor(){
        super({key: "menu"})
    }

    preload(){
        this.load.image("fondo", "images/fondonieve.jpg")
        this.load.image("titulo", "images/FROSTBITE.png")
    }

    create(){
        const {width, height} = this.sys.game.config;
        this.add.image(width / 2, height / 2, "fondo").setDisplaySize(width, height);
        this.add.image(width / 2, height / 2, "titulo").setDisplaySize(width, height);

        /*Boton de iniciar*/
        const startButton = this.add.text(width / 2, height / 1.5, 'Iniciar Juego', {
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
        this.scene.start('game');
        });
    }
}