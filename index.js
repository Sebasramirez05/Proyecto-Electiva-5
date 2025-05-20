import { Game } from './game.js';
import {Menu} from "./menu.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  scene: [Menu, Game],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500},
      debug: false
    }
  }
}

const game = new Phaser.Game(config);