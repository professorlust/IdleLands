
import _ from 'lodash';

import { Event } from '../event';
import { Battle as BattleClass } from '../../combat/battle';
import { Party as PartyClass } from '../../party/party';

import { FindItem } from './FindItem';

import { MonsterGenerator } from '../../../shared/monster-generator';

import { MessageCategories } from '../../../shared/adventure-log';

import { Logger } from '../../../shared/logger';

export const WEIGHT = -1;

// Create a battle
export class BattleBoss extends Event {
  static operateOn(player, { bossName, bosses }) {
    if(player.level <= 5) return;
    if(player.$personalities.isActive('Coward') && Event.chance.bool({ likelihood: 75 })) return;

    if(!player.party) {
      const partyInstance = new PartyClass({ leader: player });
      partyInstance.isBattleParty = true;
    }

    const monsterPartyInstance = new PartyClass({ leader: bosses[0] });
    if(bosses.length > 1) {
      for(let i = 1; i < bosses.length; i++) {
        monsterPartyInstance.playerJoin(bosses[i]);
      }
    }

    const parties = [player.party, monsterPartyInstance];

    const introText = `${player.party.displayName} is gearing up for an epic boss battle against ${monsterPartyInstance.displayName}!`;

    const battle = new BattleClass({ introText, parties });
    this.emitMessage({ affected: player.party.players, eventText: introText, category: MessageCategories.COMBAT, extraData: { battleName: battle.name } });

    try {
      battle.startBattle();
    } catch(e) {
      Logger.error('BattleBoss', e, battle.saveObject());
    }

    if(player.party === battle.winningTeam) {
      _.each(player.party.players, p => {
        p.$statistics.incrementStat(`Character.BossKills.${bossName}`);
      });

      MonsterGenerator._setBossTimer(bossName);

      const dropItems = _.compact(_.flattenDeep(_.map(bosses, boss => {
        return _.map(_.values(boss.equipment), item => {
          if(!item.dropPercent) return null;
          if(!Event.chance.bool({ likelihood: item.dropPercent })) return null;
          return item;
        });
      })));

      if(dropItems.length > 0) {
        _.each(dropItems, item => {
          FindItem.operateOn(player, item);
        });
      }

      process.exit(0);
    }

    if(player.party.isBattleParty) {
      player.party.disband();
    }
  }
}
