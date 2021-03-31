import GameManager from '../Core/GameManager';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import cybertruckResource from './Resources/models/cybertruck.glb';

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
    const gltfData = await gltfLoader.loadAsync(cybertruckResource);
    const cybertruckMesh = <THREE.Object3D>gltfData.scene.children[0];

    GameManager.scene.add(cybertruckMesh);
  }
}
