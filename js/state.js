// 魔塔游戏 - 状态管理模块

const State = {
    // 勇士属性
    hero: {
        x: 1,
        y: 1,
        hp: 1000,
        atk: 10,
        def: 10,
        gold: 0,
        exp: 0,
        keys: {
            yellow: 1,
            blue: 0,
            red: 0
        },
        weapon: 0,   // 武器加成
        armor: 0     // 防具加成
    },

    // 当前楼层
    currentFloor: 1,

    // 移动状态
    movement: {
        isMoving: false,
        targetX: 0,
        targetY: 0,
        currentFrame: 0,
        startX: 0,
        startY: 0,
        direction: null // 'up', 'down', 'left', 'right'
    },

    // 游戏状态
    game: {
        isPaused: false,
        isInBattle: false,
        isInDialog: false,
        messageLog: []
    },

    // 初始化勇士位置
    initHero(x, y) {
        this.hero.x = x;
        this.hero.y = y;
        this.movement.isMoving = false;
    },

    // 更新勇士位置（移动完成后调用）
    updateHeroPosition(x, y) {
        this.hero.x = x;
        this.hero.y = y;
    },

    // 获取勇士总攻击力
    getTotalAtk() {
        return this.hero.atk + this.hero.weapon;
    },

    // 获取勇士总防御力
    getTotalDef() {
        return this.hero.def + this.hero.armor;
    },

    // 添加钥匙
    addKey(color, count = 1) {
        this.hero.keys[color] += count;
        this.updateUI();
    },

    // 使用钥匙
    useKey(color) {
        if (this.hero.keys[color] > 0) {
            this.hero.keys[color]--;
            this.updateUI();
            return true;
        }
        return false;
    },

    // 更新生命值
    updateHp(value) {
        this.hero.hp = Math.max(0, this.hero.hp + value);
        this.updateUI();
        if (this.hero.hp <= 0) {
            this.gameOver();
        }
    },

    // 更新属性
    updateAtk(value) {
        this.hero.atk += value;
        this.updateUI();
    },

    updateDef(value) {
        this.hero.def += value;
        this.updateUI();
    },

    updateGold(value) {
        this.hero.gold += value;
        this.updateUI();
    },

    updateExp(value) {
        this.hero.exp += value;
        this.updateUI();
    },

    // 更新UI显示
    updateUI() {
        const ui = window.UI;
        if (ui) {
            ui.updateStatus(this.hero);
        }
    },

    // 添加消息
    addMessage(text) {
        this.game.messageLog.push(text);
        if (this.game.messageLog.length > 10) {
            this.game.messageLog.shift();
        }
        const ui = window.UI;
        if (ui) {
            ui.updateMessages(this.game.messageLog);
        }
    },

    // 游戏结束
    gameOver() {
        this.game.isPaused = true;
        this.addMessage('你被击败了...游戏结束');
        alert('游戏结束！你被击败了。');
    },

    // 重置状态
    reset() {
        this.hero = {
            x: 1, y: 1,
            hp: 1000, atk: 10, def: 10,
            gold: 0, exp: 0,
            keys: { yellow: 1, blue: 0, red: 0 },
            weapon: 0, armor: 0
        };
        this.currentFloor = 1;
        this.movement.isMoving = false;
        this.game = {
            isPaused: false,
            isInBattle: false,
            isInDialog: false,
            messageLog: []
        };
    }
};

window.State = State;