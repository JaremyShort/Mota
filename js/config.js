// 魔塔游戏 - 配置与常量模块

const Config = {
    // 画布尺寸
    TILE_SIZE: 40,
    GRID_SIZE: 14,
    CANVAS_WIDTH: 560,
    CANVAS_HEIGHT: 560,

    // 移动动画帧数
    MOVE_FRAMES: 8,
    FRAME_INTERVAL: 16, // 约60fps

    // 图块类型枚举
    TILE: {
        FLOOR: 0,           // 空地（可通行）
        WALL: 1,            // 墙壁（不可通行）
        MONSTER: 'M',       // 怪物（触发战斗）
        KEY_YELLOW: 'KY',   // 黄钥匙
        KEY_BLUE: 'KB',     // 蓝钥匙
        KEY_RED: 'KR',      // 红钥匙
        DOOR_YELLOW: 'DY',  // 黄门（需钥匙）
        DOOR_BLUE: 'DB',    // 蓝门
        DOOR_RED: 'DR',     // 红门
        HEALTH_SMALL: 'H1', // 小血瓶 +200HP
        HEALTH_LARGE: 'H2', // 大血瓶 +500HP
        HEALTH_SUPER: 'H3', // 超级血瓶 +1000HP
        GEM_RED: 'GR',      // 红宝石 +2ATK
        GEM_BLUE: 'GB',     // 蓝宝石 +2DEF
        STAIR_UP: 'SU',     // 上楼梯
        STAIR_DOWN: 'SD',   // 下楼梯
        NPC: 'N',           // NPC（对话）
        SHOP: 'S',          // 商店
        HERO_START: 'P'     // 勇士起始点
    },

    // 碰撞类型
    COLLISION: {
        PASSABLE: 'passable',       // 可通行
        BLOCKED: 'blocked',         // 不可通行（墙）
        BATTLE: 'battle',           // 触发战斗
        ITEM: 'item',               // 道具拾取
        DOOR: 'door',               // 需钥匙开门
        STAIR: 'stair',             // 楼梯切换
        NPC: 'npc',                 // NPC对话
        SHOP: 'shop'                // 商店购买
    },

    // 商店配置
    SHOP: {
        COST_PER_POINT: 10,         // 每1点属性花费金币
        MIN_GOLD: 0,                // 最小金币
        OPTIONS: {
            ATK_1: { name: '攻击+1', cost: 10, atk: 1, def: 0 },
            ATK_5: { name: '攻击+5', cost: 50, atk: 5, def: 0 },
            DEF_1: { name: '防御+1', cost: 10, atk: 0, def: 1 },
            DEF_5: { name: '防御+5', cost: 50, atk: 0, def: 5 },
            HP_200: { name: '生命+200', cost: 20, hp: 200, atk: 0, def: 0 },
            HP_1000: { name: '生命+1000', cost: 100, hp: 1000, atk: 0, def: 0 }
        }
    },

    // 配色方案
    COLORS: {
        floor: '#2d2d44',
        wall: '#4a4a6a',
        wallHighlight: '#6a6a8a',
        wallShadow: '#3a3a5a',
        hero: '#ffcc00',
        heroOutline: '#cc9900',
        monster: '#ff4444',
        monsterOutline: '#cc0000',
        keyYellow: '#ffff00',
        keyBlue: '#00aaff',
        keyRed: '#ff0000',
        doorYellow: '#ffff00',
        doorBlue: '#00aaff',
        doorRed: '#ff0000',
        healthPotion: '#ff6688',
        gemRed: '#ff4444',
        gemBlue: '#44aaff',
        stairUp: '#88ff88',
        stairDown: '#66aa66',
        shop: '#aaffaa',
        shopOutline: '#66aa66'
    }
};

// 导出配置
window.Config = Config;