"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const achievement_1 = require("../achievement");
class Unaware extends achievement_1.Achievement {
    static achievementData(player) {
        const totalFalls = player.$statistics.getStat('Character.Movement.Fall');
        if (totalFalls < 250)
            return [];
        const baseAchievements = [{
                tier: 1,
                name: 'Unaware',
                desc: `Gain a special title for falling into ${(totalFalls).toLocaleString()} holes.`,
                type: achievement_1.AchievementTypes.EXPLORE
            }];
        if (totalFalls > 500)
            const tiers = [
                { required: 1, tier: 1, title: 'Unaware', bonusRewards: { type: 'petattr', petattr: 'a portable hole' } },
                { required: 2, tier: 2, title: 'Clumsy', bonusRewards: { desc: 'Gain a second title for falling into ${(totalFalls).toLocaleString()} holes.', deathMessage: '%player took a long fall down a deep hole.' } },
            ];
        return baseAchievements;
    }
}
exports.Unaware = Unaware;
