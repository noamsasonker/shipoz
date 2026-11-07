/**
 * ארזים שיפוצים ועבודות גמר — Cinematic Scroll & Reveal Engine
 * Inspired by Chupac Architecture (chupac.co.il)
 * 
 * Features:
 * - Viewport-triggered animations (independent playback)
 * - Exact Chupac "תהליכי עבודה" Pinned Horizontal Scrolling with GSAP & ScrollTrigger
 * - Hebrew RTL typography letter-by-letter & word-by-word reveals
 * - Masked title unmasking
 * - Architectural image reveals (upward, vertical mask, scale, side, editorial)
 * - Coordinated sequential staggers for grids & process cards
 * - Automated cinematic Hero sequence on load
 * - Mobile GPU memory management & cleanup
 * - Failsafe fallback ensuring zero permanently hidden elements
 */

(function () {
  'use strict';

  // 1. Text Splitting for Hebrew Typography (Preserves RTL logical order & children like <br> and .hero-dot)
  function splitTextIntoChars(element) {
    if (element.dataset.splitDone === 'true') return;
    element.dataset.splitDone = 'true';

    let charIndex = 0;
    const childNodes = Array.from(element.childNodes);
    const fragment = document.createDocumentFragment();

    childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.nodeValue;
        if (!text) return;

        // Split by whitespace keeping word groupings
        const tokens = text.match(/\S+|\s+/g) || [];
        tokens.forEach(token => {
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(' '));
            return;
          }

          const wordSpan = document.createElement('span');
          wordSpan.className = 'word-unit';
          wordSpan.setAttribute('dir', 'rtl');

          // Split unicode graphemes safely for Hebrew
          const chars = (typeof Intl !== 'undefined' && Intl.Segmenter)
            ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(token), s => s.segment)
            : Array.from(token);

          chars.forEach(ch => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char-unit';
            charSpan.style.setProperty('--char-index', charIndex++);
            charSpan.textContent = ch;
            wordSpan.appendChild(charSpan);
          });

          fragment.appendChild(wordSpan);
        });
      } else {
        // Preserve elements like <br> or <span class="hero-dot"></span>
        fragment.appendChild(child.cloneNode(true));
      }
    });

    element.innerHTML = '';
    element.appendChild(fragment);
  }

  function splitTextIntoWords(element) {
    if (element.dataset.splitDone === 'true') return;
    element.dataset.splitDone = 'true';

    let wordIndex = 0;
    const childNodes = Array.from(element.childNodes);
    const fragment = document.createDocumentFragment();

    childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.nodeValue;
        if (!text) return;

        const tokens = text.match(/\S+|\s+/g) || [];
        tokens.forEach(token => {
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(' '));
            return;
          }

          const wordSpan = document.createElement('span');
          wordSpan.className = 'word-unit';
          wordSpan.style.setProperty('--word-index', wordIndex++);
          wordSpan.textContent = token;
          fragment.appendChild(wordSpan);
        });
      } else {
        fragment.appendChild(child.cloneNode(true));
      }
    });

    element.innerHTML = '';
    element.appendChild(fragment);
  }

  function wrapInMask(element) {
    if (element.dataset.maskDone === 'true') return;
    element.dataset.maskDone = 'true';

    const inner = document.createElement('span');
    inner.className = 'mask-inner';
    while (element.firstChild) {
      inner.appendChild(element.firstChild);
    }
    element.appendChild(inner);
  }

  // 2. Setup Stagger Container Indices
  function setupStaggerIndices() {
    document.querySelectorAll('.stagger-container').forEach(container => {
      const items = container.querySelectorAll('.stagger-item');
      items.forEach((item, index) => {
        item.style.setProperty('--stagger-i', index);
      });
    });
  }

  // 3. Initialize Viewport Intersection Observer for standard sections
  function initObserver() {
    const selector = [
      '.hero-wrapper',
      '.about-section',
      '#services.otef',
      '.hotspot-section',
      '.gallery-section',
      '.process-section',
      '.why-section',
      '.trust-section',
      '.faq-section',
      '.articles-section',
      '.contact-section',
      '.site-footer',
      '.text-reveal-chars',
      '.text-reveal-words',
      '.text-reveal-mask',
      '.heading-entrance',
      '.badge-reveal',
      '.img-reveal-up',
      '.img-reveal-vmask',
      '.img-reveal-scale',
      '.img-reveal-side',
      '.img-reveal-editorial',
      '.stagger-container'
    ].join(',');

    const targets = document.querySelectorAll(selector);

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('is-revealed');
          
          // Unobserve immediately: animation plays independently until completion
          obs.unobserve(target);

          // Performance cleanup: release GPU memory after animation finishes
          setTimeout(() => {
            target.style.willChange = 'auto';
            target.querySelectorAll('.char-unit, .word-unit, img').forEach(el => {
              el.style.willChange = 'auto';
            });
          }, 1800);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(el => observer.observe(el));
  }

  // 4. Automated Hero Sequence on Page Load (Independent, no scroll required)
  function triggerHeroSequence() {
    const hero = document.getElementById('hero');
    if (hero) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          hero.classList.add('is-revealed');
        }, 120);
      });
    }
  }

  // 5. Exact Chupac Horizontal Scroll Replication for Services (#services.otef)
  function initWorkScroll() {
    const wrapper = document.querySelector("#services.otef");
    if (!wrapper) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      setTimeout(initWorkScroll, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const track = wrapper.querySelector(".my-container");
    const cards = wrapper.querySelectorAll(".my-sticky");
    if (!track || !cards.length) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", function () {
      let scrollDistance = 1;
      let totalScrollHeight = 1;

      function measureSection() {
        // Horizontal distance needed to comfortably reveal all 5 cards
        scrollDistance = Math.max(1, track.scrollWidth - window.innerWidth + window.innerWidth * 0.12);

        // Calibrated vertical scroll distance for 5 cards:
        // 1. Initial settling pause (short initial viewing phase): ~28vh
        // 2. Gradual unhurried horizontal cruise: ~1.15 * scrollDistance
        // 3. Final card exit settle window: ~28vh
        const pauseInHeight = window.innerHeight * 0.28;
        const cruiseHeight = scrollDistance * 1.15;
        const pauseOutHeight = window.innerHeight * 0.28;
        totalScrollHeight = window.innerHeight + pauseInHeight + cruiseHeight + pauseOutHeight;

        wrapper.style.setProperty("--work-scroll-height", totalScrollHeight + "px");
      }

      measureSection();

      // Card 01 starts resting at y: 0, completely stable and fully visible!
      // Cards 02..10 start slightly sunken (y: 45) and will rise as they enter view
      cards.forEach(function (card, index) {
        if (index === 0) {
          gsap.set(card, { y: 0, opacity: 1 });
        } else {
          gsap.set(card, { y: 45 });
        }
      });

      gsap.set(track, { x: 0, xPercent: 0 });

      // Master Scrubbed Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "services-horizontal-scroll",
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
          invalidateOnRefresh: true,
          refreshPriority: -100,
          onRefreshInit: measureSection
        }
      });

      // PHASE 1: Card 01 Settling & Short Viewing Pause
      // The section is pinned, completely stable. Nothing moves horizontally.
      // Gives the user a quick natural beat to register Card 01 without feeling stuck.
      tl.to({}, { duration: 0.35 });

      // PHASE 2: Smooth, Gradual Horizontal Progression
      // Translates the track smoothly from right to left across all 5 cards.
      // power1.inOut ensures a gentle acceleration away from Card 01 and gentle arrival into Card 05.
      const horizontalTween = tl.to(track, {
        x: function () {
          measureSection();
          return scrollDistance;
        },
        duration: 4.2,
        ease: "power1.inOut"
      });

      // PHASE 3: Card 05 Final Viewing Window
      // Card 05 rests in place briefly before page unpins and resumes natural vertical scroll.
      tl.to({}, { duration: 0.35 });

      // Staggered card rise for cards 02..10 as they glide across view
      const cardTweens = [];
      cards.forEach(function (card, index) {
        if (index > 0) {
          const cardTween = gsap.to(card, {
            y: 0,
            duration: 0.45,
            ease: "none",
            scrollTrigger: {
              id: "services-card-rise-" + index,
              trigger: card,
              containerAnimation: horizontalTween,
              start: "right 85%",
              end: "center center",
              scrub: true,
              invalidateOnRefresh: true
            }
          });
          cardTweens.push(cardTween);
        }
      });

      function handleResize() {
        measureSection();
        ScrollTrigger.refresh();
      }

      window.addEventListener("resize", handleResize, { passive: true });

      return function () {
        window.removeEventListener("resize", handleResize);
        cardTweens.forEach(t => t.kill());
        tl.kill();
        wrapper.style.removeProperty("--work-scroll-height");
        gsap.set(track, { clearProps: "all" });
        gsap.set(cards, { clearProps: "all" });
      };
    });
  }

  // 6. Initialize Everything
  function init() {
    // Process text splitting
    document.querySelectorAll('.text-reveal-chars').forEach(splitTextIntoChars);
    document.querySelectorAll('.text-reveal-words').forEach(splitTextIntoWords);
    document.querySelectorAll('.text-reveal-mask').forEach(wrapInMask);

    // Setup stagger container item indices
    setupStaggerIndices();

    // Setup viewport observer
    initObserver();

    // Trigger hero automated sequence
    triggerHeroSequence();

    // Initialize horizontal scroll for services
    initWorkScroll();

    // Global Safety Guard: Ensure no element stays hidden under any circumstance
    setTimeout(() => {
      document.querySelectorAll('.text-reveal-chars, .text-reveal-words, .text-reveal-mask, .heading-entrance, .badge-reveal, .stagger-item, .img-reveal-up, .img-reveal-vmask, .img-reveal-scale, .img-reveal-side, .img-reveal-editorial').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 150) {
          el.classList.add('is-revealed');
          const parent = el.closest('section, footer');
          if (parent) parent.classList.add('is-revealed');
        }
      });
    }, 2800);

    // Print event fallback
    window.addEventListener('beforeprint', () => {
      document.querySelectorAll('*').forEach(el => el.classList.add('is-revealed'));
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
