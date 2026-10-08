/* Shikha — portfolio */
(() => {
  'use strict';

  /* ---- edit me ------------------------------------------------------------ */
  const CONFIG = {
    email: 'shikhasha203@gmail.com',
    instagram: '', // full profile URL, e.g. https://instagram.com/…
    linkedin: '',  // full profile URL
  };

  // order = order in the player
  const REELS = [
    { slug: 'bb-meme',      brand: 'BeeBuddy',      title: 'Kids vs. moms in summer',        meta: 'Meme · 0:12' },
    { slug: 'bb-explainer', brand: 'BeeBuddy',      title: 'Finding after-school activities', meta: 'Talking head · 0:36' },
    { slug: 'bb-reveal',    brand: 'BeeBuddy',      title: 'The paper relay',                meta: 'Lo-fi stunt · 0:35' },
    { slug: 'bb-diy',       brand: 'BeeBuddy',      title: 'Leaf-print butterflies',         meta: 'DIY tutorial · 0:31' },
    { slug: 'bb-tierlist',  brand: 'BeeBuddy',      title: 'Rating summer camps',            meta: 'Tier list · 1:29' },
    { slug: 'wp-hubspot',   brand: 'The Web Plant', title: 'Why HubSpot Content Hub',        meta: 'Sticky notes · 0:15' },
    { slug: 'wp-summit',    brand: 'The Web Plant', title: 'AI Summit teaser',               meta: 'Event promo · 0:15' },
    { slug: 'wp-dynatech',  brand: 'The Web Plant', title: 'Enterprise site walkthrough',    meta: 'Case study · 0:15' },
    { slug: 'wp-commerce',  brand: 'The Web Plant', title: 'eCommerce site walkthrough',     meta: 'Case study · 0:21' },
    { slug: 'mmm-hsbc',     brand: 'MyMoneyMantra', title: 'Zero-fee credit card',           meta: 'Motion graphics · 0:37' },
    { slug: 'mmm-hdfc',     brand: 'MyMoneyMantra', title: 'Personal loan explainer',        meta: 'Motion graphics · 0:30' },
    { slug: 'mmm-debt',     brand: 'MyMoneyMantra', title: 'How to stop overspending',       meta: 'Talking head · 0:26' },
    { slug: 'mmm-cards',    brand: 'MyMoneyMantra', title: 'Credit card fees, explained',    meta: 'Talking head · 0:32' },
  ];
  const INDEX = Object.fromEntries(REELS.map((r, i) => [r.slug, i]));

  /* ---- helpers -------------------------------------------------------------- */
  const d = document;
  const root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mq = (q) => window.matchMedia(q).matches;
  const RM = mq('(prefers-reduced-motion: reduce)');
  const HOVER = mq('(hover: hover) and (pointer: fine)');
  const play = (v) => { const p = v.play(); if (p) p.catch(() => {}); };
  window.__ready = true;

  /* ---- nav shadow ------------------------------------------------------------ */
  const nav = $('[data-nav]');
  const onScrollNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---- fade-ins ---------------------------------------------------------------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      revealIO.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => revealIO.observe(el));

  /* ---- contact ----------------------------------------------------------------- */
  $('[data-email-link]').href = `mailto:${CONFIG.email}`;
  const copyBtn = $('[data-copy-email]');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      copyBtn.textContent = 'Copied';
    } catch (e) {
      copyBtn.textContent = CONFIG.email;
    }
    setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 2000);
  });
  $$('[data-social]').forEach((a) => {
    const url = CONFIG[a.dataset.social];
    if (url) a.href = url; else a.closest('li').remove();
  });
  if (!$$('.socials li').length) $('.socials').remove();
  $('[data-year]').textContent = new Date().getFullYear();

  /* ---- reel cards: preview on hover (desktop) or when in view (touch) ------------- */
  $$('.reel').forEach((li) => {
    const btn = $('.reel__media', li);
    const v = $('video', li);
    v.addEventListener('playing', () => li.classList.add('is-playing'));
    li._play = () => { if (!v.getAttribute('src')) v.src = v.dataset.src; play(v); };
    li._stop = () => { v.pause(); li.classList.remove('is-playing'); };
    if (HOVER) {
      li.addEventListener('pointerenter', li._play);
      li.addEventListener('pointerleave', li._stop);
    }
    btn.addEventListener('click', () => openPlayer(btn.dataset.reel));
  });
  if (!HOVER && !RM) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const li = en.target.closest('.reel');
        if (en.isIntersecting) li._play(); else li._stop();
      });
    }, { threshold: 0.8 });
    $$('.reel__media').forEach((b) => io.observe(b));
  }

  const heroReel = $('.hero__reel');
  const heroVideo = $('video', heroReel);
  if (RM) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }
  heroReel.addEventListener('click', () => openPlayer(heroReel.dataset.reel));

  /* ---- results: scrolling down moves the row sideways ----------------------------- */
  const results = $('.results');
  const track = $('[data-track]');
  const bar = $('[data-progress]');
  const shots = $$('.shot', track);
  let dist = 0;
  let ticking = false;

  function layoutResults() {
    if (RM) return;
    results.classList.add('is-h');
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    results.style.height = `${dist + window.innerHeight}px`;
    updateResults();
  }
  function updateResults() {
    ticking = false;
    const top = results.getBoundingClientRect().top;
    const p = dist ? clamp(-top / dist, 0, 1) : 0;
    track.style.transform = `translate3d(${-p * dist}px, 0, 0)`;
    bar.style.transform = `scaleX(${p})`;
    results.classList.toggle('is-moving', p > 0 && p < 1);
    const edge = window.innerWidth * 0.82;
    shots.forEach((s) => {
      if (s.getBoundingClientRect().left < edge && top < window.innerHeight * 0.4) s.classList.add('is-in');
    });
  }
  window.addEventListener('scroll', () => {
    if (!ticking && results.classList.contains('is-h')) { ticking = true; requestAnimationFrame(updateResults); }
  }, { passive: true });
  let resizeT;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(layoutResults, 150); });
  window.addEventListener('load', layoutResults);
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(layoutResults);
  layoutResults();

  /* ---- reel player ------------------------------------------------------------------ */
  const P = {
    dlg: $('[data-player]'),
    phone: $('[data-player-phone]'),
    v: $('[data-player-video]'),
    bar: $('[data-player-bar]'),
    toggle: $('[data-player-toggle]'),
    mute: $('[data-player-mute]'),
    brand: $('[data-player-brand]'),
    title: $('[data-player-title]'),
    meta: $('[data-player-meta]'),
    count: $('[data-player-count]'),
    idx: 0,
    muted: false,
    raf: 0,
    lastFocus: null,
    swiped: false,
  };

  function syncMute() {
    P.v.muted = P.muted;
    P.mute.setAttribute('aria-label', P.muted ? 'Unmute' : 'Mute');
    $('use', P.mute).setAttribute('href', P.muted ? '#i-mute' : '#i-sound');
  }
  function playerPlay() {
    const p = P.v.play();
    if (p) p.catch(() => { P.muted = true; syncMute(); play(P.v); });
  }
  function loadReel(i) {
    P.idx = (i + REELS.length) % REELS.length;
    const r = REELS[P.idx];
    P.brand.textContent = r.brand;
    P.title.textContent = r.title;
    P.meta.textContent = r.meta;
    P.count.textContent = `${P.idx + 1} / ${REELS.length}`;
    P.v.poster = `media/poster/${r.slug}.webp`;
    P.v.src = `media/full/${r.slug}.mp4`;
    syncMute();
    playerPlay();
  }
  function renderBar() {
    P.bar.style.transform = `scaleX(${clamp(P.v.currentTime / (P.v.duration || 1), 0, 1)})`;
    P.raf = requestAnimationFrame(renderBar);
  }
  function openPlayer(slug) {
    P.lastFocus = d.activeElement;
    $$('.reel').forEach((li) => li._stop());
    heroVideo.pause();
    P.dlg.showModal();
    root.classList.add('player-open');
    loadReel(INDEX[slug] ?? 0);
    cancelAnimationFrame(P.raf);
    renderBar();
  }
  P.dlg.addEventListener('close', () => {
    cancelAnimationFrame(P.raf);
    P.v.pause();
    P.v.removeAttribute('src');
    P.v.load();
    root.classList.remove('player-open');
    if (!RM) play(heroVideo);
    if (P.lastFocus) P.lastFocus.focus({ preventScroll: true });
  });
  const closePlayer = () => { if (P.dlg.open) P.dlg.close(); };
  $('[data-player-close]').addEventListener('click', closePlayer);
  $('[data-player-next]').addEventListener('click', () => loadReel(P.idx + 1));
  $('[data-player-prev]').addEventListener('click', () => loadReel(P.idx - 1));
  P.dlg.addEventListener('click', (e) => {
    if (e.target === P.dlg || e.target.classList.contains('player__stage')) closePlayer();
  });
  P.toggle.addEventListener('click', () => {
    if (P.swiped) { P.swiped = false; return; }
    if (P.v.paused) playerPlay(); else P.v.pause();
  });
  P.v.addEventListener('play', () => { P.dlg.classList.remove('is-paused'); P.toggle.setAttribute('aria-label', 'Pause'); });
  P.v.addEventListener('pause', () => { if (P.v.getAttribute('src')) P.dlg.classList.add('is-paused'); P.toggle.setAttribute('aria-label', 'Play'); });
  P.v.addEventListener('ended', () => loadReel(P.idx + 1));
  P.mute.addEventListener('click', () => { P.muted = !P.muted; syncMute(); });
  P.dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); loadReel(P.idx + 1); }
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); loadReel(P.idx - 1); }
    else if (e.key === 'm' || e.key === 'M') { P.muted = !P.muted; syncMute(); }
  });
  // swipe between reels on touch screens
  let y0 = 0, x0 = 0;
  P.phone.addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; }, { passive: true });
  P.phone.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - y0;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.max(Math.abs(dy), Math.abs(dx)) < 50) return;
    P.swiped = true;
    setTimeout(() => { P.swiped = false; }, 400);
    const next = Math.abs(dy) > Math.abs(dx) ? dy < 0 : dx < 0;
    loadReel(P.idx + (next ? 1 : -1));
  }, { passive: true });
})();
