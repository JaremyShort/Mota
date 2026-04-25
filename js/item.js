// 魔塔游戏 - 道具系统模块

const ItemSystem = {
    // 拾取道具
    pickup(item, x, y) {
        const { type, value, color, name } = item;

        switch (type) {
            case 'key':
                State.addKey(color);
                State.addMessage(`获得 ${name}`);
                break;

            case 'health':
                State.updateHp(value);
                State.addMessage(`获得 ${name}，生命 +${value}`);
                break;

            case 'atk':
                State.updateAtk(value);
                State.addMessage(`获得 ${name}，攻击 +${value}`);
                break;

            case 'def':
                State.updateDef(value);
                State.addMessage(`获得 ${name}，防御 +${value}`);
                break;

            default:
                State.addMessage(`获得 ${name}`);
        }

        // 清除道具
        MapManager.setTile(x, y, Config.TILE.FLOOR);
    },

    // 开门
    openDoor(door, x, y) {
        const { color, name } = door;

        if (State.useKey(color)) {
            MapManager.setTile(x, y, Config.TILE.FLOOR);
            State.addMessage(`使用钥匙打开了 ${name}`);
            return true;
        }

        State.addMessage(`没有 ${name} 对应的钥匙！`);
        return false;
    }
};

window.ItemSystem = ItemSystem;