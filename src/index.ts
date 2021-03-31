import GameManager from './Core/GameManager';

import './Resources/styles/index.scss';

const canvasElement = <HTMLCanvasElement>document.getElementById('canvas');

GameManager.boot({
  canvasElement,
  debug: true,
});
