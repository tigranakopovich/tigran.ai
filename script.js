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
