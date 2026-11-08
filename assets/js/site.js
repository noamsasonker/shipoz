/* ארזים, motion + interaction
   Intro curtain, letter reveals, hero fold into an arch, pinned 3D services,
   3D project frames, smooth scroll (Lenis), menu, finish-detail pins, form. */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var hero = $('.hero');
  var header = $('[data-header]');
  var lenis = null;

  /* ---------- Text splitting (from the original cinematic engine) ---------- */
  function splitChars(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var i = 0;
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) { frag.appendChild(node.cloneNode(true)); return; }
      (node.nodeValue.match(/\S+|\s+/g) || []).forEach(function (tok) {
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(' ')); return; }
        var w = document.createElement('span');
        w.className = 'word-unit';
        Array.from(tok).forEach(function (ch) {
          var c = document.createElement('span');
          c.className = 'char-unit';
          c.style.setProperty('--char-index', i++);
          c.textContent = ch;
          w.appendChild(c);
        });
        frag.appendChild(w);
      });
    });
    el.textContent = '';
    el.appendChild(frag);
  }

  function wrapMask(el) {
    var inner = document.createElement('span');
    inner.className = 'mask-inner';
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
  }

  function splitWords(el, cls) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = cls;
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return $$('.' + cls, el);
  }

  $$('.text-reveal-chars').forEach(splitChars);
  $$('.hero-title .line-bold .text-reveal-chars, .page-title .line-bold .text-reveal-chars').forEach(function (el) { el.style.setProperty('--base-delay', '260ms'); });
  $$('.text-reveal-mask').forEach(wrapMask);
  $$('.stagger-container').forEach(function (c) {
    $$('.stagger-item', c).forEach(function (it, i) { it.style.setProperty('--stagger-i', i); });
  });

  /* ---------- Reveal on view ---------- */
  var revealTargets = $$('.text-reveal-mask, .img-reveal-vmask, .img-reveal-scale, .img-reveal-editorial, .stagger-container');
  if (reduce || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    // A fully clipped element can read as "not visible", so clipped reveals watch their container
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        (e.target._revealEls || [e.target]).forEach(function (el) { el.classList.add('is-revealed'); });
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) {
      var watch = el.classList.contains('img-reveal-vmask') ? el.parentNode : el;
      if (watch !== el) { (watch._revealEls = watch._revealEls || []).push(el); }
      io.observe(watch);
    });
  }

  function revealHero() { $$('.hero, .page-hero').forEach(function (el) { el.classList.add('is-revealed'); }); }

  /* ---------- Smooth scroll ---------- */
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t);
    });
  });

  /* ---------- Intro (plays on every load, opens to the sides) ---------- */
  var curtain = $('.curtain');
  var introOpen = false, introWaiters = [];
  function markIntroOpen() {
    if (introOpen) return;
    introOpen = true;
    introWaiters.splice(0).forEach(function (f) { f(); });
  }
  function whenIntroOpen(f) { if (introOpen) f(); else introWaiters.push(f); }
  function endCurtain() {
    markIntroOpen();
    if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
    if (lenis) lenis.start();
    revealHero();
  }
  if (!curtain || reduce || !hasGsap) {
    endCurtain();
  } else {
    if (lenis) lenis.stop();
    var intro = gsap.timeline({ onComplete: endCurtain });
    intro
      // the name is written, stroke by stroke, then filled
      .to('.cl-stroke', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, 0.2)
      .to('.cl-fill', { opacity: 1, duration: 0.7, ease: 'power1.out' }, 1.3)
      .to('.cl-stroke', { opacity: 0, duration: 0.6 }, 1.5)
      // a sheen passes across the letters
      .to('.cl-sheen', { attr: { x: 660 }, duration: 1.1, ease: 'power2.inOut' }, 1.45)
      .fromTo('.cl-sub', { opacity: 0, letterSpacing: '0.9em' }, { opacity: 1, letterSpacing: '0.5em', duration: 1, ease: 'expo.out' }, 1.55)
      // the name steps back and the two halves open to the sides
      .to('.curtain-logo', { opacity: 0, scale: 0.96, duration: 0.5, ease: 'power2.in' }, 2.6)
      .to('.cp-r', { xPercent: 100, duration: 1.15, ease: 'expo.inOut' }, 2.85)
      .to('.cp-l', { xPercent: -100, duration: 1.15, ease: 'expo.inOut' }, 2.85)
      .fromTo('.hero-media img', { scale: 1.32 }, { scale: 1.12, duration: 2, ease: 'expo.out' }, 2.9)
      .add(revealHero, 3.2)
      .add(markIntroOpen, 3.0);
    // Never leave the page covered
    setTimeout(endCurtain, 6500);
  }

  /* ---------- Scroll scenes ---------- */
  var heroProgress = 0;

  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('motion');
    var mm = gsap.matchMedia();

    // Hero: photo folds into an arch, copy lifts away, flanking words arrive in 3D
    if (hero) mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, function (ctx) {
      var arch = ctx.conditions.desk
        ? 'inset(14% 34% 6% 34% round 16vw 16vw 0vw 0vw)'
        : 'inset(16% 10% 26% 10% round 40vw 40vw 0vw 0vw)';
      gsap.set('.hero-media', { clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)' });
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 1,
          onUpdate: function (s) { heroProgress = s.progress; syncHeader(); }
        }
      });
      tl.to('.hero-copy', { yPercent: -18, opacity: 0, duration: 0.32, ease: 'power2.in' }, 0)
        .to('.scroll-cue', { opacity: 0, duration: 0.1 }, 0)
        .to('.hero-media', { clipPath: arch, duration: 1, ease: 'power3.inOut' }, 0.05)
        .to('.hero-media img', { scale: 1, duration: 1, ease: 'power2.inOut' }, 0.05)
        .to('.hero-shade', { opacity: 0, duration: 0.6 }, 0.25)
        .fromTo('.flank-r', { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 0.6)
        .fromTo('.flank-l', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.62)
        .fromTo('.flank-fact', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out', stagger: 0.08 }, 0.64)
        .to({}, { duration: 0.2 });
    });

    // Statement: words light up as you read
    var stText = $('[data-highlight]');
    if (stText) {
      var words = splitWords(stText, 'hl');
      gsap.to(words, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: stText, start: 'top 82%', end: 'bottom 50%', scrub: true }
      });
    }

    // Parallax inside arch frames
    $$('[data-parallax] img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -14 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Services: panels rise in 3D, the faint title drifts with the scroll
    if ($('.panels')) gsap.fromTo('.panel',
      { rotationX: 38, y: 140, opacity: 0, transformPerspective: 1400, transformOrigin: '50% 100%' },
      { rotationX: 0, y: 0, opacity: 1, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: '.panels', start: 'top 98%', end: 'top 45%', scrub: 1 } });

    $$('.ghost').forEach(function (g) {
      gsap.fromTo(g, { xPercent: 6 }, {
        xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: g.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    // Projects: cards stack; each earlier card leans back, shrinks and dims as the next one lands on it
    var sCards = $$('.stack-card');
    sCards.forEach(function (card, i) {
      var img = $('img', card);
      gsap.fromTo(img, { scale: 1.18 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 30%', scrub: true }
      });
      var next = sCards[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.9, rotationX: -7, '--dim': 0.45, transformPerspective: 1600, transformOrigin: '50% 0%', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true }
      });
    });

    // Finish detail: the arch opens like a door, the numbered points come forward
    var door = $('.arch-tall');
    if (door) {
      var dPins = $$('.pin', door);
      gsap.set(dPins, { x: 0, y: 0, xPercent: -50, yPercent: -50 });
      var dtl = gsap.timeline({ scrollTrigger: { trigger: '.detail', start: 'top 80%', end: 'center 55%', scrub: 1 } });
      dtl.fromTo(door,
          { clipPath: 'inset(0% 44% 0% 44% round 999px 999px 0px 0px)', rotationY: -28, transformPerspective: 1400 },
          { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)', rotationY: 0, duration: 1, ease: 'power2.inOut' }, 0)
        .fromTo(dPins, { scale: 0, z: -300, opacity: 0 }, { scale: 1, z: 0, opacity: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(2)' }, 0.7);
    }

    // Gallery: photos rise into place in small groups as they come into view
    if ($('.g-item')) {
      gsap.set('.g-item', { opacity: 0, y: 50 });
      ScrollTrigger.batch('.g-item', {
        start: 'top 94%',
        onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true }); }
      });
    }

    // About: values list, a photo follows the pointer over each row
    var vList = $('.vrow-list'), vFloat = $('.vrow-float');
    if (vList && vFloat && window.matchMedia('(hover: hover)').matches) {
      var vImg = $('img', vFloat), host = vList.parentNode;
      var fx = gsap.quickTo(vFloat, 'x', { duration: 0.6, ease: 'power3.out' });
      var fy = gsap.quickTo(vFloat, 'y', { duration: 0.6, ease: 'power3.out' });
      gsap.set(vFloat, { scale: 0, opacity: 0 });
      vList.addEventListener('pointermove', function (e) {
        var r = host.getBoundingClientRect();
        fx(e.clientX - r.left - vFloat.offsetWidth / 2);
        fy(e.clientY - r.top - vFloat.offsetHeight / 2);
      });
      $$('.vrow', vList).forEach(function (row) {
        row.addEventListener('pointerenter', function () {
          if (vImg.getAttribute('src') !== row.dataset.img) vImg.src = row.dataset.img;
          gsap.to(vFloat, { scale: 1, opacity: 1, rotation: (Math.random() * 8 - 4), duration: 0.5, ease: 'expo.out' });
        });
      });
      vList.addEventListener('pointerleave', function () { gsap.to(vFloat, { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }); });
    }

    // About: founder photo drifts inside its frame
    if ($('.ab2-ceo-media img')) {
      gsap.fromTo('.ab2-ceo-media img', { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '.ab2-ceo', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // About: mosaic photos tip up
    $$('.ab2-mosaic a').forEach(function (a, i) {
      gsap.fromTo(a, { rotationX: 24, y: 100, opacity: 0.3, transformPerspective: 1400, transformOrigin: '50% 100%' },
        { rotationX: 0, y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: a, start: 'top 98%', end: 'top 55%', scrub: 1 } });
    });

    // About: the photo frames float in, then drift at different speeds as you scroll
    var frames = $$('.ab-frame');
    if (frames.length) {
      gsap.from(frames, { y: 90, opacity: 0, scale: 0.92, duration: 1.4, ease: 'expo.out', stagger: 0.09, delay: 0.3 });
      frames.forEach(function (f) {
        var sp = parseFloat(f.dataset.speed || '1');
        gsap.to(f, { yPercent: -18 * sp, ease: 'none',
          scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: true } });
      });
    }

    // About: founder's signature writes itself
    if ($('.ab-ceo .sig path')) {
      gsap.to('.ab-ceo .sig path', { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut',
        scrollTrigger: { trigger: '.ab-ceo-sign', start: 'top 85%', once: true } });
    }

    // About: values band, the photo settles as it passes
    if ($('.ab-band')) {
      gsap.fromTo('.ab-band img', { scale: 1.25 }, { scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.ab-band', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    // About: numbers rise into view and count up (ranges count both ends)
    $$('.count').forEach(function (el, i) {
      var range = el.dataset.range ? el.dataset.range.split(',').map(Number) : null;
      var to = parseFloat(el.dataset.to), suf = el.dataset.suffix || '', o = { v: 0 };
      var render = function () {
        if (range) el.innerHTML = Math.round(o.v * range[0]) + '<span class="dash" aria-hidden="true"></span>' + Math.round(o.v * range[1]);
        else el.textContent = Math.round(o.v * to) + suf;
      };
      render();
      var wrap = el.closest('.ab3-in');
      var item = el.closest('.ab3-item');
      var label = item ? $('p', item) : null;
      if (wrap) gsap.set(wrap, { yPercent: 110 });
      if (label) gsap.set(label, { opacity: 0, y: 16 });
      var delay = item ? (Array.prototype.indexOf.call(item.parentNode.children, item) * 0.12) : 0;
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () {
        if (wrap) gsap.to(wrap, { yPercent: 0, duration: 1.3, ease: 'expo.out', delay: delay });
        if (label) gsap.to(label, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: delay + 0.25 });
        gsap.to(o, { v: 1, duration: 2, ease: 'power3.out', delay: delay, onUpdate: render });
      } });
    });

    // Process: the picture tips up from the floor as the section arrives
    $$('.hw-stage').forEach(function (st) {
      gsap.fromTo(st, { rotateX: 14, scale: .9, opacity: .4 }, { rotateX: 0, scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: st, start: 'top 95%', end: 'top 35%', scrub: true } });
    });
    $$('.hw-list').forEach(function (l) {
      gsap.from($$('.hw-row', l), { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .08,
        scrollTrigger: { trigger: l, start: 'top 85%', once: true } });
    });

    // Services: the background photo settles as the section passes
    $$('.svc-bg img').forEach(function (img) {
      gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    $$('.svc-notch').forEach(function (n) {
      gsap.fromTo(n, { yPercent: -101 }, { yPercent: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: n.closest('section'), start: 'top 70%', once: true } });
    });

    // Outro: a centred headline over an arched doorway; the doorway opens to fill the screen
    mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, function (ctx) {
      if (!$('.outro')) return;
      var from = ctx.conditions.desk
        ? 'inset(44% 34% 0% 34% round 16vw 16vw 0vw 0vw)'
        : 'inset(46% 12% 0% 12% round 38vw 38vw 0vw 0vw)';
      var otl = gsap.timeline({ scrollTrigger: { trigger: '.outro', start: 'top top', end: 'bottom bottom', scrub: 1 } });
      otl.fromTo('.outro-media', { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)', duration: 1, ease: 'power2.inOut' }, 0)
        .fromTo('.outro-media img', { scale: 1.25 }, { scale: 1, duration: 1, ease: 'power2.inOut' }, 0)
        .to('.outro-head', { yPercent: -50, opacity: 0, duration: 0.42, ease: 'power1.in' }, 0.04)
        .to('.outro-shade', { opacity: 1, duration: 0.42 }, 0.55)
        .fromTo('.outro-center', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.3 }, 0.68)
        .to({}, { duration: 0.12 });
    });

    // Footer wordmark: letters flip up
    var mark = $('.footer-mark');
    if (mark) {
      splitChars(mark);
      var mChars = $$('.char-unit', mark);
      mChars.forEach(function (c) { c.style.transition = 'none'; c.style.filter = 'none'; c.style.display = 'inline-block'; });
      gsap.fromTo(mChars, { rotationX: -95, yPercent: 30, opacity: 0, transformOrigin: '50% 100%' }, {
        rotationX: 0, yPercent: 0, opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom bottom', scrub: true }
      });
    }

    // Inner page hero: the wide photo opens from an arch to the full width
    mm.add({ desk: '(min-width: 901px)', mob: '(max-width: 900px)' }, function (ctx) {
      var media = $('.page-media');
      if (!media) return;
      var from = ctx.conditions.desk
        ? 'inset(0% 30% 0% 30% round 18vw 18vw 0vw 0vw)'
        : 'inset(0% 12% 0% 12% round 38vw 38vw 0vw 0vw)';
      gsap.fromTo(media,
        { clipPath: from, rotationX: 14, transformPerspective: 1600, transformOrigin: '50% 100%' },
        { clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)', rotationX: 0, ease: 'none',
          scrollTrigger: { trigger: media, start: 'top 92%', end: 'top 12%', scrub: 1 } });
      gsap.fromTo($('img', media), { scale: 1.3 }, { scale: 1, ease: 'none',
        scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Before / after: the viewer tips up in 3D, then the line sweeps once to show it moves
    $$('[data-ba]').forEach(function (viewer) {
      if (viewer.closest('.ba-x')) {
        gsap.fromTo(viewer, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
          scrollTrigger: { trigger: viewer, start: 'top 92%', end: 'top 45%', scrub: 1 } });
        gsap.fromTo($$('.ba-img', viewer), { scale: 1.2 }, { scale: 1, ease: 'none',
          scrollTrigger: { trigger: viewer, start: 'top 95%', end: 'top 30%', scrub: 1 } });
      } else
      gsap.fromTo(viewer,
        { rotationX: 26, scale: 0.86, y: 80, transformPerspective: 1600, transformOrigin: '50% 100%' },
        { rotationX: 0, scale: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: viewer, start: 'top 98%', end: 'top 40%', scrub: 1 } });
      ScrollTrigger.create({
        trigger: viewer, start: 'top 55%', once: true,
        onEnter: function () {
          if (viewer._touched) return;
          var o = { v: 85 };
          gsap.to(o, { v: 50, duration: 1.6, ease: 'power3.inOut', onUpdate: function () { viewer._setPos(o.v); } });
        }
      });
    });

    // About: the sketch turns into the finished room as you scroll
    mm.add('(min-width: 901px)', function () {
      var story = $('.story');
      if (!story) return;
      var steps = $$('.story-step', story);
      var tl = gsap.timeline({ scrollTrigger: { trigger: story, start: 'top top', end: '+=220%', pin: true, scrub: 1, anticipatePin: 1 } });
      tl.fromTo('.story-photo', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, 0.25)
        .fromTo('.story-frame', { rotationY: -18, scale: 0.9, transformPerspective: 1600 }, { rotationY: 0, scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to('.story-frame', { scale: 1.04, duration: 0.5, ease: 'none' }, 1.25)
        .to('.story-bar span', { scaleX: 1, duration: 1.75, ease: 'none' }, 0);
      steps.forEach(function (s, i) {
        if (i > 0) tl.fromTo(s, { opacity: 0, y: 40, rotationX: -40 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.2 }, i * 0.6);
        if (i < steps.length - 1) tl.to(s, { opacity: 0, y: -40, rotationX: 40, duration: 0.2 }, i * 0.6 + 0.45);
      });
      return function () { gsap.set(steps, { clearProps: 'all' }); };
    });

    // Services page: each photo swings in from its side
    $$('.sd-row').forEach(function (row, i) {
      var m = $('.sd-media', row);
      var side = i % 2 ? -1 : 1;
      gsap.fromTo(m,
        { rotationY: 30 * side, x: 80 * side, scale: 0.88, opacity: 0.3, transformPerspective: 1500 },
        { rotationY: 0, x: 0, scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top 95%', end: 'top 40%', scrub: 1 } });
      gsap.fromTo($('img', m), { scale: 1.2 }, { scale: 1, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Contact: the frame draws itself, the form unfolds, the phone number rolls ---------- */
  $$('.cf').forEach(function (card) {
    var NS = 'http://www.w3.org/2000/svg';
    var bg = document.createElement('div'); bg.className = 'cf-bg';
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'cf-lines'); svg.setAttribute('aria-hidden', 'true');
    var outer = document.createElementNS(NS, 'polygon'), inner = document.createElementNS(NS, 'polygon');
    svg.appendChild(outer); svg.appendChild(inner);
    card.insertBefore(svg, card.firstChild); card.insertBefore(bg, card.firstChild);
    var shape = function (x, y, w, h, c) {
      return [[x + c, y], [x + w - c, y], [x + w, y + c], [x + w, y + h - c], [x + w - c, y + h], [x + c, y + h], [x, y + h - c], [x, y + c]].map(function (p) { return p.join(','); }).join(' ');
    };
    var lens = [0, 0];
    var draw = function () {
      var w = card.offsetWidth, h = card.offsetHeight;
      var cut = parseFloat(getComputedStyle(card).getPropertyValue('--cut')) || 34;
      var gap = w < 600 ? 9 : 13;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      outer.setAttribute('points', shape(1, 1, w - 2, h - 2, cut - .6));
      inner.setAttribute('points', shape(gap, gap, w - gap * 2, h - gap * 2, cut - gap * .6));
      lens = [outer.getTotalLength ? outer.getTotalLength() : 4000, inner.getTotalLength ? inner.getTotalLength() : 4000];
    };
    draw();
    window.addEventListener('resize', draw);
    if (reduce || !window.gsap || !window.ScrollTrigger) return;

    var form = $('.cf-form', card);
    var fields = $$('.cf-title, .bf', form);
    var btn = $('.cf-submit', form), fine = $('.cf-fine', form);
    [outer, inner].forEach(function (pl, i) { pl.style.strokeDasharray = lens[i]; pl.style.strokeDashoffset = lens[i]; });
    gsap.set(bg, { clipPath: 'inset(50% 50% 50% 50%)' });
    gsap.set(fields, { clipPath: 'inset(0 0 0 100%)', y: 10 });
    gsap.set(btn, { opacity: 0, scaleX: 0.08, transformOrigin: '100% 50%' });
    gsap.set(fine, { opacity: 0, y: 10 });

    var tl = gsap.timeline({ paused: true });
    tl.to(outer, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to(inner, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.18)
      .to(bg, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0.35)
      .to(fields, { clipPath: 'inset(0 0 0 0%)', y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09 }, 1.0)
      .to(btn, { opacity: 1, duration: 0.2 }, 1.45)
      .to(btn, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 1.5)
      .to(fine, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 2.1)
      .add(function () { gsap.set(fields, { clearProps: 'clipPath,transform' }); gsap.set(btn, { clearProps: 'transform' }); }, 2.6);
    ScrollTrigger.create({ trigger: card, start: 'top 80%', once: true, onEnter: function () { whenIntroOpen(function () { draw(); tl.play(); }); } });
  });

  $$('.ct4-phone-num, .roll-num').forEach(function (el) {
    var final = el.textContent.trim();
    el.closest('a').setAttribute('aria-label', 'התקשרו ' + final);
    if (reduce || !window.ScrollTrigger) return;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = final.split('').map(function (ch) { return /\d/.test(ch) ? '<span class="dg">' + ch + '</span>' : ch; }).join('');
    var digits = $$('.dg', el);
    var roll = function () {
      var start = performance.now();
      var tick = function (now) {
        var t = now - start, done = true;
        digits.forEach(function (d, i) {
          var settle = 500 + i * 90;
          if (t < settle) { d.textContent = Math.floor(Math.random() * 10); done = false; }
          else d.textContent = final.replace(/\D/g, '')[i];
        });
        if (!done) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { whenIntroOpen(roll); } });
    el.closest('a').addEventListener('mouseenter', roll);
  });

  /* ---------- Contact over a photograph: the photo settles, the notch drops, the lines draw ---------- */
  $$('.ct6').forEach(function (sec) {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    var img = $('.ct6-bg img', sec), notch = $('.ct6-notch', sec);
    var titleParts = $$('.ct6-title span, .ct6-sub', sec);
    var fields = $$('.ct6-form .bf', sec), fine = $('.ct6-fine', sec), btn = $('.ct6-submit', sec);
    var brand = $('.ct6-brand', sec), lines = $$('.ct6-contact li', sec);
    gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.set(notch, { yPercent: -101 });
    gsap.set(titleParts, { yPercent: 60, opacity: 0 });
    gsap.set(fields, { clipPath: 'inset(0 0 0 100%)' });
    gsap.set([fine], { opacity: 0 });
    gsap.set(btn, { scaleX: 0, transformOrigin: '100% 50%' });
    if (brand) gsap.set(brand, { opacity: 0, x: 40 });
    gsap.set(lines, { opacity: 0, y: 20 });
    var tl = gsap.timeline({ paused: true });
    tl.to(notch, { yPercent: 0, duration: 1, ease: 'expo.out' }, 0)
      .to(titleParts, { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.12 }, 0.15)
      .to(fields, { clipPath: 'inset(0 0 0 0%)', duration: 1.1, ease: 'expo.inOut', stagger: 0.1 }, 0.45)
      .to(fine, { opacity: 1, duration: 0.6 }, 1.1)
      .to(btn, { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 1.0)
      .to(brand || {}, { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out' }, 0.3)
      .to(lines, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.8)
      .add(function () { gsap.set(fields, { clearProps: 'clipPath' }); gsap.set(btn, { clearProps: 'transform' }); });
    ScrollTrigger.create({ trigger: sec, start: 'top 65%', once: true, onEnter: function () { whenIntroOpen(function () { tl.play(); }); } });
  });

  /* ---------- Header state ---------- */
  // Process: one open step at a time; its picture wipes up over the last one
  $$('.hw-grid').forEach(function (grid) {
    var rows = $$('.hw-row', grid), frames = $$('.hw-frame', grid), count = $('.hw-count b', grid);
    var hoverOk = window.matchMedia('(hover: hover) and (min-width: 901px)');
    var cur = 0;
    var open = function (i) {
      if (i === cur) return;
      frames.forEach(function (f) { f.classList.remove('was-active'); });
      frames[cur].classList.add('was-active');
      frames[cur].classList.remove('is-active');
      rows[cur].classList.remove('is-active');
      $('.hw-btn', rows[cur]).setAttribute('aria-expanded', 'false');
      cur = i;
      frames[i].classList.add('is-active');
      rows[i].classList.add('is-active');
      $('.hw-btn', rows[i]).setAttribute('aria-expanded', 'true');
      if (count) count.textContent = '0' + (i + 1);
    };
    rows.forEach(function (row, i) {
      var btn = $('.hw-btn', row);
      btn.addEventListener('click', function () { open(i); });
      btn.addEventListener('mouseenter', function () { if (hoverOk.matches) open(i); });
    });
  });

  var darkSections = $$('.services, .contact, .ct5, .ct6, .ba-x, .site-footer, .story, .cta-band, .ab-hero, .ab-stats, .ab3-stats, .ab2-hero, .ab2-ceo');
  var outroEl = $('.outro');
  var lastY = window.scrollY;
  function syncHeader() {
    if (!darkSections) return;
    var y = window.scrollY;
    var heroEnd = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight : 0;
    var probe = 30;
    var overDark = darkSections.some(function (s) {
      var r = s.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    if (outroEl) {
      var orc = outroEl.getBoundingClientRect();
      if (orc.top < -window.innerHeight * 0.55 && orc.bottom > probe) overDark = true;
    }
    var inHero = y < heroEnd + 10;
    var topInner = !hero && y < 30 && !overDark;
    header.classList.toggle('is-dark', (inHero && heroProgress > 0.22 && !overDark) || topInner);
    header.classList.toggle('is-solid', !inHero && !overDark && !topInner);
    header.classList.toggle('on-dark', !inHero && overDark);
    lastY = y;
  }
  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('resize', syncHeader);
  syncHeader();

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var nav = $('.nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    if (lenis) { open ? lenis.stop() : lenis.start(); }
    header.classList.remove('is-hidden');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); } });
  }

  /* ---------- Projects gallery + lightbox ---------- */
  var lb = $('#lightbox');
  if (lb) {
    var gItems = $$('.g-item'), gBtns = $$('.gf-btn'), gGrid = $('.g-grid'), gEmpty = $('.g-empty');
    var lbImg = $('.lb-img', lb), lbTitle = $('.lb-title', lb), lbDesc = $('.lb-desc', lb);
    var lbCat = $('.lb-cat', lb), lbCount = $('.lb-count', lb), lbThumbs = $('.lb-thumbs', lb);
    var lbList = [], lbCur = 0, lbLast = null;
    var refresh = function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); };
    var visibleItems = function () { return gItems.filter(function (it) { return !it.hidden; }); };

    gBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filter;
        gBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        gItems.forEach(function (it) { it.hidden = !(f === 'all' || it.dataset.cat === f); });
        if (gEmpty) gEmpty.hidden = visibleItems().length > 0;
        if (gGrid) gGrid.classList.remove('is-preview');
        var cnt = $('.g-count');
        if (cnt) {
          var target = visibleItems().length, o = { v: parseInt(cnt.textContent, 10) || 0 };
          if (window.gsap && !reduce) gsap.to(o, { v: target, duration: 0.8, ease: 'power3.out', onUpdate: function () { cnt.textContent = ('0' + Math.round(o.v)).slice(-2); } });
          else cnt.textContent = ('0' + target).slice(-2);
        }
        if (window.gsap && !reduce) gsap.fromTo(visibleItems(), { clipPath: 'inset(100% 0% 0% 0%)', y: 30 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, clearProps: 'clipPath' });
        refresh();
        var gal = $('.gallery');
        if (gal && gal.getBoundingClientRect().top < 0) {
          var off = -(header ? header.offsetHeight : 0);
          if (lenis) lenis.scrollTo(gal, { offset: off, duration: 1 });
          else window.scrollTo({ top: gal.getBoundingClientRect().top + window.scrollY + off, behavior: reduce ? 'auto' : 'smooth' });
        }
      });
    });
    // Side menu: hovering a filter previews it on the grid
    var canHover = window.matchMedia('(hover: hover) and (min-width: 901px)');
    gBtns.forEach(function (b) {
      b.addEventListener('mouseenter', function () {
        if (!canHover.matches || !gGrid || b.getAttribute('aria-pressed') === 'true' || b.dataset.filter === 'all') return;
        gItems.forEach(function (it) { it.classList.toggle('is-match', it.dataset.cat === b.dataset.filter); });
        gGrid.classList.add('is-preview');
      });
      b.addEventListener('mouseleave', function () { if (gGrid) gGrid.classList.remove('is-preview'); });
    });
    $$('.gv-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.gv-btn').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        gGrid.dataset.cols = b.dataset.cols;
        refresh();
      });
    });

    var lbShow = function (i) {
      lbCur = (i + lbList.length) % lbList.length;
      var img = $('img', lbList[lbCur]);
      lbImg.classList.add('is-swapping');
      setTimeout(function () { lbImg.src = img.src; lbImg.alt = img.alt; lbImg.classList.remove('is-swapping'); }, 180);
      lbTitle.textContent = img.alt;
      lbDesc.textContent = img.dataset.desc || '';
      lbCat.textContent = img.dataset.catName || '';
      lbCount.textContent = (lbCur + 1) + ' / ' + lbList.length;
      var thumbs = $$('button', lbThumbs);
      thumbs.forEach(function (t, k) { t.setAttribute('aria-current', String(k === lbCur)); });
      if (thumbs[lbCur]) thumbs[lbCur].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    };
    var lbOpen = function (item) {
      lbList = visibleItems();
      lbThumbs.innerHTML = '';
      lbList.forEach(function (it, k) {
        var im = $('img', it);
        var t = document.createElement('button');
        t.type = 'button'; t.className = 'lb-thumb'; t.setAttribute('aria-label', im.alt);
        t.innerHTML = '<img src="' + im.getAttribute('src') + '" alt="">';
        t.addEventListener('click', function () { lbShow(k); });
        lbThumbs.appendChild(t);
      });
      lbLast = document.activeElement;
      lb.hidden = false;
      document.body.classList.add('lb-open');
      if (lenis) lenis.stop();
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      lbShow(lbList.indexOf(item));
      $('.lb-close', lb).focus();
    };
    var lbClose = function () {
      lb.classList.remove('is-open');
      document.body.classList.remove('lb-open');
      if (lenis) lenis.start();
      setTimeout(function () { lb.hidden = true; }, 350);
      if (lbLast) lbLast.focus();
    };

    $$('.g-open').forEach(function (b) { b.addEventListener('click', function () { lbOpen(b.closest('.g-item')); }); });
    $('.lb-close', lb).addEventListener('click', lbClose);
    $('.lb-next', lb).addEventListener('click', function () { lbShow(lbCur + 1); });
    $('.lb-prev', lb).addEventListener('click', function () { lbShow(lbCur - 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-main') || e.target.classList.contains('lb-stage')) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbShow(lbCur + 1);
      else if (e.key === 'ArrowRight') lbShow(lbCur - 1);
      else if (e.key === 'Tab') {
        var f = $$('button', lb).filter(function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    // Swipe on touch screens (RTL: swiping to the right brings the next picture)
    var sx = null;
    $('.lb-main', lb).addEventListener('pointerdown', function (e) { sx = e.clientX; });
    $('.lb-main', lb).addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) lbShow(lbCur + (dx > 0 ? 1 : -1));
    });
  }

  /* ---------- Before / after viewer ---------- */
  $$('[data-ba]').forEach(function (viewer) {
    var range = $('.ba-range', viewer);
    var section = viewer.closest('.ba');
    function setPos(v) {
      v = Math.max(0, Math.min(100, v));
      viewer.style.setProperty('--pos', v + '%');
      if (range) range.value = Math.round(v);
    }
    viewer._setPos = setPos;
    var dragging = false;
    function fromEvent(e) {
      var r = viewer.getBoundingClientRect();
      setPos((e.clientX - r.left) / r.width * 100);
    }
    viewer.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      dragging = true; viewer._touched = true;
      viewer.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    viewer.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    viewer.addEventListener('pointerup', function () { dragging = false; });
    viewer.addEventListener('pointercancel', function () { dragging = false; });
    if (range) range.addEventListener('input', function () { viewer._touched = true; setPos(+range.value); });

    // Switching between projects
    if (!section) return;
    var thumbs = $$('.ba-thumb', section);
    var after = $('.ba-after', viewer), before = $('.ba-before img', viewer);
    var title = $('.ba-title', section), num = $('.ba-num', section);
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        thumbs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
        viewer.classList.add('is-switching');
        setTimeout(function () {
          after.src = t.dataset.after; after.alt = t.dataset.altAfter;
          before.src = t.dataset.before; before.alt = t.dataset.altBefore;
          if (title) title.textContent = t.dataset.title;
          if (num) num.textContent = ('0' + (i + 1)).slice(-2);
          setPos(50);
          viewer.classList.remove('is-switching');
        }, 350);
      });
    });
  });

  // Projects page: arrows step through the before/after projects
  $$('.ba-x').forEach(function (sec) {
    var tabs = $$('.bx-tab', sec);
    var step = function (d) {
      var cur = tabs.findIndex(function (t) { return t.getAttribute('aria-pressed') === 'true'; });
      var next = tabs[(cur + d + tabs.length) % tabs.length];
      next.click();
      next.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    };
    var prev = $('.bx-prev', sec), nxt = $('.bx-next', sec);
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (nxt) nxt.addEventListener('click', function () { step(1); });
  });

  /* ---------- Service panels ---------- */
  var panels = $$('.panel');
  function openPanel(p) {
    panels.forEach(function (x) {
      var on = x === p;
      x.classList.toggle('is-active', on);
      x.setAttribute('aria-expanded', String(on));
    });
  }
  var wide = window.matchMedia('(hover: hover) and (min-width: 901px)');
  panels.forEach(function (p) {
    p.addEventListener('mouseenter', function () { if (wide.matches) openPanel(p); });
    p.addEventListener('click', function (e) { if (!e.target.closest('a')) openPanel(p); });
    p.addEventListener('focus', function () { openPanel(p); });
    var img = $('img', p);
    p.addEventListener('pointermove', function (e) {
      if (!wide.matches || !p.classList.contains('is-active')) return;
      var r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      p.style.setProperty('--mx', (x * 100) + '%'); p.style.setProperty('--my', (y * 100) + '%');
      if (img && !reduce) img.style.translate = ((x - .5) * -18) + 'px ' + ((y - .5) * -12) + 'px';
    });
    p.addEventListener('pointerleave', function () { if (img) img.style.translate = '0 0'; });
    p.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(p); }
    });
  });

  /* ---------- Finish-detail pins <-> list ---------- */
  var pins = $$('.pin');
  var items = $$('.detail-item');
  var list = $('.detail-list');
  function activate(id) {
    pins.forEach(function (p) { p.classList.toggle('is-active', p.dataset.pin === id); });
    items.forEach(function (i) { i.classList.toggle('is-active', i.dataset.item === id); });
    if (list) list.classList.toggle('has-active', !!id);
  }
  pins.forEach(function (p) {
    p.addEventListener('mouseenter', function () { activate(p.dataset.pin); });
    p.addEventListener('focus', function () { activate(p.dataset.pin); });
    p.addEventListener('click', function () { activate(p.classList.contains('is-active') ? null : p.dataset.pin); });
    p.addEventListener('mouseleave', function () { activate(null); });
    p.addEventListener('blur', function () { activate(null); });
  });
  items.forEach(function (i) {
    i.addEventListener('mouseenter', function () { activate(i.dataset.item); });
    i.addEventListener('mouseleave', function () { activate(null); });
  });

  /* ---------- Contact form -> WhatsApp ---------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      function check(input, valid) {
        var err = document.getElementById(input.id + '-error');
        input.closest('.field, .bf').classList.toggle('has-error', !valid);
        input.setAttribute('aria-invalid', String(!valid));
        if (err) err.hidden = valid;
        if (!valid && ok) { input.focus(); ok = false; }
      }
      var name = form.elements.name, phone = form.elements.phone;
      check(name, name.value.trim().length > 1);
      var digits = phone.value.replace(/\D/g, '');
      check(phone, digits.length >= 9 && digits.length <= 12);
      if (!ok) return;
      var lines = [
        'שלום, אשמח לקבל הצעת מחיר לשיפוץ.',
        'שם: ' + name.value.trim(),
        'טלפון: ' + phone.value.trim(),
        'סוג העבודה: ' + (form.elements.type.value || 'לא צוין')
      ];
      var city = form.elements.city ? form.elements.city.value.trim() : '';
      if (city) lines.splice(3, 0, 'עיר: ' + city);
      var notes = form.elements.notes.value.trim();
      if (notes) lines.push('פרטים: ' + notes);
      window.open('https://wa.me/972548438856?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      $('#formNote').textContent = 'הפרטים הועברו לוואטסאפ, נשאר רק ללחוץ "שליחה" שם.';
    });
  }
})();
