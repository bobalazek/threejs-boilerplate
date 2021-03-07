import Application from './Application';

import cybertruckResource from './Resources/models/cybertruck.glb';

export default class World {
  constructor() {
    Application.preloader.show();

    const resources = [
      cybertruckResource,
    ];

    Application.loader.loadBatch(resources).then(() => {
      console.log('All resources loaded!');

      Application.preloader.hide();
    });
  }
}
