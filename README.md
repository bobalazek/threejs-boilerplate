# three.js Boilerplate

Just my personal opinionated three.js boilerplate.


## File structure

### `src/index.ts`

Your app entrypoint. Basically just a shortcut for `src/Game/index.ts`, but it also includes our CSS.
### `src/declarations.d.ts`

Declarations for assets, so webpack know what it needs to bundle. In the code models and textures should then be easily be accessible via `import asset from '../Resources/models/vehicle.glb';`. That returns a string, which you can then use in your loader.
You can also add additional extensions here if you need to, but don't forget to add the extensions also inside your `webpack.common.js` file under the last `url-loader` object.

### `src/Framework/Core/GameManager.ts`

This if your main game manager file that prepares everything for you: canvas, sizes, renderer, preloader, debug, scene, camera, ... It will also manage to resize the canvas and perspective camera aspect ratio in case you resize the window.

This file, and the `Preloader.ts` are separate inside the `src/Core` folder, because it contains code that can be reused across multiple games/apps.

### `src/Framework/Core/Preloader.ts`

As the name already suggest, here we have all the preloader related stuff. You can modify that as you wish.

### `src/Game/index.ts`

This is the app/game entrypoint that boots everything up.

### `src/Game/Worlds/DefaultWorld.ts`

All our actual game logic goes in here. Of course, you will need to split it into several files as you implement more and more logic, but preferraly, everything should still be inside the `src/Game` folder.

### `src/Resources`

Here you'll normally smash your styles, models, textures, shaders and other static resources into.


## Model/texture usage

```javascript
import {
  GLTFLoader,
} from 'three/examples/jsm/loaders/GLTFLoader.js';

import vehicleModelUrl from '../../Resources/models/vehicle.glb';
import vehicleModelTexture from '../../Resources/texture/vehicle.png';

this.gltfLoader = new GLTFLoader(GameManager.loadingManager);
this.gltfLoader.load(vehicleModelUrl, (gltf) => {
  console.log('Yay, model loaded!');
});

const vehicleTexture = new THREE.TextureLoader().load(vehicleModelTexture);
```
## Shader usage

```javascript
import defaultFragmentShader from '../../Resources/shaders/default.fragment.fx';
import defaultVertexShader from '../../Resources/shaders/default.vertex.fx';

const shaderMaterial = new THREE.ShaderMaterial({
  fragmentShader: defaultFragmentShader,
  vertextShader: defaultVertexShader,
});
```

## Commands

* Installation: `yarn install`
* Development: `yarn start`
* Production build: `yarn build`
