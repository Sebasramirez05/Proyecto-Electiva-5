export class Menu extends Phaser.Scene {
    constructor(){
        super({key: "menu"})
    }

    preload(){
        this.load.image("fondo", "images/fondo.png")
    }

    create(){
        if (!window.GameState) {
            window.GameState = {
                lives: 3,
                score: 0
            };
        }

        const {width, height} = this.sys.game.config;
        this.add.image(width / 2, height / 2, "fondo").setDisplaySize(width, height);

        /*Boton de iniciar*/
        const startButton = this.add.text(width / 2, height / 1.5, 'Iniciar Juego', {
            fontSize: '32px',
            fontFamily: "SnowForSanta",
            color: '#0E2148',
            backgroundColor: '#7F8CAA',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
        this.scene.start('game');
        });
    }
}