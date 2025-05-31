import { Game } from './game.js';
import { GameOver } from './gameover.js';
import {Menu} from "./menu.js";
import {PausaMenu} from "./pausamenu.js";
import {Nivel2} from './scenes/nivel2.js';
import {Nivel3} from './scenes/nivel3.js';
import {Nivel4} from './scenes/nivel4.js';
import {Nivel5} from './scenes/nivel5.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 580,
  scene: [Menu, Game, PausaMenu,GameOver, Nivel2, Nivel3, Nivel4, Nivel5],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500},
      debug: false
    }
  }
}

const game = new Phaser.Game(config);