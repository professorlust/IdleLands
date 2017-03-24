
import * as _ from 'lodash';

import { GuildBuilding, Size } from '../guild-building';
import { SETTINGS } from '../../../static/settings';

export class Mascot extends GuildBuilding {
  static size: Size = 'sm';
  static desc = 'Upgrade this guy for bragging rights!';

  static properties = [
    { name: 'Name', type: 'text' },
    { name: 'Quote', type: 'text' },
    { name: 'MascotID', type: 'select', values: _.keys(SETTINGS.revGidMap) }
  ];

  init() {
    const mascotId = +SETTINGS.revGidMap[this.getProperty('MascotID')];
    const mascotQuote = this.getProperty('Quote');
    const mascotName = this.getProperty('Name');

    const f = {
      name: mascotName || 'Mascot',
      gid: _.isNaN(mascotId) ? 26 : mascotId,
      type: 'Guild NPC',
      properties: {
        flavorText: mascotQuote
      }
    };

    this.tiles = [
      0,  0,  0,
      0,  f,  0,
      0,  0,  0
    ];
  }
}