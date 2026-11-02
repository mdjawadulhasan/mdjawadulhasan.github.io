(() => {
  const storageKey = 'portfolio-theme';
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;

  function readPreference() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved === 'dark' || saved === 'light' ? saved : null;
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#111111' : '#fafafa'
    );
  }

  function applyPreference() {
    applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
  }

  preference = readPreference();
  applyPreference();

  document.addEventListener('DOMContentLoaded', () => {
    applyPreference();
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(storageKey, preference);
      } catch {
        // Switching still works when browser storage is unavailable.
      }
      applyPreference();
    });
  });

  systemTheme.addEventListener('change', () => {
    if (!preference) applyPreference();
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      preference = readPreference();
      applyPreference();
    }
  });
})();
