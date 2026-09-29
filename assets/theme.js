(() => {
  let selected;
  try { selected = localStorage.getItem('fiche-freud-theme'); } catch (_) {}
  document.documentElement.dataset.theme = selected === 'dark' || selected === 'light'
    ? selected : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
})();
