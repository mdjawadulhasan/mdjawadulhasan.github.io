document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = [...navigation.querySelectorAll('a')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  menuButton.querySelector('span').textContent = '+';
}

menuButton.addEventListener('click', () => {
  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isExpanded));
  navigation.classList.toggle('is-open', !isExpanded);
  menuButton.querySelector('span').textContent = isExpanded ? '+' : '−';
});
navigationLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// Keep the navigation aligned with the section nearest the reading position.
function updateCurrentSection() {
  const readingPosition = window.scrollY + 100;
  let currentId = null;
  navigationLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section.getBoundingClientRect().top + window.scrollY <= readingPosition) currentId = section.id;
  });
  navigationLinks.forEach(link => {
    if (link.getAttribute('href') === `#${currentId}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
let scrollScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  window.requestAnimationFrame(() => {
    updateCurrentSection();
    scrollScheduled = false;
  });
}, { passive: true });
window.addEventListener('resize', updateCurrentSection);
window.addEventListener('load', updateCurrentSection);
updateCurrentSection();
