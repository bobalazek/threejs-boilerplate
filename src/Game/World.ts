import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import GameManager from '../Core/GameManager';

export default class World {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private gltfLoader: GLTFLoader;

  constructor() {
    this.prepare();
  }

  async prepare() {
    GameManager.preloader.show();

    this._prepareCameraAndControls();
    this._prepareEnvironment();

    GameManager.preloader.hide();
  }

  private _prepareCameraAndControls() {
    // Camera
    const camera = new THREE.PerspectiveCamera();

    camera.far = 5000;
    camera.position.set(16, 8, 16);
    camera.lookAt(0, 0, 0);

    this.camera = GameManager.camera = camera;

    // Controls
    const controls = new OrbitControls(
      camera,
      GameManager.renderer.domElement
    );
    controls.enableDamping = true;
    controls.minDistance = 4;
    controls.maxDistance = 32;
    controls.minPolarAngle = THREE.MathUtils.degToRad(0);
    controls.maxPolarAngle = THREE.MathUtils.degToRad(75);

    this.controls = controls;

    GameManager.eventsEmitter.on('tick', () => {
      controls.update();
    });
  }

  private _prepareEnvironment() {
    this.gltfLoader = new GLTFLoader(GameManager.loadingManager);

    if (GameManager.debug) {
      // Axes
      const axesHelper = new THREE.AxesHelper(16);
      GameManager.scene.add(axesHelper);
    }

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(128, 128);
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0x999999,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    ground.receiveShadow = false;
    ground.matrixAutoUpdate = false;
    ground.updateMatrix();

    GameManager.scene.add(ground);
  }
}
