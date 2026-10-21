const header = document.querySelector('.site-header');
const menu = document.querySelector('.section-menu');
const menuSummary = menu.querySelector('summary');
const currentLabel = document.querySelector('.current-section');
const links = [...document.querySelectorAll('.site-header nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];
const sectionNames = new Map(
  [...menu.querySelectorAll('a')].map((link) => [link.hash.slice(1), link.textContent.trim()]),
);

let scheduled = false;
let currentId = '';

function updateCurrentSection() {
  scheduled = false;
  const readingLine = header.getBoundingClientRect().height + 80;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) current = section;
  }
  // The shortened ending may be too small to reach the reading line.
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1];
  }
  if (!current || current.id === currentId) return;
  currentId = current.id;
  for (const link of links) {
    const matchesChapter = link.closest('.primary-nav') && link.dataset.chapter
      && link.dataset.chapter === current.dataset.chapter;
    if (link.hash === `#${currentId}` || matchesChapter) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  menu.querySelectorAll('.chapter-group').forEach((group) => {
    group.classList.toggle('is-current', group.dataset.chapter === current.dataset.chapter);
  });
  currentLabel.textContent = sectionNames.get(currentId);
  menuSummary.setAttribute('aria-label', `All sections. Current section: ${sectionNames.get(currentId)}`);
}

function scheduleUpdate() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  }
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
document.fonts.ready.then(scheduleUpdate);
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => { menu.open = false; });
});
document.addEventListener('click', (event) => {
  if (menu.open && !menu.contains(event.target)) menu.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menuSummary.focus();
  }
});

updateCurrentSection();
