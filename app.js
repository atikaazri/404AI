// Algorithmic Art Lab - Complete with Color Themes
"use strict";

// ==========================================
// COLOR THEME SYSTEM
// ==========================================
const COLOR_THEMES = {
  algArt: {
    name: 'ALG.ART',
    primary: '#00FF88',
    secondary: '#C6FF00',
    tertiary: '#0B3D2E',
    background: '#0A0F0D',
    hue: 150
  },
  neon: {
    name: 'Neon Night',
    primary: '#FF00FF',
    secondary: '#00FFFF',
    tertiary: '#8800FF',
    background: '#0a0012',
    hue: 300
  },
  sunset: {
    name: 'Sunset',
    primary: '#FF6B35',
    secondary: '#F7931E',
    tertiary: '#C1121F',
    background: '#1a0500',
    hue: 15
  },
  ocean: {
    name: 'Ocean',
    primary: '#00B4D8',
    secondary: '#0077B6',
    tertiary: '#03045E',
    background: '#000814',
    hue: 195
  },
  forest: {
    name: 'Forest',
    primary: '#88CC44',
    secondary: '#3D7A28',
    tertiary: '#1A3D0E',
    background: '#0a1205',
    hue: 90
  },
  fire: {
    name: 'Fire',
    primary: '#FF7700',
    secondary: '#DD2200',
    tertiary: '#7A0000',
    background: '#1a0000',
    hue: 25
  },
  custom: {
    name: 'Custom',
    primary: '#00FF88',
    secondary: '#C6FF00',
    tertiary: '#0B3D2E',
    background: '#0A0F0D',
    hue: 150
  }
};

let currentTheme = 'algArt';

const ALGORITHMS = [
  {id: 'home', icon: '⊗', label: '404 Home', section: 'Origin'},
  {id: 'trianglify', icon: '△', label: 'Trianglify', desc: 'Delaunay triangulation', badge: '★', section: 'Featured'},
  {id: 'flow', icon: '≋', label: 'Perlin Flow', desc: 'Smooth particles', badge: '★', section: 'Featured'},
  {id: 'lsystem', icon: '⌥', label: 'L-System Trees', desc: 'Recursive growth', badge: '★', section: 'Featured'},
  {id: 'donttouch', icon: '⚛', label: 'Don\'t Touch Me', desc: 'Repelling particles', section: 'Interactive'},
  {id: 'cloth', icon: '🕸', label: 'Ripped Cloth', desc: 'Physics simulation', section: 'Interactive'},
  {id: 'morphblobs', icon: '●', label: 'Morphing Blobs', desc: 'Metaball connections', section: 'Generative'},
  {id: 'earth', icon: '🌍', label: 'Transparent Earth', desc: '3D rotating sphere', section: 'Generative'},
  {id: 'voronoi', icon: '◈', label: 'Voronoi Flowers', desc: 'Organic growth', section: 'Generative'},
  {id: 'mulholland', icon: '⬢', label: 'Wavy Mountains', desc: 'Layered terrain', section: 'Generative'}
];

let currentAlgorithm = null;
let currentSketch = null;

// Build UI
window.addEventListener('DOMContentLoaded', () => {
  buildUI();
  handleLogo();
  switchTab('home');
});

function buildUI() {
  const nav = document.getElementById('sidenav');
  const main = document.getElementById('main');
  
  let lastSection = '';
  
  ALGORITHMS.forEach(alg => {
    if (alg.section && alg.section !== lastSection) {
      nav.innerHTML += `<div class="nav-section-label">${alg.section}</div>`;
      lastSection = alg.section;
    }
    
    const active = alg.id === 'home' ? ' active' : '';
    nav.innerHTML += `
      <div class="nav-item${active}" data-tab="${alg.id}">
        <div class="nav-icon">${alg.icon}</div>
        <span class="nav-label">${alg.label}</span>
        ${alg.badge ? `<span class="nav-badge">${alg.badge}</span>` : ''}
      </div>
    `;
    
    if (alg.id === 'home') {
      main.innerHTML += `
        <div class="tab-panel active" id="tab-home">
          <div class="page-404">
            <div class="four04-bg" id="home-canvas"></div>
            <div class="four04-content">
              <img id="home-logo" class="four04-logo" src="colLogo.svg" alt="Logo" style="max-width:400px;width:80vw;">
              <div class="four04-sub">Page Not Found — But Art Is</div>
              <div class="four04-cta" style="display:flex;gap:12px;justify-content:center">
                <button class="btn primary" onclick="switchTab('trianglify')">Explore Art →</button>
              </div>
              <p style="margin-top:24px;font-size:10px;color:var(--text-dim);animation:fadeIn 1s .5s both">
                10 algorithms · real-time controls · export PNG
              </p>
            </div>
          </div>
        </div>
      `;
    } else {
      main.innerHTML += `
        <div class="tab-panel" id="tab-${alg.id}">
          <div class="tab-header">
            <div class="tab-title">${alg.label}</div>
            <div class="tab-desc">${alg.desc || ''}</div>
            <div class="tab-actions">
              <button class="btn" onclick="regenerate()">Regenerate</button>
              <button class="btn primary" onclick="exportImage()">Export PNG</button>
            </div>
          </div>
          <div class="workspace">
            <div class="canvas-container" id="${alg.id}-canvas"></div>
            <div class="controls" id="${alg.id}-controls"></div>
          </div>
        </div>
      `;
    }
  });
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });
}

function handleLogo() {
  const topLogo = document.getElementById('topbar-logo');
  const homeLogo = document.getElementById('home-logo');
  
  if (topLogo) {
    topLogo.onerror = () => {
      topLogo.style.display = 'none';
      const textLogo = document.createElement('div');
      textLogo.style.cssText = 'font-family:Unbounded,sans-serif;font-weight:900;font-size:22px;color:#00FF88;';
      textLogo.innerHTML = 'ALG<span style="color:#C6FF00">.</span>ART';
      topLogo.parentElement.insertBefore(textLogo, topLogo);
    };
  }
  
  if (homeLogo) {
    homeLogo.onerror = () => homeLogo.style.display = 'none';
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  const navItem = document.querySelector(`[data-tab="${tabId}"]`);
  if (navItem) navItem.classList.add('active');
  
  const panel = document.getElementById(`tab-${tabId}`);
  if (panel) panel.classList.add('active');
  
  if (currentSketch) {
    currentSketch.remove();
    currentSketch = null;
  }
  
  currentAlgorithm = tabId;
  setTimeout(() => initAlgorithm(tabId), 50);
}

function initAlgorithm(id) {
  const container = document.getElementById(`${id}-canvas`);
  if (!container) return;
  
  const sketchFunctions = {
    home: homeSketch,
    trianglify: trianglifySketch,
    flow: flowSketch,
    lsystem: lsystemSketch,
    donttouch: dontTouchMeSketch,
    cloth: rippedClothSketch,
    morphblobs: morphingBlobsSketch,
    earth: transparentEarthSketch,
    voronoi: voronoiFlowersSketch,
    mulholland: mulhollandSketch
  };
  
  const sketchFn = sketchFunctions[id];
  if (sketchFn) {
    currentSketch = new p5(sketchFn, container);
  }
}

function getTheme() {
  return COLOR_THEMES[currentTheme];
}

function buildThemeControls(controlsId) {
  const controls = document.getElementById(controlsId);
  if (!controls) return;
  
  // Check if already built for this specific controls panel
  const existingTheme = controls.querySelector('.theme-section');
  if (existingTheme) return;
  
  const uniqueId = controlsId.replace('-controls', '');
  
  const themeHTML = `
    <div class="ctrl-section theme-section">
      <div class="ctrl-label">Color Theme</div>
      <select class="ctrl-select theme-select" data-for="${uniqueId}">
        <option value="algArt">ALG.ART</option>
        <option value="neon">Neon Night</option>
        <option value="sunset">Sunset</option>
        <option value="ocean">Ocean</option>
        <option value="forest">Forest</option>
        <option value="fire">Fire</option>
        <option value="custom">Custom</option>
      </select>
      <div class="custom-colors-panel" style="display:none;margin-top:10px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div>
            <label style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:4px;">Primary</label>
            <input type="color" class="custom-primary-picker" value="#00FF88" style="width:100%;height:32px;">
          </div>
          <div>
            <label style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:4px;">Secondary</label>
            <input type="color" class="custom-secondary-picker" value="#C6FF00" style="width:100%;height:32px;">
          </div>
          <div style="grid-column: 1 / -1;">
            <label style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:4px;">Background</label>
            <input type="color" class="custom-background-picker" value="#0A0F0D" style="width:100%;height:32px;">
          </div>
        </div>
      </div>
    </div>
  `;
  
  controls.insertAdjacentHTML('afterbegin', themeHTML);
  
  const themeSelect = controls.querySelector('.theme-select');
  const customColorsPanel = controls.querySelector('.custom-colors-panel');
  const customPrimary = controls.querySelector('.custom-primary-picker');
  const customSecondary = controls.querySelector('.custom-secondary-picker');
  const customBackground = controls.querySelector('.custom-background-picker');
  
  // Set current theme in dropdown
  themeSelect.value = currentTheme;
  customColorsPanel.style.display = currentTheme === 'custom' ? 'block' : 'none';
  
  themeSelect.onchange = (e) => {
    currentTheme = e.target.value;
    customColorsPanel.style.display = currentTheme === 'custom' ? 'block' : 'none';
    regenerate();
  };
  
  customPrimary.oninput = (e) => {
    COLOR_THEMES.custom.primary = e.target.value;
    // Calculate hue from hex for custom theme
    const rgb = hexToRgb(e.target.value);
    COLOR_THEMES.custom.hue = rgbToHue(rgb[0], rgb[1], rgb[2]);
    if (currentTheme === 'custom') {
      // Force redraw
      if (currentSketch && currentSketch.loop) {
        currentSketch.loop();
      }
    }
  };
  
  customSecondary.oninput = (e) => {
    COLOR_THEMES.custom.secondary = e.target.value;
    if (currentTheme === 'custom') {
      // Force redraw
      if (currentSketch && currentSketch.loop) {
        currentSketch.loop();
      }
    }
  };
  
  customBackground.oninput = (e) => {
    COLOR_THEMES.custom.background = e.target.value;
    if (currentTheme === 'custom') {
      // Force redraw
      if (currentSketch && currentSketch.loop) {
        currentSketch.loop();
      }
    }
  };
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 255, 136];
}

function rgbToHue(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  if (delta === 0) return 0;
  
  let hue;
  if (max === r) {
    hue = ((g - b) / delta) % 6;
  } else if (max === g) {
    hue = (b - r) / delta + 2;
  } else {
    hue = (r - g) / delta + 4;
  }
  
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;
  
  return hue;
}

function regenerate() {
  if (currentAlgorithm) {
    switchTab(currentAlgorithm);
  }
}

function exportImage() {
  if (currentSketch && currentSketch.saveCanvas) {
    currentSketch.saveCanvas(`algArt-${currentAlgorithm}-${Date.now()}`, 'png');
    showToast();
  }
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Global keypress handler for double space = export
let lastSpaceTime = 0;
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    const now = Date.now();
    if (now - lastSpaceTime < 500) { // 500ms window for double tap
      e.preventDefault();
      exportImage();
    }
    lastSpaceTime = now;
  }
});

// ==========================================
// HOME SKETCH (404 Background with Blinking Title)
// ==========================================
function homeSketch(p) {
  let t = 0;
  
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
  };
  
  p.draw = function() {
    p.background(10, 15, 13);
    
    for (let y = 0; y < p.height; y += 20) {
      for (let x = 0; x < p.width; x += 20) {
        let n = p.noise(x * 0.01, y * 0.01, t);
        if (n > 0.5) {
          p.fill(11, 61, 46, 100);
          p.circle(x, y, 10);
        }
      }
    }
    
    t += 0.005;
  };
  
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}

// Add CSS for squashing 404
const style404 = document.createElement('style');
style404.textContent = `
  @keyframes squash404 {
    0%, 100% { 
      transform: scaleY(1);
      transform-origin: center;
    }
    50% { 
      transform: scaleY(0.1);
      transform-origin: center;
    }
  }
  .four04-title {
    animation: squash404 2s ease-in-out infinite !important;
  }
`;
document.head.appendChild(style404);

// ==========================================
// TRIANGLIFY - Squares with Theme Support
// ==========================================
function trianglifySketch(p) {
  let params = { cellSize: 80, variance: 0.75 };
  
  p.setup = function() {
    const container = document.getElementById('trianglify-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    p.colorMode(p.HSB);
    buildTrianglifyControls();
  };
  
  p.draw = function() {
    const theme = getTheme();
    const bg = hexToRgb(theme.background);
    p.background(bg[0], bg[1], bg[2]);
    
    const cols = Math.ceil(p.width / params.cellSize) + 2;
    const rows = Math.ceil(p.height / params.cellSize) + 2;
    
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        let x = c * params.cellSize + p.random(-params.variance * params.cellSize, params.variance * params.cellSize);
        let y = r * params.cellSize + p.random(-params.variance * params.cellSize, params.variance * params.cellSize);
        
        let t = (x / p.width + y / p.height) / 2;
        let hue = (theme.hue + t * 120) % 360;
        p.fill(hue, 80, 90);
        p.noStroke();
        
        let size = params.cellSize * (0.5 + p.random() * 0.5);
        p.rect(x - size/2, y - size/2, size, size);
      }
    }
    
    p.noLoop();
  };
  
  function buildTrianglifyControls() {
    const controls = document.getElementById('trianglify-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Geometry</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Cell Size <span id="tri-cell-val">80</span></div>
          <input type="range" id="tri-cell" min="20" max="200" value="80">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Variance <span id="tri-var-val">0.75</span></div>
          <input type="range" id="tri-var" min="0" max="100" value="75">
        </div>
      </div>
    `;
    
    buildThemeControls('trianglify-controls');
    
    document.getElementById('tri-cell').oninput = (e) => {
      params.cellSize = parseInt(e.target.value);
      document.getElementById('tri-cell-val').textContent = e.target.value;
      p.redraw();
    };
    
    document.getElementById('tri-var').oninput = (e) => {
      params.variance = parseInt(e.target.value) / 100;
      document.getElementById('tri-var-val').textContent = params.variance.toFixed(2);
      p.redraw();
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('trianglify-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      p.redraw();
    }
  };
}

// ==========================================
// PERLIN FLOW - Fixed Colors, Size, and Fading Trail
// ==========================================
function flowSketch(p) {
  let particles = [];
  let params = { count: 2000, speed: 2, scale: 0.003, trail: 0.05, particleSize: 1 };
  
  p.setup = function() {
    const container = document.getElementById('flow-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    p.colorMode(p.HSB);
    
    for (let i = 0; i < params.count; i++) {
      particles.push(new FlowParticle(p));
    }
    
    buildFlowControls();
  };
  
  p.draw = function() {
    const theme = getTheme();
    // Fill with background color for fading effect
    const bg = hexToRgb(theme.background);
    p.fill(bg[0], bg[1], bg[2]);
    p.noStroke();
    p.rect(0, 0, p.width, p.height, 0);
    
    particles.forEach(particle => {
      particle.update();
      particle.display();
    });
  };
  
  class FlowParticle {
    constructor(p) {
      this.p = p;
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p.createVector(0, 0);
      this.prevPos = this.pos.copy();
      this.hue = p.random(360);
    }
    
    update() {
      let angle = this.p.noise(this.pos.x * params.scale, this.pos.y * params.scale, this.p.frameCount * 0.001) * this.p.TWO_PI * 4;
      
      let force = p5.Vector.fromAngle(angle);
      force.mult(params.speed * 0.1);
      
      this.vel.add(force);
      this.vel.mult(0.96);
      
      this.prevPos = this.pos.copy();
      this.pos.add(this.vel);
      
      if (this.pos.x < 0 || this.pos.x > this.p.width || this.pos.y < 0 || this.pos.y > this.p.height) {
        this.pos.x = this.p.random(this.p.width);
        this.pos.y = this.p.random(this.p.height);
        this.prevPos = this.pos.copy();
        this.vel.mult(0);
      }
    }
    
    display() {
      const theme = getTheme();
      // Use theme hue with particle's individual variation
      let hue = (theme.hue + this.hue * 0.3) % 360;
      this.p.stroke(hue, 80, 90, params.trail);
      this.p.strokeWeight(params.particleSize);
      this.p.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
    }
  }
  
  function buildFlowControls() {
    const controls = document.getElementById('flow-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Particles</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Count <span id="flow-count-val">2000</span></div>
          <input type="range" id="flow-count" min="100" max="5000" value="2000">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Speed <span id="flow-speed-val">2.0</span></div>
          <input type="range" id="flow-speed" min="1" max="50" value="20">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Size <span id="flow-size-val">1</span></div>
          <input type="range" id="flow-size" min="1" max="5" value="1">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Trail Fade <span id="flow-trail-val">0.05</span></div>
          <input type="range" id="flow-trail" min="1" max="100" value="5">
        </div>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Field</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Scale <span id="flow-scale-val">0.003</span></div>
          <input type="range" id="flow-scale" min="1" max="30" value="3">
        </div>
      </div>
    `;
    
    buildThemeControls('flow-controls');
    
    document.getElementById('flow-count').oninput = (e) => {
      params.count = parseInt(e.target.value);
      document.getElementById('flow-count-val').textContent = e.target.value;
      particles = [];
      for (let i = 0; i < params.count; i++) {
        particles.push(new FlowParticle(p));
      }
    };
    
    document.getElementById('flow-speed').oninput = (e) => {
      params.speed = parseInt(e.target.value) / 10;
      document.getElementById('flow-speed-val').textContent = params.speed.toFixed(1);
    };
    
    document.getElementById('flow-size').oninput = (e) => {
      params.particleSize = parseInt(e.target.value);
      document.getElementById('flow-size-val').textContent = e.target.value;
    };
    
    document.getElementById('flow-trail').oninput = (e) => {
      params.trail = parseInt(e.target.value) / 100;
      document.getElementById('flow-trail-val').textContent = params.trail.toFixed(2);
    };
    
    document.getElementById('flow-scale').oninput = (e) => {
      params.scale = parseInt(e.target.value) / 1000;
      document.getElementById('flow-scale-val').textContent = params.scale.toFixed(3);
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('flow-canvas');
    if (container) p.resizeCanvas(container.clientWidth, container.clientHeight);
  };
}

// ==========================================
// L-SYSTEM TREES - Fixed Color Theme Support
// ==========================================
function lsystemSketch(p) {
  let params = {
    axiom: 'F',
    rules: { F: 'FF+[+F-F-F]-[-F+F+F]' },
    angle: 25,
    iterations: 5,
    length: 6
  };
  
  const PRESETS = {
    tree: { axiom: 'F', rules: { F: 'FF+[+F-F-F]-[-F+F+F]' }, angle: 25, iterations: 5 },
    bush: { axiom: 'F', rules: { F: 'F[+F]F[-F][F]' }, angle: 20, iterations: 6 },
    fern: { axiom: 'X', rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' }, angle: 25, iterations: 6 }
  };
  
  p.setup = function() {
    const container = document.getElementById('lsystem-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    p.colorMode(p.HSB);
    buildLSystemControls();
  };
  
  p.draw = function() {
    const theme = getTheme();
    const bg = hexToRgb(theme.background);
    p.background(bg[0], bg[1], bg[2]);
    
    let sentence = generateLSystem();
    drawLSystem(sentence);
    
    p.noLoop();
  };
  
  function generateLSystem() {
    let current = params.axiom;
    
    for (let i = 0; i < params.iterations; i++) {
      let next = '';
      for (let char of current) {
        next += params.rules[char] || char;
      }
      current = next;
      if (current.length > 100000) break;
    }
    
    return current;
  }
  
  function drawLSystem(sentence) {
    p.push();
    p.translate(p.width / 2, p.height * 0.9);
    
    const theme = getTheme();
    let angleRad = p.radians(params.angle);
    let stack = [];
    let depth = 0;
    
    for (let char of sentence) {
      if (char === 'F' || char === 'X') {
        // Use theme hue with depth variation
        let hue = (theme.hue + depth * 10) % 360;
        p.stroke(hue, 80, 90);
        p.strokeWeight(Math.max(1, 3 - depth * 0.3));
        p.line(0, 0, 0, -params.length);
        p.translate(0, -params.length);
      } else if (char === '+') {
        p.rotate(angleRad);
      } else if (char === '-') {
        p.rotate(-angleRad);
      } else if (char === '[') {
        stack.push(depth);
        depth++;
        p.push();
      } else if (char === ']') {
        p.pop();
        if (stack.length) depth = stack.pop();
      }
    }
    
    p.pop();
  }
  
  function buildLSystemControls() {
    const controls = document.getElementById('lsystem-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Preset</div>
        <select class="ctrl-select" id="lsys-preset">
          <option value="tree">Tree</option>
          <option value="bush">Bush</option>
          <option value="fern">Fern</option>
        </select>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Parameters</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Iterations <span id="lsys-iter-val">5</span></div>
          <input type="range" id="lsys-iter" min="1" max="8" value="5">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Angle <span id="lsys-angle-val">25°</span></div>
          <input type="range" id="lsys-angle" min="5" max="90" value="25">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Length <span id="lsys-len-val">6</span></div>
          <input type="range" id="lsys-len" min="2" max="20" value="6">
        </div>
      </div>
    `;
    
    buildThemeControls('lsystem-controls');
    
    document.getElementById('lsys-preset').onchange = (e) => {
      const preset = PRESETS[e.target.value];
      params.axiom = preset.axiom;
      params.rules = preset.rules;
      params.angle = preset.angle;
      params.iterations = preset.iterations;
      document.getElementById('lsys-angle').value = preset.angle;
      document.getElementById('lsys-angle-val').textContent = preset.angle + '°';
      document.getElementById('lsys-iter').value = preset.iterations;
      document.getElementById('lsys-iter-val').textContent = preset.iterations;
      p.redraw();
    };
    
    document.getElementById('lsys-iter').oninput = (e) => {
      params.iterations = parseInt(e.target.value);
      document.getElementById('lsys-iter-val').textContent = e.target.value;
      p.redraw();
    };
    
    document.getElementById('lsys-angle').oninput = (e) => {
      params.angle = parseInt(e.target.value);
      document.getElementById('lsys-angle-val').textContent = e.target.value + '°';
      p.redraw();
    };
    
    document.getElementById('lsys-len').oninput = (e) => {
      params.length = parseInt(e.target.value);
      document.getElementById('lsys-len-val').textContent = e.target.value;
      p.redraw();
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('lsystem-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      p.redraw();
    }
  };
}

// ==========================================
// DON'T TOUCH ME - Your Algorithm
// ==========================================
function dontTouchMeSketch(p) {
  let repel_radius;
  let radius_;
  let angle = 0;
  let points = [];
  const particles = 8000;
  const attraction = 0.01;
  const damping = 0.9;
  const repel_strength = 28;
  
  p.setup = function() {
    const container = document.getElementById('donttouch-canvas');
    const isMobile = container.clientWidth < 500;
    
    p.createCanvas(container.clientWidth, container.clientHeight);
    
    // Scale radius to fit canvas with padding
    const minDim = Math.min(container.clientWidth, container.clientHeight);
    radius_ = minDim * 0.35; // 35% of smallest dimension for good padding
    repel_radius = radius_ * 0.35; // Proportional repel radius
    
    p.pixelDensity(1);
    p.strokeWeight(2);
    
    for (let i = 0; i < particles; i++) {
      points.push({
        index: i,
        pos: p.createVector(0, 0),
        vel: p.createVector(0, 0)
      });
    }
    
    angle = 0;
    updateTargets();
    for (let pt of points) pt.vel.set(0, 0);
    
    buildDontTouchControls();
  };
  
  p.draw = function() {
    const theme = getTheme();
    p.background(theme.background);
    p.stroke(theme.primary);
    p.translate(p.width / 2, p.height / 2);
    
    let mouse = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
    
    for (let pt of points) {
      let i = pt.index;
      
      let homeX = p.sin(i + angle) * p.sin(i * i) * radius_;
      let homeY = p.cos(i * i) * radius_;
      let home = p.createVector(homeX, homeY);
      
      let toHome = p5.Vector.sub(home, pt.pos);
      let spring = toHome.mult(attraction);
      pt.vel.add(spring);
      
      let awayFromMouse = p5.Vector.sub(pt.pos, mouse);
      let distSq = awayFromMouse.magSq();
      if (distSq > 0.1 && distSq < repel_radius * repel_radius) {
        let distance = p.sqrt(distSq);
        awayFromMouse.normalize();
        let repel = repel_strength * (1 - distance / repel_radius);
        awayFromMouse.mult(repel);
        pt.vel.add(awayFromMouse);
      }
      
      pt.vel.mult(damping);
      pt.pos.add(pt.vel);
      
      p.point(pt.pos.x, pt.pos.y);
    }
    angle += 0.01;
  };
  
  function updateTargets() {
    for (let pt of points) {
      let i = pt.index;
      let x = p.sin(i + angle) * p.sin(i * i) * radius_;
      let y = p.cos(i * i) * radius_;
      pt.pos.set(x, y);
    }
  }
  
  function buildDontTouchControls() {
    const controls = document.getElementById('donttouch-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Interactive</div>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">
          Move your mouse over the particles to repel them. They spring back to their rotating positions.
        </p>
      </div>
    `;
    buildThemeControls('donttouch-controls');
  }
  
  p.windowResized = function() {
    const container = document.getElementById('donttouch-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      // Recalculate radius for new canvas size
      const minDim = Math.min(container.clientWidth, container.clientHeight);
      radius_ = minDim * 0.35;
      repel_radius = radius_ * 0.35;
      updateTargets();
    }
  };
}

// ==========================================
// RIPPED CLOTH - Fixed Dark Background and Colors
// ==========================================
function rippedClothSketch(p) {
  let nodeArray = [];
  let linkArray = [];
  const cutHistory = [];
  
  const gridCount = 40;
  const friction = 0.99;
  const forceMultiplier = 0.25;
  const knifeRange = 10;
  const speedLimit = 8;
  
  class Node {
    constructor(x, y, pinned) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);
      this.force = p.createVector(0, 0);
      this.pinned = pinned;
    }
    
    show() {
      const theme = getTheme();
      p.fill(theme.primary);
      p.rect(this.pos.x, this.pos.y, 4);
    }
    
    update() {
      if (this.pinned) return;
      const acc = this.force.mult(forceMultiplier);
      
      this.vel.add(acc);
      this.vel.limit(speedLimit);
      this.pos.add(this.vel);
      
      this.force.mult(0);
      this.vel.mult(friction);
    }
  }
  
  class Link {
    constructor(node1, node2) {
      this.node1 = node1;
      this.node2 = node2;
    }
    
    show() {
      const theme = getTheme();
      p.stroke(theme.primary);
      p.line(this.node1.pos.x, this.node1.pos.y, this.node2.pos.x, this.node2.pos.y);
    }
    
    update() {
      const difference = this.node2.pos.copy().sub(this.node1.pos);
      if (!this.node1.pinned) this.node1.force.add(difference);
      if (!this.node2.pinned) this.node2.force.sub(difference);
    }
  }
  
  p.setup = function() {
    const container = document.getElementById('cloth-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    nodeArray = createNodes();
    linkArray = createLinks(nodeArray);
    
    buildClothControls();
  };
  
  function createNodes() {
    const nodes = [];
    for (let j = 0; j <= gridCount; j++) {
      for (let i = 0; i <= gridCount; i++) {
        const pinned = i === 0 || j === 0 || i === gridCount || j === gridCount;
        const x = p.map(i, 0, gridCount, 0, p.width - 1);
        const y = p.map(j, 0, gridCount, 0, p.height - 1);
        nodes.push(new Node(x, y, pinned));
      }
    }
    return nodes;
  }
  
  function createLinks(nodes) {
    const links = [];
    nodes.forEach((current, index) => {
      const rest = nodes.slice(index + 1);
      const neighbors = rest.filter(target => 
        current.pos.dist(target.pos) <= p.width / gridCount
      );
      neighbors.forEach(target => {
        if (!(current.pinned && target.pinned)) {
          links.push(new Link(current, target));
        }
      });
    });
    return links;
  }
  
  p.draw = function() {
    const theme = getTheme();
    p.background(theme.background);
    p.stroke(theme.primary);
    p.fill(theme.background);
    p.rectMode(p.CENTER);
    
    linkArray.forEach(link => link.update());
    nodeArray.forEach(node => node.update());
    
    linkArray.forEach(link => link.show());
    nodeArray.forEach(node => node.show());
  };
  
  p.mouseDragged = function() {
    const mouse = p.createVector(p.mouseX, p.mouseY);
    
    linkArray = linkArray.filter(link => {
      const middle = link.node1.pos.copy().add(link.node2.pos).div(2);
      const difference = middle.copy().sub(mouse);
      const distance = Math.hypot(difference.x, difference.y);
      
      if (distance > knifeRange) return true;
      cutHistory.push(link);
      return false;
    });
  };
  
  function buildClothControls() {
    const controls = document.getElementById('cloth-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Interactive</div>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">
          Drag your mouse across the cloth to cut it. Press SPACE or 'U' to undo cuts.
        </p>
      </div>
    `;
    buildThemeControls('cloth-controls');
  }
  
  p.keyPressed = function() {
    if (p.key === ' ' || p.key === 'u' || p.key === 'U') {
      if (cutHistory.length) {
        linkArray.push(cutHistory.pop());
      }
    }
  };
  
  p.windowResized = function() {
    const container = document.getElementById('cloth-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      nodeArray = createNodes();
      linkArray = createLinks(nodeArray);
    }
  };
}

// ==========================================
// MORPHING BLOBS - Metaball Connections
// ==========================================
function morphingBlobsSketch(p) {
  let circles = [];
  let connections = [];
  let params = {
    gridSize: 4,
    handleRate: 3,
    maxDistance: 100,
    blobRadius: 60
  };
  
  p.setup = function() {
    const container = document.getElementById('morphblobs-canvas');
    const l = Math.min(container.clientWidth, container.clientHeight);
    p.createCanvas(l, l);
    p.fill(0);
    p.noStroke();
    
    initBlobs();
    buildMorphBlobsControls();
  };
  
  function initBlobs() {
    circles = [];
    const spacing = p.width / params.gridSize;
    const r = params.blobRadius;
    
    // Use theme colors instead of fixed palette
    const theme = getTheme();
    const colors = [theme.primary, theme.secondary, theme.tertiary || theme.primary];
    
    for (let x = 0; x < params.gridSize; x++) {
      for (let y = 0; y < params.gridSize; y++) {
        let posX = x * spacing + spacing / 2;
        let posY = y * spacing + spacing / 2;
        circles.push({
          position: p.createVector(posX, posY),
          radius: r,
          color: p.random(colors)
        });
      }
    }
    
    // Add mouse-following blob
    circles.push({
      position: p.createVector(p.mouseX, p.mouseY),
      radius: r,
      color: p.random(colors)
    });
  }
  
  p.draw = function() {
    const theme = getTheme();
    p.background(theme.background);
    
    // Update mouse blob
    circles[circles.length - 1].position.x = p.mouseX;
    circles[circles.length - 1].position.y = p.mouseY;
    
    // Draw circles
    circles.forEach((c, index) => {
      p.drawingContext.fillStyle = c.color;
      p.circle(c.position.x, c.position.y, c.radius);
    });
    
    // Calculate metaball connections
    connections.length = 0;
    for (let i = 0; i < circles.length; i++) {
      for (let j = i - 1; j >= 0; j--) {
        let path = metaball(circles[i], circles[j], 0.5, params.handleRate, params.maxDistance);
        if (path) {
          connections.push(path);
        }
      }
    }
    
    // Draw connections
    connections.forEach(path => {
      let gradient = p.drawingContext.createLinearGradient(
        path.segments[0].x, path.segments[0].y, 
        path.segments[1].x, path.segments[1].y
      );
      gradient.addColorStop(0, path.colors[0]);
      gradient.addColorStop(1, path.colors[1]);
      p.drawingContext.fillStyle = gradient;
      
      p.beginShape();
      for (let j = 0; j < 4; j++) {
        if (j === 0) {
          p.vertex(path.segments[j].x, path.segments[j].y);
        } else if (j % 2 !== 0) {
          p.vertex(path.segments[(j + 1) % 4].x, path.segments[(j + 1) % 4].y);
        }
        if (j % 2 !== 0) continue;
        
        p.bezierVertex(
          path.segments[j].x + path.handles[j].x, 
          path.segments[j].y + path.handles[j].y,
          path.segments[(j + 1) % 4].x + path.handles[(j + 1) % 4].x, 
          path.segments[(j + 1) % 4].y + path.handles[(j + 1) % 4].y,
          path.segments[(j + 1) % 4].x, 
          path.segments[(j + 1) % 4].y
        );
      }
      p.endShape();
    });
  };
  
  function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
    let radius1 = ball1.radius / 2;
    let radius2 = ball2.radius / 2;
    let center1 = ball1.position;
    let center2 = ball2.position;
    let d = center1.dist(center2);
    let u1 = 0;
    let u2 = 0;
    
    if (d > maxDistance || d < radius1 + radius2 - 8) {
      return null;
    }
    
    let angle1 = p.atan2(center2.y - center1.y, center2.x - center1.x);
    let angle2 = p.acos((radius1 - radius2) / d);
    let angle1a = angle1 + u1 + (angle2 - u1) * v;
    let angle1b = angle1 - u1 - (angle2 - u1) * v;
    let angle2a = angle1 + p.PI - u2 - (p.PI - u2 - angle2) * v;
    let angle2b = angle1 - p.PI + u2 + (p.PI - u2 - angle2) * v;
    
    let p1a = p5.Vector.add(center1, p5.Vector.fromAngle(angle1a, radius1));
    let p1b = p5.Vector.add(center1, p5.Vector.fromAngle(angle1b, radius1));
    let p2a = p5.Vector.add(center2, p5.Vector.fromAngle(angle2a, radius2));
    let p2b = p5.Vector.add(center2, p5.Vector.fromAngle(angle2b, radius2));
    
    let d2 = p.min(v * handle_len_rate, p.dist(p1a.x, p1a.y, p2a.x, p2a.y) / (radius1 + radius2));
    d2 *= p.min(1, d * 2 / (radius1 + radius2));
    radius1 *= d2;
    radius2 *= d2;
    
    return {
      segments: [p1a, p2a, p2b, p1b],
      handles: [
        p5.Vector.fromAngle(angle1a - p.HALF_PI, radius1),
        p5.Vector.fromAngle(angle2a + p.HALF_PI, radius2),
        p5.Vector.fromAngle(angle2b - p.HALF_PI, radius2),
        p5.Vector.fromAngle(angle1b + p.HALF_PI, radius1)
      ],
      colors: [ball1.color, ball2.color]
    };
  }
  
  function buildMorphBlobsControls() {
    const controls = document.getElementById('morphblobs-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Morphing Blobs</div>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">
          Move your mouse to control the interactive blob. Watch metaball connections form.
        </p>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Parameters</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Grid Size <span id="blob-grid-val">4</span></div>
          <input type="range" id="blob-grid" min="2" max="8" value="4">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Blob Radius <span id="blob-radius-val">60</span></div>
          <input type="range" id="blob-radius" min="30" max="150" value="60">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Connection Distance <span id="blob-dist-val">100</span></div>
          <input type="range" id="blob-dist" min="50" max="300" value="100">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Handle Rate <span id="blob-handle-val">3</span></div>
          <input type="range" id="blob-handle" min="1" max="6" value="3">
        </div>
      </div>
    `;
    
    buildThemeControls('morphblobs-controls');
    
    document.getElementById('blob-grid').oninput = (e) => {
      params.gridSize = parseInt(e.target.value);
      document.getElementById('blob-grid-val').textContent = e.target.value;
      initBlobs();
    };
    
    document.getElementById('blob-radius').oninput = (e) => {
      params.blobRadius = parseInt(e.target.value);
      document.getElementById('blob-radius-val').textContent = e.target.value;
      circles.forEach(c => c.radius = params.blobRadius);
    };
    
    document.getElementById('blob-dist').oninput = (e) => {
      params.maxDistance = parseInt(e.target.value);
      document.getElementById('blob-dist-val').textContent = e.target.value;
    };
    
    document.getElementById('blob-handle').oninput = (e) => {
      params.handleRate = parseInt(e.target.value);
      document.getElementById('blob-handle-val').textContent = e.target.value;
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('morphblobs-canvas');
    if (container) {
      const l = Math.min(container.clientWidth, container.clientHeight);
      p.resizeCanvas(l, l);
      initBlobs();
    }
  };
}

// ==========================================
// VORONOI FLOWERS - More Parameters
// ==========================================
function voronoiFlowersSketch(p) {
  let centroids = [], centroidsIdx = 0;
  let params = {
    nFlowers: 18,
    nPetals: 12,
    margin: 50
  };
  let petalEnds = [];
  
  p.setup = function() {
    const container = document.getElementById('voronoi-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight);
    p.pixelDensity(2);
    const theme = getTheme();
    p.background(theme.background);
    p.noStroke();
    
    initFlowers();
    buildVoronoiControls();
  };
  
  function initFlowers() {
    centroids = [];
    petalEnds = [];
    centroidsIdx = 0;
    
    for (let i = 0; i < params.nFlowers; i++) {
      let x0 = p.random(params.margin, p.width - params.margin);
      let y0 = p.random(params.margin, p.height - params.margin);
      centroids.push({
        x0: x0,
        y0: y0,
        theta0: p.random(p.TAU),
        id: i,
        arcsLeft: p.shuffle([...Array(params.nPetals).keys()])
      });
    }
    
    for (let i = 0; i < 3; i++) voronoiRelaxation();
    
    const theme = getTheme();
    p.background(theme.background);
    p.loop();
  }
  
  p.draw = function() {
    if (centroidsIdx >= centroids.length) {
      p.noLoop();
      return;
    }
    
    const theme = getTheme();
    let c = centroids[centroidsIdx];
    let theta = (p.TAU * c.arcsLeft.pop()) / params.nPetals + c.theta0;
    let rMax = longestPossibleRadius(c, theta);
    
    p.fill(theme.primary);
    let x, y, d = 0, r = 0;
    
    while (r + d / 2 < rMax) {
      x = c.x0 + r * p.cos(theta);
      y = c.y0 + r * p.sin(theta);
      d = r * p.sin(p.TAU / params.nPetals);
      p.circle(x, y, d - 1.5);
      
      if (x < params.margin / 2 || x > p.width - params.margin / 2 || 
          y < params.margin / 2 || y > p.height - params.margin / 2) break;
      
      let intersects = false;
      for (let pt of petalEnds) {
        if (pt.id !== c.id && p.dist(x, y, pt.x, pt.y) < d / 2 + pt.d / 2 + 6) {
          intersects = true;
          break;
        }
      }
      if (intersects) break;
      
      r++;
    }
    
    petalEnds.push({ x: x, y: y, d: d, id: c.id });
    
    if (c.arcsLeft.length === 0) {
      let dSum = 0;
      for (let pt of petalEnds) {
        if (pt.id === c.id) dSum += pt.d;
      }
      p.fill(theme.secondary);
      p.circle(c.x0, c.y0, dSum / params.nPetals);
      centroidsIdx++;
    }
  };
  
  function voronoiRelaxation() {
    let n = 20, s = p.width / n;
    let voronoi = Array(params.nFlowers).fill().map(() => []);
    
    for (let i = 0; i < n; i++) {
      let x = (i + 1 / 2) * s;
      for (let j = 0; j < n; j++) {
        let y = (j + 1 / 2) * s;
        let cid = closestCentroidId(x, y);
        voronoi[cid].push([x, y]);
      }
    }
    
    for (let i = 0; i < params.nFlowers; i++) {
      let c = centroids[i];
      let cellPoints = voronoi[c.id];
      let xSum = 0, ySum = 0;
      for (let pt of cellPoints) {
        xSum += pt[0];
        ySum += pt[1];
      }
      let x1 = p.constrain(xSum / cellPoints.length, params.margin, p.width - params.margin);
      let y1 = p.constrain(ySum / cellPoints.length, params.margin, p.height - params.margin);
      c.x0 = x1;
      c.y0 = y1;
    }
  }
  
  function longestPossibleRadius(centroid, theta) {
    let x0 = centroid.x0, y0 = centroid.y0;
    let r = 0;
    let rStep = 2;
    
    while (true) {
      r += rStep;
      let x = x0 + r * p.cos(theta);
      let y = y0 + r * p.sin(theta);
      
      if (closestCentroidId(x, y) !== centroid.id) break;
      if (x < 0 || x > p.width || y < 0 || y > p.height) break;
    }
    
    return r - rStep;
  }
  
  function closestCentroidId(x, y) {
    let minDist = Infinity, idMin = -1;
    for (let c of centroids) {
      let d = p.sq(c.x0 - x) + p.sq(c.y0 - y);
      if (d < minDist) {
        minDist = d;
        idMin = c.id;
      }
    }
    return idMin;
  }
  
  function buildVoronoiControls() {
    const controls = document.getElementById('voronoi-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Voronoi Flowers</div>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">
          Watch organic flowers grow using Voronoi tessellation.
        </p>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Parameters</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Flowers <span id="vor-flowers-val">18</span></div>
          <input type="range" id="vor-flowers" min="5" max="40" value="18">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Petals <span id="vor-petals-val">12</span></div>
          <input type="range" id="vor-petals" min="6" max="24" value="12">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Margin <span id="vor-margin-val">50</span></div>
          <input type="range" id="vor-margin" min="20" max="150" value="50">
        </div>
      </div>
    `;
    
    buildThemeControls('voronoi-controls');
    
    document.getElementById('vor-flowers').oninput = (e) => {
      params.nFlowers = parseInt(e.target.value);
      document.getElementById('vor-flowers-val').textContent = e.target.value;
      initFlowers();
    };
    
    document.getElementById('vor-petals').oninput = (e) => {
      params.nPetals = parseInt(e.target.value);
      document.getElementById('vor-petals-val').textContent = e.target.value;
      initFlowers();
    };
    
    document.getElementById('vor-margin').oninput = (e) => {
      params.margin = parseInt(e.target.value);
      document.getElementById('vor-margin-val').textContent = e.target.value;
      initFlowers();
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('voronoi-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      initFlowers();
    }
  };
}

// ==========================================
// WAVY MOUNTAINS - Fixed Transparency and Color Picker
// ==========================================
function mulhollandSketch(p) {
  let S;
  let PAD;
  let params = {
    transparency: 200,
    layers: 12,
    useCustomColors: false,
    customColor1: '#0077B6',
    customColor2: '#00B4D8'
  };
  
  p.setup = function() {
    const container = document.getElementById('mulholland-canvas');
    S = Math.min(container.clientWidth, container.clientHeight) * 0.95;
    p.createCanvas(S, S);
    p.frameRate(30);
    p.noiseSeed(Math.floor(p.random(7654321)));
    
    buildMulhollandControls();
  };
  
  p.draw = function() {
    const theme = getTheme();
    
    // Use custom colors if enabled, otherwise use theme
    const color1 = params.useCustomColors ? params.customColor1 : theme.primary;
    const color2 = params.useCustomColors ? params.customColor2 : theme.secondary;
    
    const bgColor = hexToRgb(theme.background);
    const fgColor = hexToRgb(color1);
    const secColor = hexToRgb(color2);
    
    p.stroke(fgColor[0], fgColor[1], fgColor[2], 64);
    p.strokeWeight(1);
    p.background(bgColor[0], bgColor[1], bgColor[2]);
    
    PAD = S * 0.2;
    
    for (let y = PAD; y < p.height + PAD; y += PAD / params.layers) {
      const f = p.map(y, PAD, p.height + PAD, 0, 1);
      
      const clr = p.lerpColor(
        p.color(fgColor[0], fgColor[1], fgColor[2], params.transparency),
        p.color(secColor[0], secColor[1], secColor[2], params.transparency),
        f / 2
      );
      p.fill(clr);
      
      p.beginShape();
      p.vertex(0, p.height + y);
      const ny = p.noise(5 * y / p.height);
      const cx = ny * p.width;
      
      for (let x = 0; x < p.width; x += p.width * 0.01) {
        const a = p.map(x, 0, p.width, p.HALF_PI, p.TWO_PI + p.HALF_PI) + (ny - 0.5) * 4;
        const n = p.noise(x / p.width * 10, y / p.height * 10, p.frameCount / 1500);
        const yy = p.sin(a) * S / 4 * n + y;
        p.vertex(x, yy);
      }
      
      p.vertex(p.width, p.height + y);
      p.endShape();
    }
    
    p.strokeWeight(8);
    p.stroke(fgColor[0], fgColor[1], fgColor[2]);
    p.noFill();
    p.rect(4, 4, p.width - 8, p.height - 8);
  };
  
  
  p.mousePressed = function() {
    if (p.mouseX > p.width * 0.1) {
      p.noiseSeed(Math.floor(p.random(7654321)));
    }
  };
  
  function buildMulhollandControls() {
    const controls = document.getElementById('mulholland-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Wavy Mountains</div>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">
          Animated layered mountains. Click to regenerate.
        </p>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Appearance</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Transparency <span id="mount-trans-val">200</span></div>
          <input type="range" id="mount-trans" min="50" max="255" value="200">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Layers <span id="mount-layers-val">12</span></div>
          <input type="range" id="mount-layers" min="5" max="20" value="12">
        </div>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Custom Colors</div>
        <label class="ctrl-check">
          <input type="checkbox" id="mount-custom"> Use Custom Colors
        </label>
        <div id="mount-custom-colors" style="display:none;margin-top:10px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <div>
              <label style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:4px;">Color 1</label>
              <input type="color" id="mount-color1" value="#0077B6" style="width:100%;height:32px;">
            </div>
            <div>
              <label style="font-size:9px;color:var(--text-dim);display:block;margin-bottom:4px;">Color 2</label>
              <input type="color" id="mount-color2" value="#00B4D8" style="width:100%;height:32px;">
            </div>
          </div>
        </div>
      </div>
    `;
    
    buildThemeControls('mulholland-controls');
    
    document.getElementById('mount-trans').oninput = (e) => {
      params.transparency = parseInt(e.target.value);
      document.getElementById('mount-trans-val').textContent = e.target.value;
    };
    
    document.getElementById('mount-layers').oninput = (e) => {
      params.layers = parseInt(e.target.value);
      document.getElementById('mount-layers-val').textContent = e.target.value;
    };
    
    document.getElementById('mount-custom').onchange = (e) => {
      params.useCustomColors = e.target.checked;
      document.getElementById('mount-custom-colors').style.display = 
        e.target.checked ? 'block' : 'none';
    };
    
    document.getElementById('mount-color1').onchange = (e) => {
      params.customColor1 = e.target.value;
    };
    
    document.getElementById('mount-color2').onchange = (e) => {
      params.customColor2 = e.target.value;
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('mulholland-canvas');
    if (container) {
      S = Math.min(container.clientWidth, container.clientHeight) * 0.95;
      p.resizeCanvas(S, S);
    }
  };
}

// ==========================================
// TRANSPARENT EARTH - 3D Point Cloud Sphere
// ==========================================
function transparentEarthSketch(p) {
  let points = [];
  let params = {
    pointCount: 3000,
    noiseZoom: 2,
    noiseAmp: 0.5,
    radius: 200,
    rotationSpeed: 0.005,
    autoRotate: true,
    autoProgress: true,
    progressionRate: 0.005
  };
  let t = 0;
  
  p.setup = function() {
    const container = document.getElementById('earth-canvas');
    p.createCanvas(container.clientWidth, container.clientHeight, p.WEBGL);
    p.colorMode(p.RGB);
    
    // Set responsive radius based on canvas size
    const minDim = Math.min(container.clientWidth, container.clientHeight);
    params.radius = minDim * 0.35; // 35% of smallest dimension
    
    generateSphere();
    buildEarthControls();
  };
  
  function generateSphere() {
    points = [];
    const goldenAngle = p.PI * (3 - p.sqrt(5));
    const theme = getTheme();
    const minColor = hexToRgb(theme.primary);
    const maxColor = hexToRgb(theme.secondary);
    
    for (let i = 0; i < params.pointCount; i++) {
      const y = 1 - (i / (params.pointCount - 1)) * 2;
      const r = p.sqrt(1 - y * y);
      const theta = i * goldenAngle;
      
      const x = p.cos(theta) * r;
      const z = p.sin(theta) * r;
      
      points.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        colorLerp: i / params.pointCount
      });
    }
  }
  
  p.draw = function() {
    const theme = getTheme();
    const bg = hexToRgb(theme.background);
    p.background(bg[0], bg[1], bg[2]);
    
    if (params.autoRotate) {
      p.rotateY(p.frameCount * params.rotationSpeed);
    }
    
    if (params.autoProgress) {
      t += params.progressionRate;
    }
    
    p.rotateX(p.PI / 6);
    
    const minColor = hexToRgb(theme.primary);
    const maxColor = hexToRgb(theme.secondary);
    
    p.strokeWeight(2);
    
    points.forEach(pt => {
      // Apply 4D noise for organic movement
      const noiseVal = p.noise(
        pt.baseX * params.noiseZoom,
        pt.baseY * params.noiseZoom,
        pt.baseZ * params.noiseZoom,
        t
      );
      
      const easedNoise = noiseVal; // Could add easing here
      const noiseRadius = params.radius + easedNoise * params.noiseAmp * 50;
      
      const x = pt.baseX * noiseRadius;
      const y = pt.baseY * noiseRadius;
      const z = pt.baseZ * noiseRadius;
      
      // Color interpolation
      const r = p.lerp(minColor[0], maxColor[0], easedNoise);
      const g = p.lerp(minColor[1], maxColor[1], easedNoise);
      const b = p.lerp(minColor[2], maxColor[2], easedNoise);
      
      p.stroke(r, g, b);
      p.point(x, y, z);
    });
  };
  
  function buildEarthControls() {
    const controls = document.getElementById('earth-controls');
    controls.innerHTML = `
      <div class="ctrl-section">
        <div class="ctrl-label">Transparent Earth</div>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.5;margin-bottom:10px;">
          3D point cloud sphere with noise displacement and color interpolation.
        </p>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Geometry</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Point Count <span id="earth-points-val">3000</span></div>
          <input type="range" id="earth-points" min="1000" max="8000" step="500" value="3000">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Radius Scale <span id="earth-radius-val">35%</span></div>
          <input type="range" id="earth-radius" min="20" max="50" value="35">
        </div>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Noise</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Noise Zoom <span id="earth-zoom-val">2.0</span></div>
          <input type="range" id="earth-zoom" min="1" max="50" value="20">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Noise Amplitude <span id="earth-amp-val">0.5</span></div>
          <input type="range" id="earth-amp" min="1" max="100" value="50">
        </div>
      </div>
      <div class="ctrl-section">
        <div class="ctrl-label">Animation</div>
        <div class="ctrl-row">
          <div class="ctrl-name">Rotation Speed <span id="earth-rot-val">0.005</span></div>
          <input type="range" id="earth-rot" min="1" max="20" value="5">
        </div>
        <div class="ctrl-row">
          <div class="ctrl-name">Progression Rate <span id="earth-prog-val">0.005</span></div>
          <input type="range" id="earth-prog" min="1" max="20" value="5">
        </div>
        <label class="ctrl-check">
          <input type="checkbox" id="earth-autorot" checked> Auto Rotate
        </label>
        <label class="ctrl-check">
          <input type="checkbox" id="earth-autoprog" checked> Auto Progress
        </label>
      </div>
    `;
    
    buildThemeControls('earth-controls');
    
    document.getElementById('earth-points').oninput = (e) => {
      params.pointCount = parseInt(e.target.value);
      document.getElementById('earth-points-val').textContent = e.target.value;
      generateSphere();
    };
    
    document.getElementById('earth-radius').oninput = (e) => {
      const scale = parseInt(e.target.value) / 100;
      const container = document.getElementById('earth-canvas');
      const minDim = Math.min(container.clientWidth, container.clientHeight);
      params.radius = minDim * scale;
      document.getElementById('earth-radius-val').textContent = e.target.value + '%';
    };
    
    document.getElementById('earth-zoom').oninput = (e) => {
      params.noiseZoom = parseInt(e.target.value) / 10;
      document.getElementById('earth-zoom-val').textContent = params.noiseZoom.toFixed(1);
    };
    
    document.getElementById('earth-amp').oninput = (e) => {
      params.noiseAmp = parseInt(e.target.value) / 100;
      document.getElementById('earth-amp-val').textContent = params.noiseAmp.toFixed(2);
    };
    
    document.getElementById('earth-rot').oninput = (e) => {
      params.rotationSpeed = parseInt(e.target.value) / 1000;
      document.getElementById('earth-rot-val').textContent = params.rotationSpeed.toFixed(3);
    };
    
    document.getElementById('earth-prog').oninput = (e) => {
      params.progressionRate = parseInt(e.target.value) / 1000;
      document.getElementById('earth-prog-val').textContent = params.progressionRate.toFixed(3);
    };
    
    document.getElementById('earth-autorot').onchange = (e) => {
      params.autoRotate = e.target.checked;
    };
    
    document.getElementById('earth-autoprog').onchange = (e) => {
      params.autoProgress = e.target.checked;
    };
  }
  
  p.windowResized = function() {
    const container = document.getElementById('earth-canvas');
    if (container) {
      p.resizeCanvas(container.clientWidth, container.clientHeight);
      // Maintain radius proportion on resize
      const minDim = Math.min(container.clientWidth, container.clientHeight);
      params.radius = minDim * 0.35;
    }
  };
}

