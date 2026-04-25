// 魔塔游戏 - 商店系统模块

const Shop = {
    // 商店状态
    isOpen: false,
    currentShop: null,

    // 打开商店
    open(shop) {
        this.isOpen = true;
        this.currentShop = shop;
        State.game.isInDialog = true;

        State.addMessage(`${shop.name}: ${shop.greeting}`);

        // 显示商店UI
        UI.showShopDialog(shop.name);
    },

    // 关闭商店
    close() {
        this.isOpen = false;
        this.currentShop = null;
        State.game.isInDialog = false;

        UI.hideShopDialog();
        State.addMessage('离开商店');
    },

    // 购买选项
    buy(optionKey) {
        const { SHOP } = Config;
        const option = SHOP.OPTIONS[optionKey];

        if (!option) {
            State.addMessage('无效的选项');
            return false;
        }

        // 检查金币是否足够
        if (State.hero.gold < option.cost) {
            State.addMessage(`金币不足！需要 ${option.cost} 金币`);
            return false;
        }

        // 执行购买
        State.hero.gold -= option.cost;

        if (option.atk > 0) {
            State.updateAtk(option.atk);
        }
        if (option.def > 0) {
            State.updateDef(option.def);
        }
        if (option.hp > 0) {
            State.updateHp(option.hp);
        }

        State.updateUI();
        State.addMessage(`购买成功！${option.name}`);

        return true;
    },

    // 获取所有选项
    getOptions() {
        return Config.SHOP.OPTIONS;
    },

    // 获取勇士当前金币
    getGold() {
        return State.hero.gold;
    }
};

window.Shop = Shop;