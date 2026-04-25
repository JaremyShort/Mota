// 魔塔游戏 - UI更新模块

const UI = {
    shopDialog: null,

    // 初始化
    init() {
        this.statusPanel = document.querySelector('.status-panel');
        this.infoPanel = document.querySelector('.info-panel .info-content');
        this.floorIndicator = document.querySelector('.floor-indicator');
        this.createShopDialog();
    },

    // 创建商店对话框（动态创建）
    createShopDialog() {
        // 检查是否已存在
        if (document.getElementById('shop-dialog')) {
            this.shopDialog = document.getElementById('shop-dialog');
            return;
        }

        // 创建对话框元素
        this.shopDialog = document.createElement('div');
        this.shopDialog.id = 'shop-dialog';
        this.shopDialog.className = 'shop-dialog hidden';
        this.shopDialog.innerHTML = `
            <div class="shop-content">
                <h3 class="shop-title">神秘商店</h3>
                <p class="shop-gold">当前金币: <span class="shop-gold-value">0</span></p>
                <div class="shop-options">
                    <button class="shop-btn" data-option="ATK_1">1. 攻击+1 (10金币)</button>
                    <button class="shop-btn" data-option="ATK_5">2. 攻击+5 (50金币)</button>
                    <button class="shop-btn" data-option="DEF_1">3. 防御+1 (10金币)</button>
                    <button class="shop-btn" data-option="DEF_5">4. 防御+5 (50金币)</button>
                    <button class="shop-btn" data-option="HP_200">5. 生命+200 (20金币)</button>
                    <button class="shop-btn" data-option="HP_1000">6. 生命+1000 (100金币)</button>
                </div>
                <p class="shop-hint">按数字键购买，ESC或Q离开</p>
            </div>
        `;

        // 添加到页面
        document.querySelector('.game-container').appendChild(this.shopDialog);

        // 绑定按钮点击事件
        this.shopDialog.querySelectorAll('.shop-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const option = btn.dataset.option;
                Shop.buy(option);
                this.updateShopGold(State.hero.gold);
            });
        });
    },

    // 显示商店对话框
    showShopDialog(name) {
        if (this.shopDialog) {
            this.shopDialog.classList.remove('hidden');
            const title = this.shopDialog.querySelector('.shop-title');
            if (title) title.textContent = name;
            this.updateShopGold(State.hero.gold);
        }
    },

    // 隐藏商店对话框
    hideShopDialog() {
        if (this.shopDialog) {
            this.shopDialog.classList.add('hidden');
        }
    },

    // 更新商店金币显示
    updateShopGold(gold) {
        const goldEl = this.shopDialog?.querySelector('.shop-gold-value');
        if (goldEl) goldEl.textContent = gold;

        // 更新按钮可用状态
        const { SHOP } = Config;
        this.shopDialog?.querySelectorAll('.shop-btn').forEach(btn => {
            const option = SHOP.OPTIONS[btn.dataset.option];
            if (option) {
                btn.disabled = gold < option.cost;
                btn.classList.toggle('disabled', gold < option.cost);
            }
        });
    },

    // 更新状态显示
    updateStatus(hero) {
        const hpEl = document.querySelector('.status-value.hp');
        const atkEl = document.querySelector('.status-value.atk');
        const defEl = document.querySelector('.status-value.def');
        const goldEl = document.querySelector('.status-value.gold');

        const yellowKeyEl = document.querySelector('.yellow-key');
        const blueKeyEl = document.querySelector('.blue-key');
        const redKeyEl = document.querySelector('.red-key');

        if (hpEl) hpEl.textContent = hero.hp;
        if (atkEl) atkEl.textContent = hero.atk + hero.weapon;
        if (defEl) defEl.textContent = hero.def + hero.armor;
        if (goldEl) goldEl.textContent = hero.gold;

        if (yellowKeyEl) yellowKeyEl.textContent = hero.keys.yellow;
        if (blueKeyEl) blueKeyEl.textContent = hero.keys.blue;
        if (redKeyEl) redKeyEl.textContent = hero.keys.red;
    },

    // 更新楼层显示
    updateFloor(floor) {
        if (this.floorIndicator) {
            this.floorIndicator.textContent = `第 ${floor} 层`;
        }
    },

    // 更新消息列表
    updateMessages(messages) {
        if (this.infoPanel) {
            this.infoPanel.innerHTML = messages.map(msg =>
                `<p class="info-line">${msg}</p>`
            ).join('');
        }
    },

    // 清空消息
    clearMessages() {
        if (this.infoPanel) {
            this.infoPanel.innerHTML = '<p class="info-line">欢迎来到魔塔！</p>';
        }
    }
};

window.UI = UI;