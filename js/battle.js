// 魔塔游戏 - 战斗系统模块

const Battle = {
    // 战斗接口（空实现，后续扩展）
    // 计算战斗伤害
    calculateDamage(heroAtk, heroDef, monster) {
        // 勇士对怪物的每回合伤害
        const heroDamage = Math.max(1, heroAtk - monster.def);

        // 怪物对勇士的每回合伤害
        const monsterDamage = Math.max(1, monster.atk - heroDef);

        // 战斗回合数
        const rounds = Math.ceil(monster.hp / heroDamage);

        // 勇士总损血
        const totalDamage = rounds * monsterDamage;

        return {
            heroDamage,
            monsterDamage,
            rounds,
            totalDamage,
            canWin: totalDamage < State.hero.hp
        };
    },

    // 执行战斗
    execute(monster, x, y) {
        const heroAtk = State.getTotalAtk();
        const heroDef = State.getTotalDef();

        const result = this.calculateDamage(heroAtk, heroDef, monster);

        // 检查是否能获胜
        if (!result.canWin) {
            State.addMessage(`无法击败 ${monster.name}！需要更多属性。`);
            return false;
        }

        // 执行战斗
        State.updateHp(-result.totalDamage);
        State.updateGold(monster.gold);
        State.updateExp(monster.exp);

        // 清除怪物
        MapManager.setTile(x, y, Config.TILE.FLOOR);

        // 记录战斗
        State.addMessage(`击败 ${monster.name}！损血 ${result.totalDamage}`);

        return true;
    },

    // 战斗预览（用于UI显示）
    preview(monster) {
        return this.calculateDamage(State.getTotalAtk(), State.getTotalDef(), monster);
    }
};

window.Battle = Battle;