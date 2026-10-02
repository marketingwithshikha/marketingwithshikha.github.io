/* ==========================================================================
   Shikha — portfolio
   ========================================================================== */
(() => {
  'use strict';

  /* ---- edit me ------------------------------------------------------------ */
  const CONFIG = {
    email: 'shikhasha203@gmail.com',
    instagram: '',                // TODO: full profile URL, e.g. https://instagram.com/…
    linkedin: '',                 // TODO: full profile URL
  };

  const REELS = [
    { slug: 'bb-meme',      brand: 'BeeBuddy.in',   title: 'Kids vs. moms, summer edition',      format: 'Meme edit · 0:12',          note: 'Zero budget, pure recognition — built to be forwarded to the family group.' },
    { slug: 'bb-explainer', brand: 'BeeBuddy.in',   title: 'The after-school activity hunt',     format: 'Talking head · 0:36',       note: 'Problem in second one, brand by second six.' },
    { slug: 'bb-reveal',    brand: 'BeeBuddy.in',   title: 'The 100+ camps paper relay',         format: 'Lo-fi stunt · 0:35',        note: 'One sheet of paper, passed hand to hand until it lands the message.' },
    { slug: 'bb-diy',       brand: 'BeeBuddy.in',   title: 'Leaf-print butterflies',             format: 'DIY tutorial · 0:31',       note: 'The save-it-for-a-rainy-afternoon post.' },
    { slug: 'bb-tierlist',  brand: 'BeeBuddy.in',   title: 'Rating summer camps (kids decide)',  format: 'Tier list · 1:29',          note: 'A trend format, bent into a buying guide.' },
    { slug: 'wp-hubspot',   brand: 'The Web Plant', title: 'Why HubSpot Content Hub?',           format: 'Sticky-note build · 0:15',  note: 'Six sticky notes, one feature list, zero slides.' },
    { slug: 'wp-summit',    brand: 'The Web Plant', title: 'The AI Summit teaser',               format: 'Phone-swipe teaser · 0:15', note: 'The announcement, delivered one swipe at a time.' },
    { slug: 'wp-dynatech',  brand: 'The Web Plant', title: 'An enterprise website, walked through', format: 'Screen walk · 0:15',     note: 'Real screens + punchy captions = proof in fifteen seconds.' },
    { slug: 'wp-commerce',  brand: 'The Web Plant', title: 'Composable commerce, unboxed',       format: 'Screen walk · 0:21',        note: 'Opens like a laptop, closes like a pitch.' },
    { slug: 'mmm-hsbc',     brand: 'MyMoneyMantra', title: 'The zero-fee credit card',           format: 'Motion graphics · 0:37',    note: 'Lead with the number that matters: zero.' },
    { slug: 'mmm-hdfc',     brand: 'MyMoneyMantra', title: 'Why this personal loan?',            format: 'Motion graphics · 0:30',    note: 'Rate, tenure, amount, speed — one fact per beat.' },
    { slug: 'mmm-debt',     brand: 'MyMoneyMantra', title: 'Stop overspending, gently',          format: 'Talking head · 0:26',       note: 'Advice that sounds like a friend, not a bank.' },
    { slug: 'mmm-cards',    brand: 'MyMoneyMantra', title: 'Credit card fees, decoded',          format: 'Talking head · 0:32',       note: 'Annual fees and reward points, minus the jargon.' },
  ];
  const STILLS = ['bb-weekend', 'bb-camps', 'wp-ai', 'wp-vs'];
  const INDEX = Object.fromEntries(REELS.map((r, i) => [r.slug, i]));

  /* ---- env ---------------------------------------------------------------- */
  const d = document;
  const root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, '0');
  const mq = (q) => window.matchMedia(q).matches;

  const RM = mq('(prefers-reduced-motion: reduce)');
  const FINE = mq('(hover: hover) and (pointer: fine)');
  const isMobile = () => mq('(max-width: 767px)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  window.__ready = true;
  if (!hasGSAP || RM) root.classList.remove('js');
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ---- smooth scroll ------------------------------------------------------ */
  let lenis = null;
  if (hasGSAP && !RM && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = id === '#top' ? d.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(id === '#top' ? 0 : target, { offset: id === '#top' ? 0 : -80, duration: 1.4 });
      else if (id === '#top') window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
      else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      if (id !== '#top') {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ---- nav ---------------------------------------------------------------- */
  const nav = $('[data-nav]');
  let lastY = 0;
  const onScroll = (y) => {
    nav.classList.toggle('is-solid', y > 40);
    if (y > lastY + 6 && y > 320) nav.classList.add('is-hidden');
    else if (y < lastY - 6) nav.classList.remove('is-hidden');
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  /* ---- contact config ----------------------------------------------------- */
  $('[data-email-link]').href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Let’s make something people stop for')}`;
  const copyBtn = $('[data-copy-email]');
  const copyLabel = $('[data-copy-label]');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      copyLabel.textContent = 'Copied. Talk soon!';
      copyBtn.querySelector('use').setAttribute('href', '#i-check');
    } catch (e) {
      copyLabel.textContent = CONFIG.email;
    }
    setTimeout(() => {
      copyLabel.textContent = 'Copy email';
      copyBtn.querySelector('use').setAttribute('href', '#i-copy');
    }, 2400);
  });
  $$('[data-social]').forEach((a) => {
    const url = CONFIG[a.dataset.social];
    if (url) a.href = url;
    else a.closest('li').hidden = true;
  });
  const socials = $('.socials');
  if (!$$('li:not([hidden])', socials).length) socials.hidden = true;

  $('[data-year]').textContent = new Date().getFullYear();

  /* ---- custom cursor ------------------------------------------------------ */
  const cursor = $('.cursor');
  const cursorLabel = $('.cursor__label');
  let cursorOn = false;
  if (hasGSAP && FINE && !RM) {
    cursorOn = true;
    root.classList.add('has-cursor');
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.18, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.18, ease: 'power3' });
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      xTo(e.clientX); yTo(e.clientY);
    }, { passive: true });
    d.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor], [data-prop], a, button');
      cursor.classList.remove('is-label', 'is-link');
      if (!t) return;
      const label = t.dataset.cursor || (t.hasAttribute('data-prop') ? 'Drag' : '');
      if (label) { cursorLabel.textContent = label; cursor.classList.add('is-label'); }
      else cursor.classList.add('is-link');
    });
    d.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
    d.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
    d.documentElement.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    d.documentElement.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }

  /* ---- text splitting ----------------------------------------------------- */
  function splitWords(el, cls) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = d.createElement('span');
            w.className = cls;
            const inner = d.createElement('span');
            inner.className = `${cls}__in`;
            inner.textContent = part;
            w.append(inner);
            frag.append(w);
            out.push(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.matches('.vpill, video, svg')) {
          walk(n);
        }
      });
    };
    walk(el);
    return out;
  }

  /* ---- draggable props & stickies ----------------------------------------- */
  let zTop = 30;
  function makeDraggable(el) {
    let dragging = false, sx = 0, sy = 0, bx = 0, by = 0, x = 0, y = 0, br = 0, brSet = false;
    let lx = 0, ly = 0, lt = 0, vx = 0, vy = 0;
    const host = el.closest('.prop') || el;
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
      sx = lx = e.clientX; sy = ly = e.clientY; lt = performance.now();
      bx = x = gsap.getProperty(el, 'x'); by = y = gsap.getProperty(el, 'y');
      if (!brSet) { br = gsap.getProperty(el, 'rotation'); brSet = true; } // the object's resting tilt
      vx = vy = 0;
      host.style.zIndex = ++zTop;
      el.classList.add('is-dragging');
      gsap.to(el, { scale: 1.08, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dt = Math.max(16, now - lt);
      vx = ((e.clientX - lx) / dt) * 1000; vy = ((e.clientY - ly) / dt) * 1000;
      lx = e.clientX; ly = e.clientY; lt = now;
      x = bx + e.clientX - sx; y = by + e.clientY - sy;
      gsap.set(el, { x, y, rotation: br + clamp(vx / 70, -20, 20) });
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      const tx = clamp(vx * 0.12, -260, 260), ty = clamp(vy * 0.12, -260, 260);
      gsap.to(el, { x: x + tx, y: y + ty, rotation: br, scale: 1, duration: 0.9, ease: 'power3.out' });
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('dragstart', (e) => e.preventDefault());
  }
  if (hasGSAP) $$('[data-prop]').forEach(makeDraggable);

  /* ==========================================================================
     HERO FEED — press & hold to stop the scroll
     ========================================================================== */
  const feedEl = $('[data-feed]');
  const feedWrap = $('.hero__feedwrap');
  const feedState = { factor: RM ? 0 : 1 };
  let feedCols = [];
  let feedVisible = true;

  function buildFeed() {
    const n = isMobile() ? 2 : mq('(min-width: 1280px)') ? 4 : 3;
    if (feedCols.length === n) { measureFeed(); return; }
    feedEl.innerHTML = '';
    const items = [];
    REELS.forEach((r, i) => {
      items.push({ src: `media/poster/${r.slug}.webp`, still: false });
      if (i % 3 === 1 && STILLS[(i - 1) / 3]) items.push({ src: `media/stills/${STILLS[(i - 1) / 3]}.webp`, still: true });
    });
    const speeds = [22, -17, 27, -21];
    feedCols = Array.from({ length: n }, (_, c) => {
      const col = d.createElement('div');
      col.className = 'feed__col';
      const track = d.createElement('div');
      track.className = 'feed__track';
      const set = items.filter((_, i) => i % n === c);
      const html = set.map((it) => `<div class="feed__card${it.still ? ' feed__card--still' : ''}"><img src="${it.src}" alt=""></div>`).join('');
      // three copies so a short column can never show a gap while looping
      track.innerHTML = html + html + html;
      col.append(track);
      feedEl.append(col);
      return { track, pos: Math.random() * 400, speed: speeds[c % speeds.length], half: 1 };
    });
    measureFeed();
  }
  function measureFeed() {
    feedCols.forEach((c) => {
      const gap = parseFloat(getComputedStyle(c.track).rowGap) || 0;
      c.half = (c.track.scrollHeight + gap) / 3 || 1; // one copy + the gap that joins copies
    });
  }
  function feedTick(time, delta) {
    if (!feedVisible) return;
    const dt = Math.min(delta, 64) / 1000;
    feedCols.forEach((c) => {
      c.pos = (((c.pos + c.speed * feedState.factor * dt) % c.half) + c.half) % c.half;
      c.track.style.transform = `translate3d(0, ${-c.pos}px, 0)`;
    });
  }
  buildFeed();
  if (hasGSAP) gsap.ticker.add(feedTick);

  // reveal the feed only once every poster is decoded, so it never flashes empty cards
  const feedReady = Promise.race([
    Promise.all([...new Set($$('img', feedEl).map((i) => i.src))].map((src) => {
      const im = new Image();
      im.src = src;
      return im.decode().catch(() => {});
    })),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
  new IntersectionObserver(([en]) => { feedVisible = en.isIntersecting; }).observe($('[data-hero]'));

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { buildFeed(); if (hasGSAP) ScrollTrigger.refresh(); }, 180);
  });

  // hold interaction
  const thumb = $('[data-thumb]');
  const stamp = $('[data-stamp]');
  const stampNote = $('[data-stamp-note]');
  const hint = $('[data-hint]');
  let holding = false;
  let picked = null;
  if (store.get('hinted') && hint) hint.style.display = 'none';

  function holdStart() {
    if (holding || !hasGSAP) return;
    holding = true;
    thumb.classList.add('is-holding');
    if (hint && hint.style.display !== 'none') {
      gsap.to(hint, { opacity: 0, duration: 0.3, onComplete: () => { hint.style.display = 'none'; } });
      store.set('hinted', '1');
    }
    gsap.killTweensOf(feedState);
    gsap.to(feedState, { factor: 0, duration: RM ? 0 : 0.55, ease: 'power3.out', onComplete: onStopped });
  }
  function onStopped() {
    if (!holding) return;

    // pick the card nearest the stamp
    const wr = feedWrap.getBoundingClientRect();
    const cx = wr.left + wr.width / 2, cy = wr.top + wr.height * (isMobile() ? 0.4 : 0.44);
    let best = null, bestD = Infinity;
    $$('.feed__card', feedEl).forEach((card) => {
      const r = card.getBoundingClientRect();
      const dd = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
      if (dd < bestD) { bestD = dd; best = card; }
    });
    picked = best;
    if (picked) picked.classList.add('is-picked');

    gsap.fromTo(stamp, { opacity: 0, scale: 2.3, rotation: -18 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.42, ease: 'back.out(2.4)' });
    gsap.fromTo(stampNote, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.25, ease: 'power3.out' });
    gsap.fromTo(feedEl, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  }
  function holdEnd() {
    if (!holding) return;
    holding = false;
    thumb.classList.remove('is-holding');
    if (picked) { picked.classList.remove('is-picked'); picked = null; }
    gsap.to([stamp, stampNote], { opacity: 0, duration: 0.25, overwrite: true });
    gsap.killTweensOf(feedState);
    if (!RM) gsap.to(feedState, { factor: 1, duration: 1.1, ease: 'power2.in' });
  }

  thumb.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { thumb.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
    holdStart();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => thumb.addEventListener(ev, holdEnd));
  thumb.addEventListener('contextmenu', (e) => e.preventDefault());
  thumb.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); holdStart(); }
  });
  thumb.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') holdEnd(); });
  thumb.addEventListener('blur', holdEnd);
  // on desktop, holding anywhere on the feed works too
  if (FINE) {
    feedWrap.addEventListener('pointerdown', (e) => {
      if (e.target.closest('[data-thumb]') || e.button !== 0) return;
      holdStart();
    });
    window.addEventListener('pointerup', holdEnd);
    feedWrap.dataset.cursor = 'Hold';
  }

  /* ==========================================================================
     REEL CARDS
     ========================================================================== */
  $$('.reel').forEach((li) => {
    const btn = $('.reel__phone', li);
    const v = $('.reel__loop', li);
    v.addEventListener('playing', () => li.classList.add('is-playing'));
    li._play = () => {
      if (!v.getAttribute('src')) v.src = v.dataset.src;
      const p = v.play();
      if (p) p.catch(() => {});
    };
    li._stop = () => { v.pause(); li.classList.remove('is-playing'); };
    if (FINE) {
      li.addEventListener('pointerenter', li._play);
      li.addEventListener('pointerleave', li._stop);
      btn.addEventListener('focus', li._play);
      btn.addEventListener('blur', li._stop);
    }
    btn.addEventListener('click', () => openPlayer(btn.dataset.reel));
  });
  if (!FINE && !RM && !saveData) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const li = en.target.closest('.reel');
        if (en.isIntersecting) li._play(); else li._stop();
      });
    }, { threshold: 0.75 });
    $$('.reel__phone').forEach((b) => io.observe(b));
  }

  // lazy looping pills in the manifesto
  const pillIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting && !RM) {
        if (!v.getAttribute('src')) v.src = v.dataset.lazySrc;
        const p = v.play(); if (p) p.catch(() => {});
      } else v.pause();
    });
  }, { rootMargin: '120px' });
  $$('.vpill video').forEach((v) => {
    if (RM) { v.src = v.dataset.lazySrc; v.preload = 'metadata'; return; }
    pillIO.observe(v);
  });

  /* ==========================================================================
     REEL PLAYER (dialog)
     ========================================================================== */
  const P = {
    dlg: $('[data-player]'),
    phone: $('[data-player-phone]'),
    v: $('[data-player-video]'),
    bar: $('[data-player-bar]'),
    toggle: $('[data-player-toggle]'),
    mute: $('[data-player-mute]'),
    count: $('[data-player-count]'),
    brand: $('[data-player-brand]'),
    title: $('[data-player-title]'),
    format: $('[data-player-format]'),
    note: $('[data-player-note]'),
    info: $('.player__info'),
    idx: 0,
    muted: false,
    raf: 0,
    lastFocus: null,
    swiped: false,
  };

  function syncMute() {
    P.v.muted = P.muted;
    P.mute.setAttribute('aria-label', P.muted ? 'Unmute' : 'Mute');
    P.mute.querySelector('use').setAttribute('href', P.muted ? '#i-mute' : '#i-sound');
  }
  function playerPlay() {
    const p = P.v.play();
    if (p) p.catch(() => { P.muted = true; syncMute(); P.v.play().catch(() => {}); });
  }
  function loadReel(i, dir = 0) {
    P.idx = (i + REELS.length) % REELS.length;
    const r = REELS[P.idx];
    P.count.textContent = `${pad(P.idx + 1)} / ${pad(REELS.length)}`;
    P.brand.textContent = r.brand;
    P.title.textContent = r.title;
    P.format.textContent = r.format;
    P.note.textContent = r.note;
    const swap = () => {
      P.v.poster = `media/poster/${r.slug}.webp`;
      P.v.src = `media/full/${r.slug}.mp4`;
      syncMute();
      playerPlay();
    };
    if (hasGSAP && !RM) {
      if (dir) {
        gsap.timeline()
          .to(P.phone, { yPercent: -dir * 6, opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: swap })
          .fromTo(P.phone, { yPercent: dir * 6, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
      } else {
        swap();
        gsap.fromTo(P.phone, { scale: 0.9, opacity: 0, rotation: -3 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: 'expo.out' });
      }
      gsap.fromTo(P.info.children, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out', delay: 0.1 });
    } else swap();
  }
  function renderBar() {
    const dur = P.v.duration || 1;
    P.bar.style.transform = `scaleX(${clamp(P.v.currentTime / dur, 0, 1)})`;
    P.raf = requestAnimationFrame(renderBar);
  }
  function openPlayer(slug) {
    P.lastFocus = d.activeElement;
    $$('.reel').forEach((li) => li._stop && li._stop());
    P.dlg.showModal();
    root.classList.add('player-open');
    if (cursorOn) root.classList.remove('has-cursor');
    if (lenis) lenis.stop();
    loadReel(INDEX[slug] ?? 0);
    cancelAnimationFrame(P.raf); renderBar();
  }
  function cleanupPlayer() {
    cancelAnimationFrame(P.raf);
    P.v.pause();
    P.v.removeAttribute('src');
    P.v.load();
    root.classList.remove('player-open');
    if (cursorOn) root.classList.add('has-cursor');
    if (lenis) lenis.start();
    if (P.lastFocus) P.lastFocus.focus({ preventScroll: true });
  }
  const closePlayer = () => { if (P.dlg.open) P.dlg.close(); };
  P.dlg.addEventListener('close', cleanupPlayer);
  $('[data-player-close]').addEventListener('click', closePlayer);
  $('[data-player-next]').addEventListener('click', () => loadReel(P.idx + 1, 1));
  $('[data-player-prev]').addEventListener('click', () => loadReel(P.idx - 1, -1));
  P.dlg.addEventListener('click', (e) => {
    if (e.target === P.dlg || e.target.classList.contains('player__stage')) closePlayer();
  });
  P.toggle.addEventListener('click', () => {
    if (P.swiped) { P.swiped = false; return; }
    if (P.v.paused) playerPlay(); else P.v.pause();
  });
  P.v.addEventListener('play', () => { P.dlg.classList.remove('is-paused'); P.toggle.setAttribute('aria-label', 'Pause'); });
  P.v.addEventListener('pause', () => { if (P.v.getAttribute('src')) P.dlg.classList.add('is-paused'); P.toggle.setAttribute('aria-label', 'Play'); });
  P.v.addEventListener('ended', () => loadReel(P.idx + 1, 1));
  P.mute.addEventListener('click', () => { P.muted = !P.muted; syncMute(); });
  P.dlg.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); loadReel(P.idx + 1, 1); }
    else if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); loadReel(P.idx - 1, -1); }
    else if (k === 'm' || k === 'M') { P.muted = !P.muted; syncMute(); }
    else if (k === 'k' || (k === ' ' && !(d.activeElement && d.activeElement.closest('.player__navs, .player__close, .player__mute')))) {
      e.preventDefault();
      if (P.v.paused) playerPlay(); else P.v.pause();
    }
  });
  // swipe & wheel like a real feed
  let ty0 = 0, tx0 = 0;
  P.phone.addEventListener('touchstart', (e) => { ty0 = e.touches[0].clientY; tx0 = e.touches[0].clientX; }, { passive: true });
  P.phone.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - ty0;
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.max(Math.abs(dy), Math.abs(dx)) < 50) return;
    P.swiped = true;
    setTimeout(() => { P.swiped = false; }, 400);
    const dir = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 1 : -1) : (dx < 0 ? 1 : -1);
    loadReel(P.idx + dir, dir);
  }, { passive: true });
  let wheelLock = 0;
  P.dlg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now < wheelLock || Math.abs(e.deltaY) < 24) return;
    wheelLock = now + 750;
    const dir = e.deltaY > 0 ? 1 : -1;
    loadReel(P.idx + dir, dir);
  }, { passive: false });

  /* ==========================================================================
     MOTION (GSAP)
     ========================================================================== */
  const tickerTracks = $$('[data-ticker] .ticker__track');
  tickerTracks.forEach((t) => { t.innerHTML += t.innerHTML; });

  if (!hasGSAP) return;

  // hero intro
  const heroProps = $$('.hero .prop img');
  if (!RM) {
    gsap.set(heroProps, { opacity: 0 });
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      delay: 0.1,
      onComplete: () => $('[data-hero]').classList.add('is-entered'),
    });
    tl.to('[data-enter-line]', { y: 0, duration: 1.25, stagger: 0.1 }, 0)
      .to('.hero [data-enter]', { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.4)
      .to('.hero__name', { '--hlw': '100%', duration: 0.8, ease: 'power2.inOut' }, 0.9)
      .from(thumb,{ scale: 0, rotation: -120, duration: 1.1, ease: 'back.out(1.7)' }, 0.8)
      .fromTo(heroProps, { opacity: 0, y: -240, rotation: -40 }, { opacity: 1, y: 0, rotation: 0, duration: 1.1, ease: 'back.out(1.3)', stagger: 0.14 }, 0.9);
    if (hint && hint.style.display !== 'none') {
      const paths = $$('[data-draw]', hint);
      paths.forEach((p) => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      tl.from(hint, { opacity: 0, duration: 0.4 }, 1.7)
        .to(paths, { strokeDashoffset: 0, duration: 0.6, stagger: 0.3, ease: 'power2.inOut' }, 1.8);
    }
  } else {
    $('[data-hero]').classList.add('is-entered');
  }
  feedReady.then(() => {
    if (RM) { gsap.set(feedEl, { opacity: 1 }); return; }
    gsap.fromTo(feedEl, { opacity: 0, scale: 0.93 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' });
  });

  // tickers react to scroll velocity
  if (!RM) {
    const tickers = $('.tickers');
    const anims = tickerTracks.map((t) => t.getAnimations && t.getAnimations()[0]).filter(Boolean);
    const sk = { v: 0 };
    ScrollTrigger.create({
      trigger: tickers, start: 'top bottom', end: 'bottom top',
      onUpdate(self) {
        const v = clamp(self.getVelocity() / -260, -9, 9);
        if (Math.abs(v) > Math.abs(sk.v)) {
          sk.v = v;
          gsap.to(sk, {
            v: 0, duration: 0.9, ease: 'power3.out', overwrite: true,
            onUpdate: () => {
              tickers.style.setProperty('--skew', `${sk.v.toFixed(2)}deg`);
              anims.forEach((a) => { a.playbackRate = 1 + Math.abs(sk.v) * 0.35; });
            },
          });
        }
      },
    });
  }

  /* ---- results: scrolling down moves the board to the right ---------------- */
  const proof = $('.proof');
  if (proof && !RM) {
    const pin = $('[data-proof-pin]', proof);
    const track = $('[data-proof-track]', proof);
    const bar = $('[data-proof-bar]', proof);
    proof.classList.add('is-h');
    const dist = () => Math.max(0, track.scrollWidth - pin.clientWidth);
    const slide = gsap.to(track, { x: () => -dist(), ease: 'none' });
    ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: () => `+=${dist()}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: slide,
      onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress.toFixed(4)})`; },
    });
    // cards already on screen when the board arrives just show; the rest slide in with their bubbles
    $$('.shot', track).forEach((shot) => {
      const bubbles = $$('.bubble', shot);
      const offstage = shot.getBoundingClientRect().left - track.getBoundingClientRect().left > pin.clientWidth * 0.85;
      const st = offstage
        ? { trigger: shot, containerAnimation: slide, start: 'left 88%', toggleActions: 'play none none reverse' }
        : { trigger: pin, start: 'top 55%', toggleActions: 'play none none reverse' };
      if (offstage) gsap.from(shot, { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: st });
      gsap.from(bubbles, {
        scale: 0.3, opacity: 0, y: 14, duration: 0.55, ease: 'back.out(2.2)', stagger: 0.18,
        delay: offstage ? 0.25 : 0,
        scrollTrigger: st,
      });
    });
  }

  if (RM) return;

  // big headings: word-by-word rise
  $$('[data-split]').forEach((h) => {
    const words = splitWords(h, 'w').map((w) => w.firstChild);
    gsap.from(words, {
      yPercent: 115, rotation: 5, duration: 1.1, ease: 'expo.out', stagger: 0.05,
      scrollTrigger: { trigger: h, start: 'top 86%' },
    });
  });

  // manifesto: words light up as you read
  const mt = $('[data-words]');
  const mWords = splitWords(mt, 'mw');
  gsap.fromTo(mWords, { opacity: 0.14 }, {
    opacity: 1, ease: 'none', stagger: 0.05,
    scrollTrigger: { trigger: mt, start: 'top 80%', end: 'bottom 50%', scrub: 0.6 },
  });
  gsap.to('[data-hl]', {
    '--hlw': '100%', duration: 0.9, ease: 'power2.inOut',
    scrollTrigger: { trigger: '[data-hl]', start: 'top 72%' },
  });

  // facts count up
  $$('.fact__n').forEach((el) => {
    const raw = el.textContent.trim();
    const num = parseFloat(raw);
    const dec = raw.includes('.') ? 1 : 0;
    const suffix = raw.replace(/[\d.]/g, '');
    const o = { v: 0 };
    gsap.to(o, {
      v: num, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      onUpdate: () => { el.textContent = (dec ? o.v.toFixed(dec) : Math.round(o.v)) + suffix; },
    });
  });

  // chapters
  $$('.chapter').forEach((ch) => {
    gsap.from($$('.chapter__id > *, .chapter__brief > div', ch), {
      y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: ch, start: 'top 78%' },
    });
    const reels = $$('.reel', ch);
    if (!isMobile()) {
      gsap.from(reels, {
        y: 200, x: (i, _, arr) => ((arr.length - 1) / 2 - i) * 60,
        rotation: (i) => (i % 2 ? 1 : -1) * 10,
        opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: $('.reels', ch), start: 'top 84%' },
      });
    }
  });

  // tilted objects that also have CSS hover states reveal via CSS, not GSAP
  const rvIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      rvIO.unobserve(el);
      // after the entrance, hover states shouldn't inherit the stagger delay
      setTimeout(() => el.classList.add('is-settled'), 1300 + (parseFloat(el.style.getPropertyValue('--d')) || 0));
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  $$('.print').forEach((el) => {
    const sibs = el.parentElement.children;
    el.style.setProperty('--d', `${[...sibs].indexOf(el) * 90}ms`);
    el.classList.add('rv');
    rvIO.observe(el);
  });

  // contact
  gsap.from('.contact__pre, .contact__actions', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.contact', start: 'top 70%' } });

  // props: drop in, then drift on scroll
  $$('.prop').forEach((p) => {
    if (p.closest('.hero')) return;
    const img = $('img', p);
    gsap.from(img, {
      y: -160, rotation: -35, opacity: 0, duration: 1.1, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: p, start: 'top 90%' },
    });
  });
  $$('[data-parallax]').forEach((p) => {
    gsap.to(p, {
      y: parseFloat(p.dataset.parallax), ease: 'none',
      scrollTrigger: { trigger: p.closest('section, article') || p, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // magnetic buttons
  if (FINE) {
    $$('.magnetic').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          '--mx': `${(e.clientX - (r.left + r.width / 2)) * 0.28}px`,
          '--my': `${(e.clientY - (r.top + r.height / 2)) * 0.4}px`,
          duration: 0.4, ease: 'power3.out', overwrite: 'auto',
        });
      });
      el.addEventListener('pointerleave', () => gsap.to(el, { '--mx': '0px', '--my': '0px', duration: 0.8, ease: 'elastic.out(1, 0.35)' }));
    });
  }

  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => { measureFeed(); ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { measureFeed(); ScrollTrigger.refresh(); });

  console.log('%cpsst.%c You scrolled all the way into the console. That’s commitment. Say hi → ' + CONFIG.email,
    'font: 600 18px Fraunces; color: #FF4F9A', 'font: 14px Fraunces');
})();
