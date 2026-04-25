// 魔塔游戏 - 输入与移动控制模块

const Input = {
    // 方向映射
    directions: {
        ArrowUp: { dx: 0, dy: -1, name: 'up' },
        ArrowDown: { dx: 0, dy: 1, name: 'down' },
        ArrowLeft: { dx: -1, dy: 0, name: 'left' },
        ArrowRight: { dx: 1, dy: 0, name: 'right' },
        w: { dx: 0, dy: -1, name: 'up' },
        W: { dx: 0, dy: -1, name: 'up' },
        s: { dx: 0, dy: 1, name: 'down' },
        S: { dx: 0, dy: 1, name: 'down' },
        a: { dx: -1, dy: 0, name: 'left' },
        A: { dx: -1, dy: 0, name: 'left' },
        d: { dx: 1, dy: 0, name: 'right' },
        D: { dx: 1, dy: 0, name: 'right' }
    },

    // 初始化键盘监听
    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    },

    // 处理按键
    handleKeyDown(e) {
        // 商店模式下处理特殊按键
        if (Shop.isOpen) {
            this.handleShopInput(e);
            return;
        }

        // 检查游戏状态
        if (State.game.isPaused || State.game.isInBattle || State.game.isInDialog) {
            return;
        }

        // 检查移动锁定
        if (State.movement.isMoving) {
            return;
        }

        // 获取方向
        const dir = this.directions[e.key];
        if (!dir) {
            return;
        }

        // 阻止默认行为（页面滚动）
        e.preventDefault();

        // 计算目标位置
        const targetX = State.hero.x + dir.dx;
        const targetY = State.hero.y + dir.dy;

        // 执行移动尝试
        this.tryMove(targetX, targetY, dir.name);
    },

    // 尝试移动到目标位置
    tryMove(targetX, targetY, direction) {
        const tile = MapManager.getTile(targetX, targetY);
        const collision = MapManager.analyzeTile(tile);
        const { COLLISION } = Config;

        switch (collision.type) {
            case COLLISION.BLOCKED:
                // 墙壁，无法移动
                State.addMessage('无法通过！');
                break;

            case COLLISION.PASSABLE:
                // 空地，开始移动动画
                this.startMove(targetX, targetY, direction);
                break;

            case COLLISION.BATTLE:
                // 怪物，触发战斗
                const result = Battle.execute(collision.monster, targetX, targetY);
                if (result) {
                    this.startMove(targetX, targetY, direction);
                }
                break;

            case COLLISION.ITEM:
                // 道具，拾取后移动
                ItemSystem.pickup(collision.item, targetX, targetY);
                this.startMove(targetX, targetY, direction);
                break;

            case COLLISION.DOOR:
                // 门，尝试开门
                if (ItemSystem.openDoor(collision.door, targetX, targetY)) {
                    this.startMove(targetX, targetY, direction);
                }
                break;

            case COLLISION.STAIR:
                // 楼梯，切换楼层
                this.startMove(targetX, targetY, direction, () => {
                    MapManager.changeFloor(collision.direction);
                });
                break;

            case COLLISION.NPC:
                // NPC对话（后续扩展）
                State.addMessage('遇到神秘人...');
                break;

            case COLLISION.SHOP:
                // 商店，打开商店界面
                Shop.open(collision.shop);
                break;
        }
    },

    // 开始移动动画
    startMove(targetX, targetY, direction, onComplete) {
        const { MOVE_FRAMES, FRAME_INTERVAL } = Config;

        State.movement.isMoving = true;
        State.movement.targetX = targetX;
        State.movement.targetY = targetY;
        State.movement.startX = State.hero.x;
        State.movement.startY = State.hero.y;
        State.movement.currentFrame = 0;
        State.movement.direction = direction;
        State.movement.onComplete = onComplete;

        // 启动动画循环
        this.animateMove();
    },

    // 动画循环
    animateMove() {
        const { MOVE_FRAMES, FRAME_INTERVAL } = Config;
        const movement = State.movement;

        // 更新帧
        movement.currentFrame++;

        // 重绘
        Renderer.render();

        // 检查完成
        if (movement.currentFrame >= MOVE_FRAMES) {
            this.completeMove();
        } else {
            // 继续下一帧
            setTimeout(() => this.animateMove(), FRAME_INTERVAL);
        }
    },

    // 完成移动
    completeMove() {
        const movement = State.movement;

        // 更新勇士位置
        State.updateHeroPosition(movement.targetX, movement.targetY);

        // 重置移动状态
        State.movement.isMoving = false;
        State.movement.currentFrame = 0;

        // 执行回调（如楼梯切换）
        if (movement.onComplete) {
            movement.onComplete();
            movement.onComplete = null;
        }

        // 最终渲染
        Renderer.render();
    },

    // 处理商店输入
    handleShopInput(e) {
        const key = e.key;

        // ESC 关闭商店
        if (key === 'Escape' || key === 'q' || key === 'Q') {
            Shop.close();
            e.preventDefault();
            return;
        }

        // 数字键选择购买选项
        const optionMap = {
            '1': 'ATK_1',
            '2': 'ATK_5',
            '3': 'DEF_1',
            '4': 'DEF_5',
            '5': 'HP_200',
            '6': 'HP_1000'
        };

        if (optionMap[key]) {
            e.preventDefault();
            Shop.buy(optionMap[key]);
            UI.updateShopGold(State.hero.gold);
        }
    }
};

window.Input = Input;