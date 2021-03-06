import Application from './Application';

import cybertruckResource from './Resources/models/cybertruck.glb';

export default class World {
  constructor() {
    // TODO

    const resources = [
      cybertruckResource,
    ];

    Application.loader.loadBatch(resources).then(() => {
      console.log('All resources loaded!');
    });
  }
}
