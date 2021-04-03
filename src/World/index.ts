import GameManager from '../Core/GameManager';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class World {
  constructor() {
    this.prepare();
  }

  async prepare() {
    GameManager.preloader.show();

    await this.prepareResources();

    GameManager.preloader.hide();
  }

  async prepareResources() {
    const gltfLoader = new GLTFLoader(GameManager.loadingManager);

    // TODO: load your resources here
  }
}
