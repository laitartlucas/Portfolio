(function () {
  'use strict';

  const header     = document.querySelector('header');
  const menuToggle = document.getElementById('menuToggle');
  const menuMobile = document.getElementById('menuMobile');
  const backToTop  = document.getElementById('backToTop');

  // ── Header scroll ─────────────────────────────────────────
  function onScroll() {
    const scrolled = window.scrollY > 20;
    header?.classList.toggle('scrolled', scrolled);
    backToTop?.classList.toggle('visible', scrolled);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Back to top ───────────────────────────────────────────
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Mobile menu ───────────────────────────────────────────
  function openMenu() {
    menuMobile?.classList.add('open');
    menuToggle?.classList.add('active');
    menuToggle?.setAttribute('aria-expanded', 'true');
    menuMobile?.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menuMobile?.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuMobile?.setAttribute('aria-hidden', 'true');
  }

  menuToggle?.addEventListener('click', () => {
    menuMobile?.classList.contains('open') ? closeMenu() : openMenu();
  });

  menuMobile?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (
      menuMobile?.classList.contains('open') &&
      !header?.contains(e.target) &&
      !menuMobile?.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // ── Scroll animations (IntersectionObserver) ──────────────
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }

  // ── Typing animation (hero page only) ────────────────────
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = ['Suporte N1 e N2', 'SQL & Banco de Dados', 'Python & Automação', 'Windows Server', 'Análise de Dados'];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let paused = false;

    function type() {
      if (paused) return;

      const word = words[wordIndex];

      if (deleting) {
        typedEl.textContent = word.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = word.substring(0, charIndex + 1);
        charIndex++;
      }

      let delay = deleting ? 60 : 100;

      if (!deleting && charIndex === word.length) {
        delay = 2000;
        paused = true;
        setTimeout(() => {
          paused = false;
          deleting = true;
          type();
        }, delay);
        return;
      }

      if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }

      setTimeout(type, delay);
    }

    setTimeout(type, 800);
  }

})();
