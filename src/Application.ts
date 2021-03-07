import * as THREE from 'three';
import { WEBGL } from 'three/examples/jsm/WebGL.js';
import {
  Emitter,
  createNanoEvents,
} from 'nanoevents';

import Loader from './Loader';
import Preloader from './Preloader';
import World from './World';

interface ApplicationConfigInterface {
  canvasElement: HTMLCanvasElement;
  debug?: boolean;
}

interface ApplicationEvents {
  tick: (delta: number) => void;
  resize: (data: { width: number, height: number }) => void;
}

export default class Application {
  public static config: ApplicationConfigInterface;
  public static parameters: any;

  public static canvasElement: HTMLCanvasElement;
  public static debug: boolean;
  public static emitter: Emitter;
  public static loader: Loader;
  public static preloader: Preloader;
  public static world: World;

  public static width: number;
  public static height: number;
  public static requestAnimationFrame: number;

  public static renderer: THREE.WebGLRenderer;
  public static scene: THREE.Scene;
  public static camera: THREE.PerspectiveCamera;
  public static clock: THREE.Clock;

  public static boot(config: ApplicationConfigInterface, parameters?: any): Application {
    this.config = config;
    this.parameters = parameters;

    if (!WEBGL.isWebGLAvailable()) {
      this.prepareNoWebGLWarning();

      return;
    }

    this.prepareGeneral();
    this.prepareRenderer();
    this.prepareEvents();

    return this;
  }

  // Prepare stuff
  private static prepareGeneral() {
    this.canvasElement = this.config.canvasElement;
    this.debug = this.config.debug ?? false;
    this.emitter = createNanoEvents<ApplicationEvents>();
    this.loader = new Loader();
    this.preloader = new Preloader();
    this.world = new World();
  }

  private static prepareRenderer() {
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      alpha: true,
    });
    this.renderer.setClearColor(0xffffff, 1);
    this.prepareRendererSize();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();

    this.onTick();
  }

  private static prepareEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private static prepareRendererSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.camera) {
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix()
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
    this.requestAnimationFrame = window.requestAnimationFrame(this.onTick.bind(this));

    const delta = this.clock.getDelta();

    this.emitter.emit('tick', delta);

    if (this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
