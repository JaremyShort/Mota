// 魔塔游戏 - 主程序入口

(function() {
    'use strict';

    // 等待所有模块加载完成
    function init() {
        // 初始化各模块
        Renderer.init();
        UI.init();
        Tooltip.init();
        Input.init();

        // 初始化勇士位置
        const map = MapManager.getCurrentMap();
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 'P' || map[y][x] === Config.TILE.FLOOR) {
                    State.initHero(1, 1);
                    break;
                }
            }
        }

        // 初始渲染
        Renderer.render();
        UI.updateStatus(State.hero);
        UI.updateFloor(State.currentFloor);

        // 初始消息
        State.addMessage('欢迎来到魔塔！');
        State.addMessage('使用方向键或 WASD 移动');

        console.log('魔塔游戏初始化完成');
        console.log('图块类型枚举:', Config.TILE);
        console.log('碰撞类型:', Config.COLLISION);
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();