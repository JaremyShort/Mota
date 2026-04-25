// 魔塔游戏 - 地图管理模块

const MapManager = {
    // 地图数据存储（按楼层）
    floors: {
        1: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,'GR',0,1,0,0,0,0,1,0,1],
            [1,0,1,1,1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,'KY',0,'SH',0,0,0,0,0,1],
            [1,0,1,0,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,'H1',0,0,0,'GB',0,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,'SU',1],
            [1,0,1,1,1,1,1,'M',1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ],
        2: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,'SD',0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1],
            [1,0,1,'M','M',0,0,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,1,'GR',0,0,0,1,0,1],
            [1,0,1,1,1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,'KB',0,0,0,0,'DY',0,0,1],
            [1,0,1,0,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,'H2',0,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,'M',1,1,1,1,'SU',1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ]
    },

    // 怪物数据（按类型）
    monsters: {
        'M': { name: '史莱姆', hp: 50, atk: 20, def: 10, gold: 5, exp: 1 },
        'M2': { name: '骷髅兵', hp: 100, atk: 40, def: 20, gold: 10, exp: 3 },
        'M3': { name: '蝙蝠', hp: 80, atk: 30, def: 5, gold: 8, exp: 2 }
    },

    // 道具数据（红宝石+3攻击、蓝宝石+3防御）
    items: {
        'KY': { type: 'key', color: 'yellow', name: '黄钥匙' },
        'KB': { type: 'key', color: 'blue', name: '蓝钥匙' },
        'KR': { type: 'key', color: 'red', name: '红钥匙' },
        'H1': { type: 'health', value: 200, name: '小血瓶' },
        'H2': { type: 'health', value: 500, name: '大血瓶' },
        'H3': { type: 'health', value: 1000, name: '超级血瓶' },
        'GR': { type: 'atk', value: 3, name: '红宝石' },
        'GB': { type: 'def', value: 3, name: '蓝宝石' }
    },

    // 商店/商人数据
    shops: {
        'SH': { name: '神秘商人', greeting: '欢迎光临！我可以帮你提升能力...' },
        'SH2': { name: '旅行商人', greeting: '难得相遇，让我看看你的实力...' }
    },

    // 门数据
    doors: {
        'DY': { color: 'yellow', name: '黄门' },
        'DB': { color: 'blue', name: '蓝门' },
        'DR': { color: 'red', name: '红门' }
    },

    // 获取当前楼层地图
    getCurrentMap() {
        return this.floors[State.currentFloor] || this.floors[1];
    },

    // 获取指定位置的图块
    getTile(x, y) {
        const map = this.getCurrentMap();
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
            return map[y][x];
        }
        return Config.TILE.WALL; // 边界外视为墙
    },

    // 设置指定位置的图块（清除道具/怪物后）
    setTile(x, y, tile) {
        const map = this.getCurrentMap();
        if (y >= 0 && y < map.length && x >= 0 && x < map[0].length) {
            map[y][x] = tile;
        }
    },

    // 分析图块类型，返回碰撞类型
    analyzeTile(tile) {
        const { TILE, COLLISION } = Config;

        // 空地
        if (tile === TILE.FLOOR) {
            return { type: COLLISION.PASSABLE };
        }

        // 墙壁
        if (tile === TILE.WALL) {
            return { type: COLLISION.BLOCKED };
        }

        // 怪物
        if (tile === 'M' || tile === 'M2' || tile === 'M3') {
            return { type: COLLISION.BATTLE, monster: this.monsters[tile] };
        }

        // 钥匙
        if (tile === 'KY' || tile === 'KB' || tile === 'KR') {
            return { type: COLLISION.ITEM, item: this.items[tile] };
        }

        // 血瓶
        if (tile === 'H1' || tile === 'H2' || tile === 'H3') {
            return { type: COLLISION.ITEM, item: this.items[tile] };
        }

        // 宝石
        if (tile === 'GR' || tile === 'GB') {
            return { type: COLLISION.ITEM, item: this.items[tile] };
        }

        // 门
        if (tile === 'DY' || tile === 'DB' || tile === 'DR') {
            return { type: COLLISION.DOOR, door: this.doors[tile] };
        }

        // 楼梯
        if (tile === 'SU') {
            return { type: COLLISION.STAIR, direction: 'up' };
        }
        if (tile === 'SD') {
            return { type: COLLISION.STAIR, direction: 'down' };
        }

        // NPC
        if (tile === 'N') {
            return { type: COLLISION.NPC };
        }

        // 商店/商人
        if (tile === 'SH' || tile === 'SH2') {
            return { type: COLLISION.SHOP, shop: this.shops[tile] };
        }

        // 默认可通行
        return { type: COLLISION.PASSABLE };
    },

    // 切换楼层
    changeFloor(direction) {
        const current = State.currentFloor;

        if (direction === 'up' && current < 50) {
            State.currentFloor = current + 1;
            State.addMessage(`进入第 ${State.currentFloor} 层`);
            // 设置勇士到下楼梯位置
            this.placeHeroAtStair('down');
        } else if (direction === 'down' && current > 1) {
            State.currentFloor = current - 1;
            State.addMessage(`回到第 ${State.currentFloor} 层`);
            // 设置勇士到上楼梯位置
            this.placeHeroAtStair('up');
        } else if (direction === 'up' && current >= 50) {
            State.addMessage('已到达塔顶！');
        }

        // 更新UI楼层显示
        if (window.UI) {
            window.UI.updateFloor(State.currentFloor);
        }

        // 重绘地图
        if (window.Renderer) {
            window.Renderer.render();
        }
    },

    // 将勇士放置在楼梯位置
    placeHeroAtStair(stairType) {
        const map = this.getCurrentMap();
        const targetTile = stairType === 'up' ? 'SU' : 'SD';

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === targetTile) {
                    State.initHero(x, y);
                    return;
                }
            }
        }
        // 默认位置
        State.initHero(1, 1);
    }
};

window.MapManager = MapManager;