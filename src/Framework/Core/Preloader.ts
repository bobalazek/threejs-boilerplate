import {
  GameManager,
} from './GameManager';

export interface PreloaderInterface {
  show(): void;
  hide(): void;
}

export class Preloader implements PreloaderInterface {
  private containerElement: HTMLElement;
  private textElement: HTMLElement;
  private progressElement: HTMLElement;
  private progressInnerElement: HTMLElement;

  private loaded: number = 0;
  private total: number = 1;

  public fadeInterval: number = 1000;

  constructor(fadeInterval?: number) {
    if (fadeInterval) {
      this.fadeInterval = fadeInterval;
    }

    const onProgress = (url: string, loaded: number, total: number) => {
      this.loaded = loaded;
      this.total = total;

      this._updateProgress();
    };

    GameManager.loadingManager.onStart = onProgress;
    GameManager.loadingManager.onProgress = onProgress;
    GameManager.loadingManager.onLoad = () => {
      this.loaded++;

      this._updateProgress();
    };

    this._prepareHtml();
  }

  public show() {
    this._updateProgress();

    this.containerElement.style.opacity = '1';
    this.containerElement.style.display = 'block';
  }

  public hide() {
    this._updateProgress();

    this.containerElement.style.opacity = '0';
    setTimeout(() => {
      this.containerElement.style.display = 'none';
    }, this.fadeInterval);
  }

  private _prepareHtml() {
    this.containerElement = document.getElementById('preloader');
    if (!this.containerElement) {
      this.containerElement = document.createElement('div');
      this.containerElement.id = 'preloader';
      this.containerElement.style.background = '#000000';
      this.containerElement.style.color = '#ffffff';
      this.containerElement.style.fontSize = '32px';
      this.containerElement.style.padding = '50px';
      this.containerElement.style.textAlign = 'center';
      this.containerElement.style.position = 'fixed';
      this.containerElement.style.top = '0';
      this.containerElement.style.left = '0';
      this.containerElement.style.width = '100%';
      this.containerElement.style.height = '100%';
      this.containerElement.style.boxSizing = 'border-box';
      this.containerElement.style.display = 'none';
      this.containerElement.style.transition = 'opacity ' + this.fadeInterval + 'ms ease-in-out';

      document.body.prepend(this.containerElement);
    }

    this.textElement = document.getElementById('preloader-text');
    if (!this.textElement) {
      this.textElement = document.createElement('div');
      this.textElement.id = 'preloader-text';
      this.textElement.innerHTML = 'Loading ...';

      this.containerElement.appendChild(this.textElement);
    }

    this.progressElement = document.getElementById('preloader-progress');
    if (!this.progressElement) {
      this.progressElement = document.createElement('div');
      this.progressElement.id = 'preloader-progress';
      this.progressElement.style.maxWidth = '320px';
      this.progressElement.style.padding = '5px';
      this.progressElement.style.margin = '20px auto';
      this.progressElement.style.border = '1px solid #ffffff';
      this.progressElement.style.position = 'relative';
      this.progressElement.style.boxSizing = 'border-box';

      this.containerElement.appendChild(this.progressElement);
    }

    this.progressInnerElement = document.getElementById('preloader-progress-inner');
    if (!this.progressInnerElement) {
      this.progressInnerElement = document.createElement('div');
      this.progressInnerElement.id = 'preloader-progress-inner';
      this.progressInnerElement.style.height = '16px';
      this.progressInnerElement.style.background = '#ffffff';
      this.progressInnerElement.style.boxSizing = 'border-box';

      this.progressElement.appendChild(this.progressInnerElement);
    }
  }

  private _updateProgress() {
    const {
      loaded,
      total,
    } = this;

    this.textElement.innerHTML = 'Loading {loaded}/{total} assets ...'
      .replace('{loaded}', '' + loaded)
      .replace('{total}', '' + total)
    ;

    const percentage = total === 0
      ? 100
      : (loaded === 0
        ? 0
        : loaded / total  * 100
      );
    this.progressInnerElement.style.width = percentage + '%';
  }
}
