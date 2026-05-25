(function () {
  const themeToggle = document.getElementById('themeToggle');
  const body        = document.body;

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    body.classList.toggle('light-theme', !isDark);

    if (themeToggle) {
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
    }

    localStorage.setItem('theme', theme);
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme('dark');
    }
  }

  themeToggle?.addEventListener('click', () => {
    const current = localStorage.getItem('theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  initTheme();
})();
