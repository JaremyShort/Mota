// 魔塔游戏 - 鼠标悬停提示模块

const Tooltip = {
    tooltipEl: null,
    currentTile: null,

    // 初始化
    init() {
        this.createTooltip();
        this.bindEvents();
    },

    // 创建气泡元素
    createTooltip() {
        if (document.getElementById('monster-tooltip')) {
            this.tooltipEl = document.getElementById('monster-tooltip');
            return;
        }

        this.tooltipEl = document.createElement('div');
        this.tooltipEl.id = 'monster-tooltip';
        this.tooltipEl.className = 'monster-tooltip hidden';
        this.tooltipEl.innerHTML = `
            <div class="tooltip-name"></div>
            <div class="tooltip-stats">
                <div class="tooltip-row"><span>生命:</span><span class="tooltip-hp"></span></div>
                <div class="tooltip-row"><span>攻击:</span><span class="tooltip-atk"></span></div>
                <div class="tooltip-row"><span>防御:</span><span class="tooltip-def"></span></div>
                <div class="tooltip-row"><span>金币:</span><span class="tooltip-gold"></span></div>
                <div class="tooltip-row"><span>经验:</span><span class="tooltip-exp"></span></div>
            </div>
            <div class="tooltip-preview">
                <div class="tooltip-row predicted"><span>预计损血:</span><span class="tooltip-damage"></span></div>
                <div class="tooltip-row"><span>战斗回合:</span><span class="tooltip-rounds"></span></div>
            </div>
        `;

        document.querySelector('.game-container').appendChild(this.tooltipEl);
    },

    // 绑定Canvas鼠标事件
    bindEvents() {
        const canvas = Renderer.canvas;

        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseleave', () => this.hide());
    },

    // 处理鼠标移动
    handleMouseMove(e) {
        const { TILE_SIZE, GRID_SIZE } = Config;
        const rect = Renderer.canvas.getBoundingClientRect();
        const scaleX = Renderer.canvas.width / rect.width;
        const scaleY = Renderer.canvas.height / rect.height;

        // 计算鼠标在Canvas中的位置
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // 计算格子坐标
        const gridX = Math.floor(mouseX / TILE_SIZE);
        const gridY = Math.floor(mouseY / TILE_SIZE);

        // 检查是否在有效范围内
        if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE) {
            this.hide();
            return;
        }

        // 获取格子内容
        const tile = MapManager.getTile(gridX, gridY);
        const collision = MapManager.analyzeTile(tile);

        // 只对怪物显示气泡
        if (collision.type === Config.COLLISION.BATTLE) {
            this.show(e.clientX, e.clientY, collision.monster);
        } else {
            this.hide();
        }
    },

    // 显示气泡
    show(x, y, monster) {
        if (!this.tooltipEl || !monster) return;

        // 填充怪物数据
        this.tooltipEl.querySelector('.tooltip-name').textContent = monster.name;
        this.tooltipEl.querySelector('.tooltip-hp').textContent = monster.hp;
        this.tooltipEl.querySelector('.tooltip-atk').textContent = monster.atk;
        this.tooltipEl.querySelector('.tooltip-def').textContent = monster.def;
        this.tooltipEl.querySelector('.tooltip-gold').textContent = monster.gold;
        this.tooltipEl.querySelector('.tooltip-exp').textContent = monster.exp;

        // 计算战斗预览
        const preview = Battle.preview(monster);
        this.tooltipEl.querySelector('.tooltip-damage').textContent = preview.totalDamage;
        this.tooltipEl.querySelector('.tooltip-rounds').textContent = preview.rounds;

        // 检查能否获胜
        const canWin = preview.canWin;
        this.tooltipEl.querySelector('.tooltip-damage').classList.toggle('danger', !canWin);

        // 定位气泡（相对于页面）
        const offsetX = 15;
        const offsetY = 15;

        // 确保气泡不超出屏幕
        const tooltipWidth = 200;
        const tooltipHeight = 180;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let posX = x + offsetX;
        let posY = y + offsetY;

        if (posX + tooltipWidth > windowWidth) {
            posX = x - tooltipWidth - offsetX;
        }
        if (posY + tooltipHeight > windowHeight) {
            posY = y - tooltipHeight - offsetY;
        }

        this.tooltipEl.style.left = `${posX}px`;
        this.tooltipEl.style.top = `${posY}px`;
        this.tooltipEl.classList.remove('hidden');
    },

    // 隐藏气泡
    hide() {
        if (this.tooltipEl) {
            this.tooltipEl.classList.add('hidden');
        }
    }
};

window.Tooltip = Tooltip;