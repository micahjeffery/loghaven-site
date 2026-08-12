(() => {
  const toc = document.getElementById('sectionToc');
  const toggle = document.getElementById('tocToggle');
  const panel = document.getElementById('tocPanel');
  if (!toc || !toggle || !panel) return;

  const sections = [...document.querySelectorAll('[data-section-title]')];
  const links = [...panel.querySelectorAll('[data-section-link]')];
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');

  const setOpen = (open) => {
    toc.classList.toggle('toc-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  const updateVisibility = () => {
    const trigger = hero ? Math.max(180, hero.offsetTop + hero.offsetHeight * 0.72) : 260;
    toc.classList.toggle('toc-visible', window.scrollY > trigger);
    if (window.scrollY <= trigger) setOpen(false);
  };

  const setActive = (id) => {
    links.forEach((link) => {
      const active = link.dataset.sectionLink === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const getActiveSection = () => {
    const headerHeight = header ? header.offsetHeight : 0;
    const probe = window.scrollY + headerHeight + Math.min(window.innerHeight * 0.3, 220);
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= probe) current = section.id;
    }
    return current;
  };

  const update = () => {
    updateVisibility();
    const active = getActiveSection();
    if (active) setActive(active);
  };

  toggle.addEventListener('click', () => setOpen(!toc.classList.contains('toc-open')));
  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));

  document.addEventListener('click', (event) => {
    if (toc.classList.contains('toc-open') && !toc.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
