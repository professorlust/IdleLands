
import { Personality } from '../personality';

export class TreasureHunter extends Personality {
  static disableOnActivate = ['Salvager'];

  static description = 'Find better items based on level, but gain 84% less gold and xp.';

  static stats = {
    xp:   (player, baseValue) => -baseValue*0.84,
    gold: (player, baseValue) => -baseValue*0.84,
    itemFindRangeMultiplier: (player) => player.level * 0.03
  };

  static disable(player) {
    super.disable(player);
    this.flagDirty(player, ['xp', 'gold', 'itemFindRange']);
  }

  static enable(player) {
    super.enable(player);
    this.flagDirty(player, ['xp', 'gold', 'itemFindRange']);
  }

  static hasEarned(player) {
    return player.$statistics.getStat('Character.Item.Sell') >= 100;
  }
}