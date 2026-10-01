const mobileMenu = document.querySelector('.mobile-nav');
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.open = false;
  if (link.hash) {
    const section = document.querySelector(link.hash);
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
  }
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.open) {
    mobileMenu.open = false;
    mobileMenu.querySelector('summary').focus();
  }
});
document.addEventListener('click', event => {
  if (mobileMenu.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
});

const heroScene = document.querySelector('.hero-visual');
const heroCards = [...heroScene.querySelectorAll('.input-tile')];
const heroWires = [...heroScene.querySelectorAll('.hero-wire')];
const heroSvg = heroScene.querySelector('.diagram-wires');
const panel = heroScene.querySelector('.process-panel');
const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'path');
trunk.classList.add('joint-trunk');
heroSvg.prepend(trunk);

function layoutHeroWires() {
  const scene = heroScene.getBoundingClientRect();
  const target = panel.getBoundingClientRect();
  const junction = { x: target.left - scene.left + target.width / 2, y: target.top - scene.top - 16 };
  const rects = heroCards.map(card => {
    const box = card.getBoundingClientRect();
    const transform = new DOMMatrixReadOnly(getComputedStyle(card).transform);
    return { x: box.left - scene.left, y: box.bottom - scene.top - transform.m42, width: box.width, top: box.top - scene.top - transform.m42 };
  });
  heroSvg.setAttribute('viewBox', `0 0 ${scene.width} ${scene.height}`);
  rects.forEach((r, i) => {
    const x = r.x + r.width / 2;
    const y = r.y;
    const secondRow = rects[2].top > rects[0].top + 40;
    let route;
    if (secondRow && i < 2) {
      const side = i === 0 ? 3 : scene.width - 3;
      route = `M${x} ${y + 12}H${side}V${junction.y - 20}Q${side} ${junction.y} ${junction.x} ${junction.y}`;
    } else {
      route = `M${x} ${y + 12}C${x} ${junction.y - 24} ${junction.x} ${junction.y - 24} ${junction.x} ${junction.y}`;
    }
    heroWires[i].querySelector('.wire-root').setAttribute('d', route);
    heroWires[i].querySelector('.wire-tether').setAttribute('d', `M${x} ${y}V${y + 24}`);
    heroWires[i].querySelector('.wire-signal').setAttribute('d', `M${x} ${y}V${y + 12}` + route.replace(/^M[^HC]+/, ''));
    heroWires[i].querySelector('.wire-signal').setAttribute('pathLength', '1');
  });
  trunk.setAttribute('d', `M${junction.x} ${junction.y}V${junction.y + 16}`);
  heroSvg.querySelectorAll('circle').forEach(circle => {
    circle.setAttribute('cx', junction.x);
    circle.setAttribute('cy', junction.y);
  });
}
let resizeFrame;
function queueWireLayout() {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(layoutHeroWires);
}
new ResizeObserver(queueWireLayout).observe(heroScene);
heroCards.forEach(card => new ResizeObserver(queueWireLayout).observe(card));
document.fonts.ready.then(queueWireLayout);
window.addEventListener('resize', queueWireLayout);
layoutHeroWires();

// Official public-username draft link; the visitor sends the message in Telegram.
const businessField = document.querySelector('#business');
const contactLink = document.querySelector('.contact-button');
function updateTelegramDraft() {
  const business = businessField.value.trim();
  const message = business
    ? `Здравствуйте, Тигран! Занимаюсь ${business}. Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?`
    : 'Здравствуйте, Тигран! Хочу понять, что можно автоматизировать в моём бизнесе. С чего начнём?';
  const link = new URL('https://t.me/tigran_ai');
  link.searchParams.set('text', message);
  contactLink.href = link.href;
}
businessField.addEventListener('input', updateTelegramDraft);
contactLink.addEventListener('click', updateTelegramDraft);
updateTelegramDraft();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scenes = [...document.querySelectorAll('.motion-scene')];
const demoRows = [...document.querySelectorAll('[data-demo]')];
let formFocused = false;
let activeDemo = null;
let demoTimer = null;

function finishScene(scene) {
  scene.classList.remove('motion-play');
  scene.classList.add('motion-complete');
}
function completeDemo(row) {
  row.querySelectorAll('[data-result]').forEach(value => { value.textContent = value.dataset.result; });
  row.dataset.demoState = 'complete';
  row.setAttribute('aria-busy', 'false');
  row.querySelector('.demo-status').textContent = 'Результат готов';
}
function finishActiveDemo() {
  clearTimeout(demoTimer);
  demoTimer = null;
  if (activeDemo) completeDemo(activeDemo.row);
  activeDemo = null;
}
function scheduleDemo() {
  if (!activeDemo || document.hidden) return;
  activeDemo.started = performance.now();
  demoTimer = setTimeout(() => {
    if (!activeDemo) return;
    const run = activeDemo;
    run.phase += 1;
    if (run.phase === 1) {
      run.row.dataset.demoState = 'processing';
      run.row.querySelector('.demo-status').textContent = 'Обработка';
      run.remaining = 650;
    } else if (run.phase === 2) {
      run.row.querySelectorAll('[data-result]').forEach(value => { value.textContent = value.dataset.result; });
      run.row.dataset.demoState = 'result';
      run.row.querySelector('.demo-status').textContent = 'Результат готов';
      run.remaining = 450;
    } else {
      finishActiveDemo();
      return;
    }
    scheduleDemo();
  }, activeDemo.remaining);
}
function startDemo(row) {
  finishActiveDemo();
  if (reducedMotion.matches) { completeDemo(row); return; }
  row.querySelectorAll('[data-result]').forEach(value => { value.textContent = '—'; });
  row.dataset.demoState = 'input';
  row.setAttribute('aria-busy', 'true');
  row.querySelector('.demo-status').textContent = 'Исходные данные';
  activeDemo = { row, phase: 0, remaining: 350, started: performance.now() };
  scheduleDemo();
}
demoRows.forEach(row => row.querySelector('.demo-trigger').addEventListener('click', () => startDemo(row)));

const stageControls = [...document.querySelectorAll('[data-stage]')];
const workExamples = [...document.querySelectorAll('.work-example')];
const examplesScene = document.querySelector('.stage-examples');
let selectedStage = 0;
let exampleFrame;
function playSelectedExample() {
  workExamples.forEach(example => example.classList.remove('example-play'));
  cancelAnimationFrame(exampleFrame);
  if (reducedMotion.matches || document.hidden || !examplesScene.classList.contains('is-visible') || formFocused) return;
  exampleFrame = requestAnimationFrame(() => workExamples[selectedStage].classList.add('example-play'));
}
function selectStage(index, replay = false) {
  const changed = index !== selectedStage;
  selectedStage = index;
  stageControls.forEach((control, i) => control.setAttribute('aria-pressed', String(i === index)));
  workExamples.forEach((example, i) => example.classList.toggle('is-selected', i === index));
  if (changed || replay) playSelectedExample();
}
stageControls.forEach((control, index) => {
  control.addEventListener('focus', () => selectStage(index));
  control.addEventListener('click', () => selectStage(index, true));
  control.closest('.process-item').addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && window.innerWidth >= 768) selectStage(index);
  });
});
workExamples.forEach(example => example.addEventListener('animationend', event => {
  if (event.target === example && event.animationName === 'example-clock') example.classList.remove('example-play');
}));

function syncMotion() {
  const active = !document.hidden && !formFocused && !reducedMotion.matches;
  document.body.classList.toggle('page-active', active);
  if (!active) return;
  scenes.forEach(scene => {
    if (!scene.classList.contains('is-visible') || scene.dataset.played) return;
    scene.dataset.played = 'true';
    if (scene.dataset.motion === 'examples') { playSelectedExample(); return; }
    if (window.innerWidth < 768 && scene.dataset.motion === 'case') { finishScene(scene); return; }
    scene.classList.add('motion-play');
  });
}
scenes.forEach(scene => scene.addEventListener('animationend', event => {
  const lastStep = scene.querySelector('.process-step:last-child .step-icon');
  const lastResult = scene.querySelector('.case-result:last-child');
  if ((scene.dataset.motion === 'hero' && event.target === lastStep) ||
      (scene.dataset.motion === 'case' && event.target === lastResult)) finishScene(scene);
}));
const motionObserver = new IntersectionObserver(entries => {
  entries.forEach(({target, isIntersecting}) => {
    target.classList.toggle('is-visible', isIntersecting);
    if (!isIntersecting) {
      if (target.dataset.played) finishScene(target);
      if (target === examplesScene) workExamples.forEach(example => example.classList.remove('example-play'));
      if (activeDemo?.row === target) finishActiveDemo();
    }
  });
  syncMotion();
}, {threshold: 0.15});
[...scenes, ...demoRows].forEach(scene => motionObserver.observe(scene));

document.addEventListener('visibilitychange', () => {
  if (document.hidden && activeDemo) {
    activeDemo.remaining = Math.max(0, activeDemo.remaining - (performance.now() - activeDemo.started));
    clearTimeout(demoTimer);
    demoTimer = null;
  } else if (activeDemo) scheduleDemo();
  syncMotion();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    finishActiveDemo();
    scenes.forEach(finishScene);
    workExamples.forEach(example => example.classList.remove('example-play'));
  }
  syncMotion();
});
businessField.addEventListener('focus', () => { formFocused = true; syncMotion(); });
businessField.addEventListener('blur', () => { formFocused = false; syncMotion(); });
syncMotion();
