import * as THREE from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import {
  Emitter,
  createNanoEvents,
} from 'nanoevents';

import Preloader from './Preloader';
import World from '../World';

interface GameManagerConfigInterface {
  canvasElement?: HTMLCanvasElement;
  debug?: boolean;
}

interface GameManagerEvents {
  tick: (delta: number) => void;
  resize: (data: { width: number, height: number }) => void;
}

export default class GameManager {
  public static config: GameManagerConfigInterface;
  public static parameters: any;

  public static canvasElement: HTMLCanvasElement;
  public static debug: boolean;
  public static emitter: Emitter;
  public static preloader: Preloader;
  public static world: World;

  public static width: number;
  public static height: number;
  public static requestAnimationFrame: number;

  public static loadingManager: THREE.LoadingManager;
  public static renderer: THREE.WebGLRenderer;
  public static scene: THREE.Scene;
  public static camera: THREE.PerspectiveCamera;
  public static clock: THREE.Clock;

  public static boot(config: GameManagerConfigInterface, parameters?: any): GameManager {
    this.config = config;
    this.parameters = parameters;

    if (!WEBGL.isWebGLAvailable()) {
      this.prepareNoWebGLWarning();

      return;
    }

    this.canvasElement = this.config.canvasElement;
    this.debug = this.config.debug ?? false;
    this.emitter = createNanoEvents<GameManagerEvents>();
    this.loadingManager = new THREE.LoadingManager();
    this.preloader = new Preloader();
    this.clock = new THREE.Clock();

    let rendererParameters = {
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true,
    };
    if (this.canvasElement) {
      rendererParameters['canvas'] = this.canvasElement;
    }

    this.renderer = new THREE.WebGLRenderer(rendererParameters);

    if (!this.canvasElement) {
      this.canvasElement = this.renderer.domElement;
      document.body.appendChild(this.canvasElement);
    }

    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding;
	  this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();

    this.prepareRendererSize();

    this.world = new World();

    this.onTick();

    window.addEventListener('resize', this.onResize.bind(this));

    return this;
  }

  private static prepareRendererSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.setSize(this.width, this.height);
  }

  private static prepareNoWebGLWarning() {
    let warningElement = document.createElement('div');
    warningElement.id = 'no-webgl-warning';
    warningElement.style.textAlign = 'center';
    warningElement.style.background = '#ffffff';
    warningElement.style.color = '#000000';
    warningElement.style.fontSize = '18px';
    warningElement.style.padding = '20px';
    warningElement.innerHTML = (
      'Sorry, but it seems that your browser does not support WebGL. ' +
      'Try again with another browser!'
    );

    document.body.prepend(warningElement);
  }

  // Events
  private static onResize(): void {
    this.prepareRendererSize();

    this.emitter.emit('resize', {
      width: this.width,
      height: this.height,
    });
  }

  private static onTick(): void {
    const delta = this.clock.getDelta();

    this.emitter.emit('tick', delta);

    if (this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    
    this.requestAnimationFrame = window.requestAnimationFrame(this.onTick.bind(this));
  }
}
