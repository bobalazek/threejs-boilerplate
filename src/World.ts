import Application from './Application';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import cybertruckResource from './Resources/models/cybertruck.glb';

export default class World {
  constructor() {
    this.prepare();
  }

  async prepare() {
    Application.preloader.show();

    await this.prepareResources();

    Application.preloader.hide();
  }

  async prepareResources() {
    const gltfLoader = new GLTFLoader(Application.loadingManager);
    const gltfData = await gltfLoader.loadAsync(cybertruckResource);
    const cybertruckMesh = <THREE.Object3D>gltfData.scene.children[0];

    Application.scene.add(cybertruckMesh);
  }
}
