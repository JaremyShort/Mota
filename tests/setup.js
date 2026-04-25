// Vitest 测试环境设置

// 模拟 Canvas
class MockCanvas {
  constructor() {
    this.width = 560;
    this.height = 560;
    this._context = new MockContext();
  }
  getContext(type) {
    return this._context;
  }
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 560, height: 560 };
  }
}

class MockContext {
  constructor() {
    this.fillStyle = '#000';
    this.strokeStyle = '#000';
    this.lineWidth = 1;
  }
  fillRect() {}
  strokeRect() {}
  beginPath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  closePath() {}
  fill() {}
  stroke() {}
  clearRect() {}
  save() {}
  restore() {}
}

// 设置全局 DOM 对象
global.document = {
  getElementById: (id) => {
    if (id === 'gameCanvas') {
      return new MockCanvas();
    }
    return {
      querySelector: () => ({ textContent: '', classList: { add: () => {}, remove: () => {}, toggle: () => {} } }),
      appendChild: () => {}
    };
  },
  createElement: () => ({
    id: '',
    className: '',
    innerHTML: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    appendChild: () => {},
    addEventListener: () => {},
    querySelectorAll: () => [],
    dataset: {}
  }),
  querySelector: () => ({
    textContent: '',
    innerHTML: '',
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    querySelector: () => ({ textContent: '', classList: { add: () => {}, remove: () => {} } })
  }),
  querySelectorAll: () => [],
  addEventListener: () => {},
  readyState: 'complete'
};

global.window = global;
global.alert = (msg) => { console.log('ALERT:', msg); };

// 模拟 localStorage
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

// 动态加载 CommonJS 模块（通过 fs 读取并执行）
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadModule(relativePath) {
  const fullPath = resolve(__dirname, relativePath);
  const code = readFileSync(fullPath, 'utf-8');
  // 执行代码，模块会自动挂载到 window（即 global）
  new Function('window', 'document', 'localStorage', 'alert', code)(global, global.document, global.localStorage, global.alert);
}

// 按依赖顺序加载模块
loadModule('../js/config.js');
loadModule('../js/state.js');
loadModule('../js/map.js');
loadModule('../js/renderer.js');
loadModule('../js/battle.js');
loadModule('../js/item.js');
loadModule('../js/shop.js');
loadModule('../js/save.js');
loadModule('../js/ui.js');
loadModule('../js/tooltip.js');
loadModule('../js/input.js');