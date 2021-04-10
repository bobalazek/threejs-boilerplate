import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {
  WEBGL,
} from 'three/examples/jsm/WebGL.js';
import * as dat from 'dat.gui';
import {
  Emitter,
  createNanoEvents,
} from 'nanoevents';

import {
  Preloader,
} from './Preloader';
import {
  WorldInterface,
} from '../Worlds/World';

export class GameManager {
  public static config: GameManagerConfigInterface;
  public static parameters: any;

  public static containerElement: HTMLElement;
  public static canvasElement: HTMLCanvasElement;
  public static sizingElement: HTMLElement | Window;
  public static debug: boolean;
  public static eventsEmitter: Emitter;

  public static canvasWidth: number;
  public static canvasHeight: number;

  public static preloader: Preloader;
  public static world: WorldInterface;

  public static loadingManager: THREE.LoadingManager;
  public static renderer: THREE.WebGLRenderer;
  public static clock: THREE.Clock;
  public static scene: THREE.Scene;
  public static camera: THREE.Camera;

  public static stats: Stats;
  public static datGui: dat.GUI;

  public static boot(config: GameManagerConfigInterface, parameters?: any) {
    this.config = config;
    this.parameters = parameters;

    this.containerElement = this.config.containerElement ?? document.body;
    this.canvasElement = this.config.canvasElement ?? null;
    this.sizingElement = this.config.sizingElement ?? window;
    this.debug = this.config.debug ?? false;

    if (!WEBGL.isWebGLAvailable()) {
      this._prepareNoWebGLWarning();

      return;
    }

    this.clock = new THREE.Clock();
    this.eventsEmitter = createNanoEvents<GameManagerEvents>();
    this.loadingManager = new THREE.LoadingManager();
    this.preloader = new Preloader();

    const defaultRendererParameters = {
      antialias: true,
      powerPreference: 'high-performance',
    };
    let rendererParameters = {
      ...defaultRendererParameters,
      ...this.config.rendererParameters,
    };
    if (this.canvasElement) {
      rendererParameters['canvas'] = this.canvasElement;
    }

    this.renderer = new THREE.WebGLRenderer(rendererParameters);

    if (!this.canvasElement) {
      this.canvasElement = this.renderer.domElement;
      this.containerElement.appendChild(this.canvasElement);
    }

    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding;
	  this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff, 1);

    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();

    this._prepareRendererSize();

    if (this.debug) {
      this._prepareStats();
      this._prepareDatGui();
    }

    this.world = new this.config.defaultWorld();
    this.world.start();
    this.world.load().then(() => {
      this._onTick();
    });

    // Events
    window.addEventListener('resize', this._onResize.bind(this));
  }

  private static _prepareRendererSize() {
    let canvasWidth = 0;
    let canvasHeight = 0;

    if (this.sizingElement instanceof Window) {
      canvasWidth = this.sizingElement.innerWidth;
      canvasHeight = this.sizingElement.innerHeight;
    } else {
      canvasWidth = this.sizingElement.clientWidth;
      canvasHeight = this.sizingElement.clientHeight;
    }

    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    const aspect = this.canvasWidth / this.canvasHeight;

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    } else if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.updateProjectionMatrix();
    }

    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
  }

  private static _prepareStats() {
    this.stats = Stats();

    this.containerElement.appendChild(this.stats.dom);
  }

  private static _prepareDatGui() {
    this.datGui = new dat.GUI();
  }

  private static _prepareNoWebGLWarning() {
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

    this.containerElement.prepend(warningElement);
  }

  // Events
  private static _onResize(): void {
    this._prepareRendererSize();

    this.eventsEmitter.emit('resize', {
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    this._render();
  }

  private static _onTick(): void {
    const delta = this.clock.getDelta();

    this.eventsEmitter.emit('tick', delta);

    if (this.stats) {
      this.stats.update();
    }

    this.world.update();

    this._render();

    this.renderer.setAnimationLoop(this._onTick.bind(this));
  }

  private static _render() {
    if (this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

export interface GameManagerConfigInterface {
  defaultWorld: new () => WorldInterface;
  containerElement?: HTMLElement;
  canvasElement?: HTMLCanvasElement;
  sizingElement?: HTMLElement | Window; // The (parent) element we get the canvas width & height from
  debug?: boolean;
  rendererParameters?: THREE.WebGLRendererParameters;
}

export interface GameManagerEvents {
  tick: (delta: number) => void;
  resize: (data: { width: number, height: number }) => void;
}
