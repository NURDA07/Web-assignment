/* Shared Day/Night toggle. Storage is optional in restricted browsers. */
(() => {
  'use strict';
  let theme = 'dark';
  try { theme = localStorage.getItem('pixelforge-theme') || theme; } catch {}
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  function applyTheme(value) {
    theme = value === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.bsTheme = theme;
    button.textContent = theme === 'dark' ? '☀ Light / Светлая' : '☾ Dark / Тёмная';
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    button.setAttribute('aria-pressed', String(theme === 'light'));
    try { localStorage.setItem('pixelforge-theme', theme); } catch {}
  }
  button.addEventListener('click', () => applyTheme(theme === 'dark' ? 'light' : 'dark'));
  document.body.prepend(button);
  applyTheme(theme);
})();
