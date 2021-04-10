import * as THREE from 'three';
import {
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  OrbitControls,
} from 'three/examples/jsm/controls/OrbitControls.js';

import {
  GameManager,
} from '../../Framework/Core/GameManager';
import {
  AbstractWorld,
} from '../../Framework/Worlds/World';

export class DefaultWorld extends AbstractWorld {
  private camera: THREE.PerspectiveCamera;
  private orbitControls: OrbitControls;
  private gltfLoader: GLTFLoader;

  start() {
    GameManager.preloader.show();

    this._prepareCameraAndControls();
    this._prepareEnvironment();
  }

  load(): Promise<DefaultWorld> {
    return new Promise((resolve) => {
      // Here you'd probably load some model/texture resources

      GameManager.preloader.hide();

      resolve(this);
    });
  }

  update() {
    this.orbitControls.update();
  }

  private _prepareCameraAndControls() {
    // Camera
    const camera = new THREE.PerspectiveCamera();

    camera.far = 2048;
    camera.position.set(16, 8, 16);
    camera.lookAt(0, 0, 0);

    this.camera = GameManager.camera = camera;

    // Orbit Controls
    const orbitControls = new OrbitControls(
      this.camera,
      GameManager.renderer.domElement
    );
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 4;
    orbitControls.maxDistance = 64;
    orbitControls.minPolarAngle = THREE.MathUtils.degToRad(10);
    orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(80);

    this.orbitControls = orbitControls;
  }

  private _prepareEnvironment() {
    this.gltfLoader = new GLTFLoader(GameManager.loadingManager);

    if (GameManager.debug) {
      const helperSize = 1024;

      // Grid Helper
      const gridHelper = new THREE.GridHelper(helperSize, helperSize / 8, 0xcccccc, 0x333333);

      GameManager.scene.add(gridHelper);

      // Axes Helper
      const axesHelper = new THREE.AxesHelper(helperSize);
      axesHelper.position.y = 0.01; // Just so we are on the top of the grid helper

      GameManager.scene.add(axesHelper);
    }
  }
}
