import Application from './Application';

export default class Preloader {
  private containerElement: HTMLElement;
  private textElement: HTMLElement;
  private progressElement: HTMLElement;
  private progressInnerElement: HTMLElement;
  private interval: number;

  private loaded: number = 0;
  private total: number = 1;

  constructor() {
    const onProgress = (url, loaded, total) => {
      this.loaded = loaded;
      this.total = total;

      this.updateProgress();
    };

    Application.loadingManager.onStart = onProgress;
    Application.loadingManager.onProgress = onProgress;

    // Prepare HTML
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

    this.textElement = document.createElement('div');
    this.textElement.id = 'preloader-text';
    this.textElement.innerHTML = 'Loading ...';

    this.progressElement = document.createElement('div');
    this.progressElement.id = 'preloader-progress';
    this.progressElement.style.maxWidth = '320px';
    this.progressElement.style.padding = '5px';
    this.progressElement.style.margin = '20px auto';
    this.progressElement.style.border = '1px solid #ffffff';
    this.progressElement.style.position = 'relative';
    this.containerElement.style.boxSizing = 'border-box';

    this.progressInnerElement = document.createElement('div');
    this.progressInnerElement.id = 'preloader-progress-inner';
    this.progressInnerElement.style.height = '16px';
    this.progressInnerElement.style.background = '#ffffff';
    this.progressInnerElement.style.boxSizing = 'border-box';

    this.progressElement.appendChild(this.progressInnerElement);
    this.containerElement.appendChild(this.textElement);
    this.containerElement.appendChild(this.progressElement);

    document.body.prepend(this.containerElement);
  }

  public show() {
    this.updateProgress();

    this.containerElement.style.display = 'block';
  }

  public hide() {
    this.updateProgress();

    window.clearInterval(this.interval);

    this.containerElement.style.display = 'none';
  }

  public updateProgress() {
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
