import Application from './Application';

import './Resources/styles/index.scss';

const canvasElement = <HTMLCanvasElement>document.getElementById('canvas');

Application.boot({
  canvasElement,
  debug: true,
});
