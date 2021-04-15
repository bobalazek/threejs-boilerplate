import * as THREE from 'three';

export interface WorldInterface {
  scene: THREE.Scene;
  start(): void;
  load(): Promise<WorldInterface>;
  update(): void;
}

export abstract class AbstractWorld implements WorldInterface {
  public scene: THREE.Scene;

  start() {
    this.scene = new THREE.Scene();
  }

  load(): Promise<WorldInterface> {
    return new Promise((resolve) => {
      // Your load logic here

      resolve(this);
    });
  }

  update() {
    // Your update logic here
  }
}
