import { Game } from './game.js';
import {Menu} from "./menu.js";
import {PausaMenu} from "./pausamenu.js";
import {Nivel2} from './scenes/nivel2.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 580,
  scene: [Menu, Game, PausaMenu, Nivel2],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500},
      debug: true
    }
  }
}

const game = new Phaser.Game(config);