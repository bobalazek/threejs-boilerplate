import {
  GameManager,
} from '../Framework/Core/GameManager';
import {
  DefaultWorld,
} from './Worlds/DefaultWorld';

const canvasElement = <HTMLCanvasElement>document.getElementById('canvas');

GameManager.boot({
  defaultWorld: DefaultWorld,
  canvasElement,
  debug: true,
});
