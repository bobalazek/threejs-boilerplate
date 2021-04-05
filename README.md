# three.js Boilerplate

Just my personal opinionated three.js boilerplate.


## What you need to know?

### `src/index.ts`

This is the app/game entrypoint that boots everything up.
### `src/declarations.d.ts`

Declarations for assets, so webpack know what it needs to bundle. In the code models and textures should then be easily be accessible via `import asset from '../Resources/models/vehicle.glb';`. That returns a string, which you can then use in your loader.
You can also add additional extensions here if you need to, but don't forget to add the extensions also inside your `webpack.common.js` file under the last `url-loader` object.

### `src/Core/GameManager.ts`

This if your main game manager file that prepares everything for you: canvas, sizes, renderer, preloader, debug, scene, camera, ... It will also manage to resize the canvas and perspective camera aspect ratio in case you resize the window.

This file, and the `Preloader.ts` are separate inside the `src/Core` folder, because it contains code that can be reused across multiple games/apps.

### `src/Core/Preloader.ts`

As the name already suggest, here we have all the preloader related stuff. You can modify that as you wish.

### `src/Game/World.ts`

All our actual game logic goes in here. Of course, you will need to split it into several files as you implement more and more logic, but preferraly, everything should still be inside the `src/Game` folder.

### `src/Resources`

Here you'll normally smash your styles, models, textures, shaders and other static resources into.

## Commands

* Installation: `yarn install`
* Development: `yarn start`
* Production build: `yarn build`
