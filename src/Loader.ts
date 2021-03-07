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

  public loadBatch(resources: string[], onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResources> {
    return new Promise((resolve) => {
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

      return Promise.all(promises).then(() => {
        return resolve(this.resources);
      });
    });
  }

  public load(resource: string, onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource|null> {
    return new Promise((resolve) => {
      if (this.resources[resource]) {
        return resolve(this.resources[resource]);
      }

      const ext = resource.split('.').pop();

      if (['jpg', 'png', 'gif'].includes(ext)) {
        return this.loadImage(resource, onProgress).then((loaderResource) => {
          return resolve(loaderResource);
        });
      } else if (['gltf', 'glb'].includes(ext)) {
        return this.loadGltf(resource, onProgress).then((loaderResource) => {
          return resolve(loaderResource);
        })
      }

      return resolve(null);
    });
  }

  public getStatus() {
    const resources = Object.values(this.resources);

    const total = resources.length;
    const loaded = resources.filter((resource) => {
      return resource.isLoaded;
    }).length;
    const loading = resources.filter((resource) => {
      return resource.isLoading;
    }).length;

    return {
      total,
      loaded,
      loading,
    };
  }

  private loadGltf(resource: string, onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource> {
    return new Promise((resolve) => {
      let loaderResource = new LoaderResource(resource);

      this.resources[resource] = loaderResource;

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
          loaderResource.isLoaded = true;

          resolve(loaderResource);
        }
      );
    });
  }

  private loadImage(resource: string, onProgress?: (loaderResource: LoaderResource) => void): Promise<LoaderResource> {
    return new Promise((resolve) => {
      let loaderResource = new LoaderResource(resource);

      this.resources[resource] = loaderResource;

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
        loaderResource.isLoaded = true;

        resolve(loaderResource);
      });
    });
  }
}
