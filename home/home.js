const header = document.querySelector('.portfolio-header');
const links = [...document.querySelectorAll('.portfolio-nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];
let pending = false;

function updateNavigation() {
  pending = false;
  const readingLine = header.getBoundingClientRect().height + 100;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) current = section;
  }
  if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1];
  }
  for (const link of links) {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

function scheduleUpdate() {
  if (!pending) {
    pending = true;
    requestAnimationFrame(updateNavigation);
  }
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
document.fonts.ready.then(scheduleUpdate);
updateNavigation();
