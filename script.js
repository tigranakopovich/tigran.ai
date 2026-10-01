const mobileMenu = document.querySelector('.mobile-nav');

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.open = false;
    if (link.hash) {
      const section = document.querySelector(link.hash);
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileMenu.open) {
    mobileMenu.open = false;
    mobileMenu.querySelector('summary').focus();
  }
});

document.addEventListener('click', (event) => {
  if (mobileMenu.open && !mobileMenu.contains(event.target)) {
    mobileMenu.open = false;
  }
});

// Observe diagrams, never hide text or make reading depend on JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scenes = [...document.querySelectorAll('[data-motion]')];
let formFocused = false;

function syncMotion() {
  const active = !document.hidden && !formFocused && !reducedMotion.matches;
  document.body.classList.toggle('page-active', active);
  scenes.forEach((scene) => {
    if (active && scene.classList.contains('is-visible') && !scene.dataset.played) {
      scene.dataset.played = 'true';
      if (window.innerWidth < 768 && scene.dataset.motion !== 'hero') {
        finishScene(scene);
        return;
      }
      scene.classList.add('motion-play');
    }
  });
}

function finishScene(scene) {
  scene.classList.remove('motion-play');
  scene.classList.add('motion-complete');
}

scenes.forEach((scene) => {
  scene.addEventListener('animationend', (event) => {
    const type = scene.dataset.motion;
    const lastStep = scene.querySelector('.process-step:last-child .step-icon');
    const lastResult = scene.querySelector('.case-result:last-child');
    if ((type === 'hero' && event.target === lastStep) ||
        (type === 'case' && event.target === lastResult) ||
        (type === 'steps' && event.target === scene)) {
      finishScene(scene);
    }
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle('is-visible', isIntersecting);
      if (!isIntersecting && target.dataset.played) finishScene(target);
    });
    syncMotion();
  }, { threshold: 0.2 });
  scenes.forEach((scene) => observer.observe(scene));
}

document.addEventListener('visibilitychange', syncMotion);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) scenes.forEach(finishScene);
  syncMotion();
});
const businessField = document.querySelector('#business');
businessField.addEventListener('focus', () => { formFocused = true; syncMotion(); });
businessField.addEventListener('blur', () => { formFocused = false; syncMotion(); });
syncMotion();
