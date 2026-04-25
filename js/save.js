// 魔塔游戏 - 存档系统模块

const SaveSystem = {
    SAVE_KEY: 'mota_save_data',
    MAX_SLOTS: 3,

    // 保存游戏数据
    save(slotId = 1) {
        if (slotId < 1 || slotId > this.MAX_SLOTS) {
            State.addMessage('无效的存档位');
            return false;
        }

        const saveData = {
            hero: {
                x: State.hero.x,
                y: State.hero.y,
                hp: State.hero.hp,
                atk: State.hero.atk,
                def: State.hero.def,
                gold: State.hero.gold,
                exp: State.hero.exp,
                keys: { ...State.hero.keys },
                weapon: State.hero.weapon,
                armor: State.hero.armor
            },
            currentFloor: State.currentFloor,
            maps: JSON.parse(JSON.stringify(MapManager.floors)),
            timestamp: Date.now()
        };

        try {
            const allSaves = this.getAllSaves();
            allSaves[slotId] = saveData;
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(allSaves));
            State.addMessage(`游戏已保存到存档 ${slotId}`);
            return true;
        } catch (e) {
            State.addMessage('保存失败！');
            console.error('Save error:', e);
            return false;
        }
    },

    // 加载游戏数据
    load(slotId = 1) {
        if (slotId < 1 || slotId > this.MAX_SLOTS) {
            State.addMessage('无效的存档位');
            return false;
        }

        try {
            const allSaves = this.getAllSaves();
            const saveData = allSaves[slotId];

            if (!saveData) {
                State.addMessage('该存档位为空');
                return false;
            }

            // 恢复勇士状态
            State.hero.x = saveData.hero.x;
            State.hero.y = saveData.hero.y;
            State.hero.hp = saveData.hero.hp;
            State.hero.atk = saveData.hero.atk;
            State.hero.def = saveData.hero.def;
            State.hero.gold = saveData.hero.gold;
            State.hero.exp = saveData.hero.exp;
            State.hero.keys = { ...saveData.hero.keys };
            State.hero.weapon = saveData.hero.weapon;
            State.hero.armor = saveData.hero.armor;

            // 恢复楼层
            State.currentFloor = saveData.currentFloor;

            // 恢复地图状态
            MapManager.floors = JSON.parse(JSON.stringify(saveData.maps));

            // 更新UI
            State.updateUI();
            UI.updateFloor(State.currentFloor);

            State.addMessage(`已加载存档 ${slotId}`);
            return true;
        } catch (e) {
            State.addMessage('加载失败！');
            console.error('Load error:', e);
            return false;
        }
    },

    // 获取所有存档
    getAllSaves() {
        try {
            const data = localStorage.getItem(this.SAVE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    // 删除存档
    delete(slotId = 1) {
        if (slotId < 1 || slotId > this.MAX_SLOTS) {
            return false;
        }

        try {
            const allSaves = this.getAllSaves();
            delete allSaves[slotId];
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(allSaves));
            State.addMessage(`存档 ${slotId} 已删除`);
            return true;
        } catch (e) {
            return false;
        }
    },

    // 检查存档是否存在
    hasSave(slotId = 1) {
        const allSaves = this.getAllSaves();
        return !!allSaves[slotId];
    },

    // 获取存档信息（用于显示存档列表）
    getSaveInfo(slotId = 1) {
        const allSaves = this.getAllSaves();
        const saveData = allSaves[slotId];

        if (!saveData) {
            return null;
        }

        return {
            floor: saveData.currentFloor,
            hp: saveData.hero.hp,
            gold: saveData.hero.gold,
            timestamp: saveData.timestamp
        };
    }
};

window.SaveSystem = SaveSystem;