import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class LoaderResource {
  public path: string;
  public data: any;
  public error: any = null;
  public isLoading: boolean = true;
  public isLoaded: boolean = false;
  public loadingPercentage: number = 0;

  constructor(path: string) {
    this.path = path;
  }
}

interface LoaderResources {
  [key: string]: LoaderResource
}

export default class Loader {
  private gltfLoader: GLTFLoader;

  private resources: LoaderResources = {};

  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  public loadBatch(resources: string[], onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource[]> {
    let promises: Promise<LoaderResource|null>[] = [];

    resources.forEach((resource) => {
      const loaderResourcePromise = this.load(resource);
      promises.push(loaderResourcePromise);

      if (onProgress) {
        loaderResourcePromise.then((loaderResource) => {
          onProgress(loaderResource);
        });
      }
    });

    return Promise.all(promises);
  }

  public load(resource: string, onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource|null> {
    return new Promise((resolve) => {
      if (this.resources[resource]) {
        return resolve(this.resources[resource]);
      }

      const ext = resource.split('.').pop();

      if (['jpg', 'png', 'gif'].includes(ext)) {
        return this.loadImage(resource, onProgress).then(() => {
          return resolve(this.resources[resource]);
        });
      } else if (['gltf', 'glb'].includes(ext)) {
        return this.loadGltf(resource, onProgress).then(() => {
          return resolve(this.resources[resource]);
        })
      }

      return resolve(null);
    });
  }

  private loadGltf(resource: string, onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource> {
    return new Promise((resolve) => {
      let loaderResource = new LoaderResource(resource);

      this.gltfLoader.load(
        resource,
        (data) => {
          loaderResource.data = data;
          loaderResource.isLoading = false;
          loaderResource.isLoaded = true;
          loaderResource.loadingPercentage = 100;

          resolve(loaderResource);
        },
        (xhr) => {
          loaderResource.loadingPercentage = xhr.loaded / xhr.total * 100;

          if (onProgress) {
            onProgress(loaderResource);
          }
        },
        (error) => {
          loaderResource.error = error;

          resolve(loaderResource);
        }
      );
    });
  }

  private loadImage(resource: string, onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource> {
    return new Promise((resolve) => {
      let loaderResource = new LoaderResource(resource);

      const image = new Image();
      image.src = resource;
      image.addEventListener('load', () => {
        loaderResource.isLoading = false;
        loaderResource.isLoaded = true;
        loaderResource.loadingPercentage = 100;
        loaderResource.data = image;

        resolve(loaderResource);
      });
      image.addEventListener('progress', (xhr) => {
        loaderResource.loadingPercentage = xhr.loaded / xhr.total * 100;

        if (onProgress) {
          onProgress(loaderResource);
        }
      });
      image.addEventListener('error', (error) => {
        loaderResource.error = error;

        resolve(loaderResource);
      });
    });
  }
}
