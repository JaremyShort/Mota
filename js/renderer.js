// 魔塔游戏 - 渲染模块

const Renderer = {
    canvas: null,
    ctx: null,

    // 初始化
    init() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
    },

    // 渲染整个地图
    render() {
        const { TILE_SIZE, GRID_SIZE, COLORS, TILE } = Config;
        const map = MapManager.getCurrentMap();
        const hero = State.hero;
        const movement = State.movement;

        // 清空画布
        this.ctx.fillStyle = COLORS.floor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制地图
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const tile = map[y][x];
                this.drawTile(x, y, tile);
            }
        }

        // 绘制勇士（考虑动画偏移）
        if (movement.isMoving) {
            this.drawHeroAnimated();
        } else {
            this.drawHero(hero.x, hero.y);
        }
    },

    // 绘制单个图块
    drawTile(x, y, tile) {
        const { TILE_SIZE, COLORS, TILE } = Config;

        // 先绘制地板（除墙壁外）
        if (tile !== TILE.WALL) {
            this.drawFloor(x, y);
        }

        // 根据类型绘制
        switch (tile) {
            case TILE.WALL:
                this.drawWall(x, y);
                break;
            case 'M':
            case 'M2':
            case 'M3':
                this.drawMonster(x, y);
                break;
            case 'KY':
                this.drawKey(x, y, COLORS.keyYellow);
                break;
            case 'KB':
                this.drawKey(x, y, COLORS.keyBlue);
                break;
            case 'KR':
                this.drawKey(x, y, COLORS.keyRed);
                break;
            case 'DY':
                this.drawDoor(x, y, COLORS.doorYellow);
                break;
            case 'DB':
                this.drawDoor(x, y, COLORS.doorBlue);
                break;
            case 'DR':
                this.drawDoor(x, y, COLORS.doorRed);
                break;
            case 'H1':
            case 'H2':
            case 'H3':
                this.drawHealthPotion(x, y);
                break;
            case 'GR':
                this.drawGem(x, y, COLORS.gemRed);
                break;
            case 'GB':
                this.drawGem(x, y, COLORS.gemBlue);
                break;
            case 'SU':
                this.drawStairUp(x, y);
                break;
            case 'SD':
                this.drawStairDown(x, y);
                break;
            case 'SH':
            case 'SH2':
                this.drawShop(x, y);
                break;
        }
    },

    // 绘制地板格子
    drawFloor(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        this.ctx.fillStyle = COLORS.floor;
        this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // 格子纹理
        this.ctx.strokeStyle = '#3a3a54';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px + 0.5, py + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    },

    // 绘制墙壁
    drawWall(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // 主体
        this.ctx.fillStyle = COLORS.wall;
        this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // 高光
        this.ctx.fillStyle = COLORS.wallHighlight;
        this.ctx.fillRect(px, py, TILE_SIZE, 8);
        this.ctx.fillRect(px, py, 8, TILE_SIZE);

        // 阴影
        this.ctx.fillStyle = COLORS.wallShadow;
        this.ctx.fillRect(px, py + TILE_SIZE - 4, TILE_SIZE, 4);
        this.ctx.fillRect(px + TILE_SIZE - 4, py, 4, TILE_SIZE);

        // 砖块纹理
        this.ctx.strokeStyle = COLORS.wallShadow;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py + 20);
        this.ctx.lineTo(px + TILE_SIZE, py + 20);
        this.ctx.moveTo(px + 20, py);
        this.ctx.lineTo(px + 20, py + 20);
        this.ctx.stroke();
    },

    // 绘制勇士
    drawHero(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;
        const size = 14;

        // 身体
        this.ctx.fillStyle = COLORS.hero;
        this.ctx.fillRect(px - size/2, py - size/2, size, size);

        // 轮廓
        this.ctx.strokeStyle = COLORS.heroOutline;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(px - size/2, py - size/2, size, size);

        // 眼睛
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(px - 4, py - 3, 3, 3);
        this.ctx.fillRect(px + 1, py - 3, 3, 3);

        // 剑
        this.ctx.fillStyle = '#aaa';
        this.ctx.fillRect(px + size/2, py - 2, 6, 4);

        // 盾牌
        this.ctx.fillStyle = '#4a4a8a';
        this.ctx.fillRect(px - size/2 - 5, py - 4, 5, 8);
        this.ctx.strokeStyle = '#6a6aaa';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px - size/2 - 5, py - 4, 5, 8);
    },

    // 绘制动画中的勇士
    drawHeroAnimated() {
        const { TILE_SIZE, MOVE_FRAMES } = Config;
        const movement = State.movement;

        // 计算当前位置（线性插值）
        const progress = movement.currentFrame / MOVE_FRAMES;
        const currentX = movement.startX + (movement.targetX - movement.startX) * progress;
        const currentY = movement.startY + (movement.targetY - movement.startY) * progress;

        this.drawHero(currentX, currentY);
    },

    // 绘制怪物
    drawMonster(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        // 身体
        this.ctx.fillStyle = COLORS.monster;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 12, 0, Math.PI * 2);
        this.ctx.fill();

        // 轮廓
        this.ctx.strokeStyle = COLORS.monsterOutline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 眼睛
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(px - 4, py - 2, 4, 0, Math.PI * 2);
        this.ctx.arc(px + 4, py - 2, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 瞳孔
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(px - 4, py - 2, 2, 0, Math.PI * 2);
        this.ctx.arc(px + 4, py - 2, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 嘴巴
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(px, py + 4, 5, 0, Math.PI);
        this.ctx.stroke();
    },

    // 绘制钥匙
    drawKey(x, y, color) {
        const { TILE_SIZE } = Config;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        // 头部
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(px - 2, py - 4, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // 孔
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(px - 2, py - 4, 2, 0, Math.PI * 2);
        this.ctx.fill();

        // 柄
        this.ctx.fillStyle = color;
        this.ctx.fillRect(px - 1, py + 2, 4, 10);

        // 齿
        this.ctx.fillRect(px + 3, py + 8, 4, 2);
        this.ctx.fillRect(px + 3, py + 5, 3, 2);
    },

    // 绘制门
    drawDoor(x, y, color) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // 门框
        this.ctx.fillStyle = COLORS.wall;
        this.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // 门板
        this.ctx.fillStyle = color;
        this.ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);

        // 锁
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(px + TILE_SIZE/2, py + TILE_SIZE/2, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillRect(px + TILE_SIZE/2 - 2, py + TILE_SIZE/2, 4, 6);
    },

    // 绘制血瓶
    drawHealthPotion(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        // 瓶身
        this.ctx.fillStyle = COLORS.healthPotion;
        this.ctx.beginPath();
        this.ctx.moveTo(px - 8, py);
        this.ctx.lineTo(px - 6, py + 10);
        this.ctx.lineTo(px + 6, py + 10);
        this.ctx.lineTo(px + 8, py);
        this.ctx.closePath();
        this.ctx.fill();

        // 瓶颈
        this.ctx.fillRect(px - 3, py - 6, 6, 8);

        // 瓶口
        this.ctx.fillStyle = '#aa4466';
        this.ctx.fillRect(px - 4, py - 8, 8, 3);

        // 高光
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        this.ctx.fillRect(px - 4, py + 2, 3, 5);

        // 十字
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(px - 1, py + 2, 2, 5);
        this.ctx.fillRect(px - 2, py + 3, 4, 2);
    },

    // 绘制宝石
    drawGem(x, y, color) {
        const { TILE_SIZE } = Config;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        // 宝石形状
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py - 10);
        this.ctx.lineTo(px + 8, py);
        this.ctx.lineTo(px, py + 10);
        this.ctx.lineTo(px - 8, py);
        this.ctx.closePath();
        this.ctx.fill();

        // 高光
        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
        this.ctx.beginPath();
        this.ctx.moveTo(px - 2, py - 6);
        this.ctx.lineTo(px + 4, py - 2);
        this.ctx.lineTo(px, py + 2);
        this.ctx.closePath();
        this.ctx.fill();
    },

    // 绘制上楼梯
    drawStairUp(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        this.ctx.fillStyle = COLORS.stairUp;

        // 台阶
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(px + 4 + i * 4, py + TILE_SIZE - 8 - i * 6, TILE_SIZE - 8 - i * 4, 6);
        }

        // 箭头
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.moveTo(px + TILE_SIZE/2, py + 8);
        this.ctx.lineTo(px + TILE_SIZE/2 - 5, py + 16);
        this.ctx.lineTo(px + TILE_SIZE/2 + 5, py + 16);
        this.ctx.closePath();
        this.ctx.fill();
    },

    // 绘制下楼梯
    drawStairDown(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        this.ctx.fillStyle = COLORS.stairDown;

        // 台阶（向下）
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(px + 4 + i * 4, py + 8 + i * 6, TILE_SIZE - 8 - i * 4, 6);
        }

        // 箭头
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.moveTo(px + TILE_SIZE/2, py + TILE_SIZE - 8);
        this.ctx.lineTo(px + TILE_SIZE/2 - 5, py + TILE_SIZE - 16);
        this.ctx.lineTo(px + TILE_SIZE/2 + 5, py + TILE_SIZE - 16);
        this.ctx.closePath();
        this.ctx.fill();
    },

    // 绘制商店/商人
    drawShop(x, y) {
        const { TILE_SIZE, COLORS } = Config;
        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        // 身体（方形，类似NPC）
        this.ctx.fillStyle = COLORS.shop;
        this.ctx.fillRect(px - 12, py - 12, 24, 24);

        // 轮廓
        this.ctx.strokeStyle = COLORS.shopOutline;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(px - 12, py - 12, 24, 24);

        // 帽子（商人特征）
        this.ctx.fillStyle = COLORS.shopOutline;
        this.ctx.beginPath();
        this.ctx.moveTo(px - 8, py - 12);
        this.ctx.lineTo(px, py - 18);
        this.ctx.lineTo(px + 8, py - 12);
        this.ctx.closePath();
        this.ctx.fill();

        // 眼睛
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(px - 6, py - 4, 3, 3);
        this.ctx.fillRect(px + 3, py - 4, 3, 3);

        // 金币符号
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(px, py + 6, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#000';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('$', px, py + 9);
    }
};

window.Renderer = Renderer;