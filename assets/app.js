(() => {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('.theme-toggle');
  const syncTheme = () => themeButtons.forEach(button => {
    const dark = root.dataset.theme === 'dark';
    button.textContent = dark ? 'Mode clair' : 'Mode sombre';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
  });
  themeButtons.forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('fiche-freud-theme', root.dataset.theme); } catch (_) {}
      syncTheme();
    });
  });
  syncTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('fiche-freud-theme'); } catch (_) {}
    if (!saved) { root.dataset.theme = event.matches ? 'dark' : 'light'; syncTheme(); }
  });
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navigation');
  const fixedHeader = document.querySelector('.site-header');
  if (fixedHeader && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      root.style.setProperty('--header-height', fixedHeader.getBoundingClientRect().height + 'px');
    }).observe(fixedHeader);
  }
  const closeMenu = () => {
    if (!menu) return;
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  if (menu) {
    menu.hidden = false;
    document.body.classList.add('js');
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        closeMenu(); menu.focus();
      }
    });
    matchMedia('(min-width: 981px)').addEventListener('change', closeMenu);
  }
  document.querySelectorAll('[data-expand-all], [data-collapse-all]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => document.querySelectorAll('.study-section').forEach(d => {
      d.open = button.hasAttribute('data-expand-all');
    }));
  });
  const revealHash = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (target?.matches('details')) {
      target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
    }
  };
  window.addEventListener('hashchange', revealHash);
  revealHash();
  document.querySelectorAll('[data-print]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => window.print());
  });
  const onHome = /(?:\/|\/index\.html)$/.test(location.pathname);
  const sections = ['comprendre','parcours'].map(id => document.getElementById(id)).filter(Boolean);
  if (onHome && 'IntersectionObserver' in window) {
    const links = document.querySelectorAll('#navigation a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => {
          a.removeAttribute('aria-current');
          if (a.dataset.section === entry.target.id || (entry.target.classList.contains('hero') && a.getAttribute('href') === 'index.html')) a.setAttribute('aria-current','location');
        });
      });
    }, {rootMargin:'-10% 0px -65% 0px', threshold:0});
    [document.querySelector('.hero'), ...sections].filter(Boolean).forEach(section => observer.observe(section));
  }
  const localToc = document.querySelector('.toc nav');
  if (localToc && 'IntersectionObserver' in window) {
    const headings = [...localToc.querySelectorAll('a')].map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      localToc.querySelectorAll('a').forEach(a=>{
        a.removeAttribute('aria-current');
        if (a.hash.slice(1)===entry.target.id) a.setAttribute('aria-current','location');
      });
    }),{rootMargin:'-15% 0px -65% 0px'});
    headings.forEach(h=>observer.observe(h));
  }
})();
