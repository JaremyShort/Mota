/**
 * 魔塔游戏核心模块测试
 * 测试框架：Jest
 */

// 获取模块引用
const Config = window.Config;
const State = window.State;
const MapManager = window.MapManager;
const Battle = window.Battle;
const ItemSystem = window.ItemSystem;
const Shop = window.Shop;
const SaveSystem = window.SaveSystem;
const Input = window.Input;

// 模拟 localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
global.localStorage = localStorageMock;

// ============================================
// 勇士移动测试
// ============================================
describe('勇士移动系统', () => {

  beforeEach(() => {
    // 重置状态
    State.reset();
    State.initHero(1, 1);
    State.hero.hp = 1000;
    State.hero.atk = 10;
    State.hero.def = 10;
    State.hero.gold = 0;
    State.hero.keys = { yellow: 0, blue: 0, red: 0 };
    localStorageMock.clear();
  });

  /**
   * 测试场景：撞墙阻挡
   * 设计意图：验证勇士无法穿越墙壁，位置保持不变
   * 输入：尝试移动到墙壁位置 (0, 1)
   * 操作：调用 tryMove 到墙格子
   * 断言：勇士位置不变，消息提示"无法通过"
   */
  test('撞墙时勇士位置不变', () => {
    const initialX = State.hero.x;
    const initialY = State.hero.y;

    // 检查位置 (0, 1) 是墙
    const tile = MapManager.getTile(0, 1);
    expect(tile).toBe(Config.TILE.WALL);

    // 尝试移动到墙壁
    Input.tryMove(0, 1, 'left');

    // 验证位置不变
    expect(State.hero.x).toBe(initialX);
    expect(State.hero.y).toBe(initialY);

    // 验证消息记录
    const messages = State.game.messageLog;
    expect(messages.some(msg => msg.includes('无法通过'))).toBe(true);
  });

  /**
   * 测试场景：空地移动
   * 设计意图：验证勇士可以正常移动到空地
   * 输入：移动到空地位置 (1, 2)
   * 操作：模拟移动（直接更新位置）
   * 断言：勇士位置更新为目标位置
   */
  test('移动到空地成功', () => {
    // 直接测试碰撞检测
    const targetTile = MapManager.getTile(1, 2);
    const collision = MapManager.analyzeTile(targetTile);

    expect(collision.type).toBe(Config.COLLISION.PASSABLE);

    // 模拟移动成功
    State.updateHeroPosition(1, 2);
    expect(State.hero.x).toBe(1);
    expect(State.hero.y).toBe(2);
  });

  /**
   * 测试场景：拾取钥匙
   * 设计意图：验证拾取钥匙后钥匙计数增加，道具从地图消失
   * 输入：移动到钥匙位置 (5, 7) - 第1层有黄钥匙
   * 操作：调用 ItemSystem.pickup
   * 断言：钥匙数+1，地图格子变为空地
   */
  test('拾取钥匙后计数增加', () => {
    // 初始钥匙数
    const initialKeys = State.hero.keys.yellow;

    // 模拟拾取黄钥匙
    const keyItem = MapManager.items['KY'];
    ItemSystem.pickup(keyItem, 5, 7);

    // 验证钥匙数增加
    expect(State.hero.keys.yellow).toBe(initialKeys + 1);

    // 验证地图格子变为空地
    const tileAfter = MapManager.getTile(5, 7);
    expect(tileAfter).toBe(Config.TILE.FLOOR);

    // 验证消息记录
    const messages = State.game.messageLog;
    expect(messages.some(msg => msg.includes('黄钥匙'))).toBe(true);
  });

  /**
   * 测试场景：拾取宝石
   * 设计意图：验证拾取宝石后攻击/防御属性正确增加
   */
  test('拾取红宝石后攻击增加', () => {
    const initialAtk = State.hero.atk;

    const gemItem = MapManager.items['GR'];
    ItemSystem.pickup(gemItem, 1, 1);

    expect(State.hero.atk).toBe(initialAtk + 3);
  });

  test('拾取蓝宝石后防御增加', () => {
    const initialDef = State.hero.def;

    const gemItem = MapManager.items['GB'];
    ItemSystem.pickup(gemItem, 1, 1);

    expect(State.hero.def).toBe(initialDef + 3);
  });

  /**
   * 测试场景：拾取血瓶
   * 设计意图：验证拾取血瓶后生命值正确增加
   */
  test('拾取血瓶后生命增加', () => {
    const initialHp = State.hero.hp;

    const healthItem = MapManager.items['H1'];
    ItemSystem.pickup(healthItem, 1, 1);

    expect(State.hero.hp).toBe(initialHp + 200);
  });
});

// ============================================
// 战斗系统测试
// ============================================
describe('战斗系统', () => {

  beforeEach(() => {
    State.reset();
    State.hero.hp = 1000;
    State.hero.atk = 50;
    State.hero.def = 30;
    State.hero.gold = 0;
  });

  /**
   * 测试场景：攻击小于防御不破防
   * 设计意图：验证勇士攻击低于怪物防御时，每回合伤害为1（最低伤害）
   * 输入：勇士攻击10，怪物防御20
   * 断言：勇士对怪物伤害 = max(1, 10-20) = 1
   */
  test('攻击低于防御时伤害为1', () => {
    const result = Battle.calculateDamage(10, 30, {
      name: '测试怪物',
      hp: 100,
      atk: 25,
      def: 20,
      gold: 10,
      exp: 5
    });

    // 勇士攻击10 < 怪物防御20，不破防
    expect(result.heroDamage).toBe(1); // 最低伤害
  });

  /**
   * 测试场景：双方伤害正确计算
   * 设计意图：验证攻防差公式计算正确
   * 输入：勇士攻击50防御30，怪物HP100攻击40防御10
   * 断言：
   *   - 勇士每回合伤害 = 50-10 = 40
   *   - 怪物每回合伤害 = 40-30 = 10
   *   - 战斗回合 = ceil(100/40) = 3
   *   - 总损血 = 3*10 = 30
   */
  test('双方伤害计算正确', () => {
    State.hero.atk = 50;
    State.hero.def = 30;

    const monster = {
      name: '史莱姆',
      hp: 100,
      atk: 40,
      def: 10,
      gold: 10,
      exp: 5
    };

    const result = Battle.calculateDamage(50, 30, monster);

    expect(result.heroDamage).toBe(40); // 50-10=40
    expect(result.monsterDamage).toBe(10); // 40-30=10
    expect(result.rounds).toBe(3); // ceil(100/40)=3
    expect(result.totalDamage).toBe(30); // 3*10=30
  });

  /**
   * 测试场景：胜利后移除怪物
   * 设计意图：验证击败怪物后地图格子变为空地，金币经验增加
   * 输入：勇士属性足够击败怪物
   * 操作：调用 Battle.execute
   * 断言：怪物消失，金币增加
   */
  test('胜利后移除怪物并获得奖励', () => {
    State.hero.hp = 1000;
    State.hero.atk = 50;
    State.hero.def = 30;

    // 设置怪物位置
    MapManager.setTile(7, 12, 'M');
    const monster = MapManager.monsters['M'];

    const initialGold = State.hero.gold;
    const result = Battle.execute(monster, 7, 12);

    expect(result).toBe(true);
    expect(MapManager.getTile(7, 12)).toBe(Config.TILE.FLOOR);
    expect(State.hero.gold).toBe(initialGold + monster.gold);
  });

  /**
   * 测试场景：失败弹出Game Over
   * 设计意图：勇士生命不足以击败怪物时，战斗失败
   * 输入：勇士HP10，怪物需要30损血才能击败
   * 断言：canWin为false
   */
  test('生命不足时无法获胜', () => {
    State.hero.hp = 10;
    State.hero.atk = 5;
    State.hero.def = 5;

    const monster = {
      name: '强怪',
      hp: 100,
      atk: 50,
      def: 30,
      gold: 100,
      exp: 50
    };

    const result = Battle.preview(monster);

    // 怪物攻击50 - 勇士防御5 = 45伤害
    // 勇士攻击5 - 怪物防御30 = 1伤害（不破防）
    // 回合数 = ceil(100/1) = 100
    // 总损血 = 100 * 45 = 4500，远超勇士10HP
    expect(result.canWin).toBe(false);
  });

  /**
   * 测试场景：怪物防御为0时的计算
   */
  test('怪物无防御时全额伤害', () => {
    const result = Battle.calculateDamage(50, 30, {
      name: '无防怪物',
      hp: 50,
      atk: 20,
      def: 0,
      gold: 5,
      exp: 1
    });

    expect(result.heroDamage).toBe(50); // 50-0=50
  });
});

// ============================================
// 商店系统测试
// ============================================
describe('商店系统', () => {

  beforeEach(() => {
    State.reset();
    State.hero.gold = 100;
    State.hero.atk = 10;
    State.hero.def = 10;
    State.hero.hp = 1000;
    Shop.isOpen = false;
    Shop.currentShop = null;
  });

  /**
   * 测试场景：金币足够购买成功
   * 设计意图：验证购买后属性正确增加，金币正确扣除
   * 输入：金币100，购买攻击+1（花费10）
   * 断言：攻击变为11，金币变为90
   */
  test('金币足够时购买成功', () => {
    const initialGold = State.hero.gold;
    const initialAtk = State.hero.atk;

    const result = Shop.buy('ATK_1');

    expect(result).toBe(true);
    expect(State.hero.atk).toBe(initialAtk + 1);
    expect(State.hero.gold).toBe(initialGold - 10);
  });

  /**
   * 测试场景：金币不足提示
   * 设计意图：验证金币不足时购买失败，属性不变
   * 输入：金币5，购买攻击+1（花费10）
   * 断言：购买失败，金币和攻击不变
   */
  test('金币不足时购买失败', () => {
    State.hero.gold = 5;
    const initialGold = State.hero.gold;
    const initialAtk = State.hero.atk;

    const result = Shop.buy('ATK_1');

    expect(result).toBe(false);
    expect(State.hero.gold).toBe(initialGold);
    expect(State.hero.atk).toBe(initialAtk);

    // 验证消息提示
    const messages = State.game.messageLog;
    expect(messages.some(msg => msg.includes('金币不足'))).toBe(true);
  });

  /**
   * 测试场景：批量购买
   * 设计意图：验证连续购买多次属性累加正确
   */
  test('连续购买多次属性累加', () => {
    State.hero.gold = 100;

    Shop.buy('ATK_1'); // 10金币
    Shop.buy('ATK_1'); // 10金币
    Shop.buy('DEF_1'); // 10金币

    expect(State.hero.atk).toBe(12); // 10+1+1
    expect(State.hero.def).toBe(11); // 10+1
    expect(State.hero.gold).toBe(70); // 100-30
  });

  /**
   * 测试场景：购买生命值
   */
  test('购买生命值成功', () => {
    State.hero.gold = 30;
    State.hero.hp = 500;

    Shop.buy('HP_200');

    expect(State.hero.hp).toBe(700);
    expect(State.hero.gold).toBe(10);
  });

  /**
   * 测试场景：购买大额属性包
   */
  test('购买攻击+5成功', () => {
    State.hero.gold = 60;

    Shop.buy('ATK_5');

    expect(State.hero.atk).toBe(15);
    expect(State.hero.gold).toBe(10);
  });
});

// ============================================
// 存档读档测试
// ============================================
describe('存档读档系统', () => {

  beforeEach(() => {
    State.reset();
    State.hero.x = 5;
    State.hero.y = 5;
    State.hero.hp = 500;
    State.hero.atk = 20;
    State.hero.def = 15;
    State.hero.gold = 100;
    State.hero.keys = { yellow: 3, blue: 2, red: 1 };
    State.currentFloor = 2;
    localStorageMock.clear();
  });

  /**
   * 测试场景：保存后加载数据一致
   * 设计意图：验证存档可以完整保存和恢复勇士状态
   * 输入：勇士位置(5,5)，HP500，金币100等
   * 操作：保存到槽位1，然后加载槽位1
   * 断言：加载后所有状态与保存时一致
   */
  test('保存后加载状态完全一致', () => {
    // 保存当前状态
    const saveResult = SaveSystem.save(1);
    expect(saveResult).toBe(true);

    // 修改状态（模拟游戏继续）
    State.hero.x = 1;
    State.hero.y = 1;
    State.hero.hp = 1000;
    State.hero.atk = 50;
    State.hero.gold = 500;

    // 加载存档
    const loadResult = SaveSystem.load(1);
    expect(loadResult).toBe(true);

    // 验证状态恢复
    expect(State.hero.x).toBe(5);
    expect(State.hero.y).toBe(5);
    expect(State.hero.hp).toBe(500);
    expect(State.hero.atk).toBe(20);
    expect(State.hero.def).toBe(15);
    expect(State.hero.gold).toBe(100);
    expect(State.hero.keys.yellow).toBe(3);
    expect(State.hero.keys.blue).toBe(2);
    expect(State.hero.keys.red).toBe(1);
    expect(State.currentFloor).toBe(2);
  });

  /**
   * 测试场景：加载空存档
   * 设计意图：验证加载不存在存档时的处理
   */
  test('加载空存档失败', () => {
    const result = SaveSystem.load(99);
    expect(result).toBe(false);
  });

  /**
   * 测试场景：多存档槽位
   * 设计意图：验证可以保存到不同槽位并独立加载
   */
  test('多存档槽位独立保存', () => {
    // 保存到槽位1
    State.hero.hp = 100;
    SaveSystem.save(1);

    // 修改状态，保存到槽位2
    State.hero.hp = 200;
    SaveSystem.save(2);

    // 加载槽位1
    SaveSystem.load(1);
    expect(State.hero.hp).toBe(100);

    // 加载槽位2
    SaveSystem.load(2);
    expect(State.hero.hp).toBe(200);
  });

  /**
   * 测试场景：删除存档
   */
  test('删除存档后无法加载', () => {
    SaveSystem.save(1);
    expect(SaveSystem.hasSave(1)).toBe(true);

    SaveSystem.delete(1);
    expect(SaveSystem.hasSave(1)).toBe(false);

    const result = SaveSystem.load(1);
    expect(result).toBe(false);
  });

  /**
   * 测试场景：存档信息获取
   */
  test('获取存档信息正确', () => {
    State.currentFloor = 5;
    State.hero.hp = 800;
    State.hero.gold = 250;

    SaveSystem.save(1);

    const info = SaveSystem.getSaveInfo(1);
    expect(info.floor).toBe(5);
    expect(info.hp).toBe(800);
    expect(info.gold).toBe(250);
    expect(info.timestamp).toBeDefined();
  });
});