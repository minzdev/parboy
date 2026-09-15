// Portfolio interactions: theme, mobile dropdown, scrollspy, reveal.
(function () {
  var root = document.documentElement;

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pf-theme', next); } catch (e) {}
  });

  // Mobile dropdown
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  function setMenu(open) {
    if (!menuBtn || !mobileNav) return;
    if (open) {
      mobileNav.removeAttribute('hidden');
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Tutup menu');
    } else {
      mobileNav.setAttribute('hidden', '');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Buka menu');
    }
  }
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      setMenu(mobileNav.hasAttribute('hidden'));
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    // Jika di-resize ke desktop, pastikan dropdown tertutup
    var mq = window.matchMedia('(min-width: 1021px)');
    function onBreak(e) { if (e.matches) setMenu(false); }
    if (mq.addEventListener) mq.addEventListener('change', onBreak);
  }

  // Reveal — halus, sekali saja. Fallback: tampilkan semua jika IO tak tersedia.
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Scrollspy
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
  var map = {};
  links.forEach(function (l) { map[l.getAttribute('data-nav')] = l; });
  if ('IntersectionObserver' in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var l = map[en.target.id];
          if (l) l.classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ['beranda', 'ringkasan', 'pengalaman', 'keahlian', 'proyek', 'pendidikan', 'kontak'].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  // Smooth anchor (hormati reduced-motion)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var t = document.getElementById(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });
})();
