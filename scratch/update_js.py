with open('assets/js/cinematic-animations.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_measure = """      function measureSection() {
        // Horizontal distance needed to comfortably reveal all 10 cards
        scrollDistance = Math.max(1, track.scrollWidth - window.innerWidth + window.innerWidth * 0.14);

        // Calibrated vertical scroll distance:
        // 1. Initial settling pause (Card 01 appreciation window): ~85vh
        // 2. Gradual unhurried horizontal cruise: ~1.25 * scrollDistance
        // 3. Final card exit settle window: ~65vh
        const pauseInHeight = window.innerHeight * 0.85;
        const cruiseHeight = scrollDistance * 1.25;
        const pauseOutHeight = window.innerHeight * 0.65;
        totalScrollHeight = window.innerHeight + pauseInHeight + cruiseHeight + pauseOutHeight;

        wrapper.style.setProperty("--work-scroll-height", totalScrollHeight + "px");
      }"""

new_measure = """      function measureSection() {
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
      }"""

old_tl = """      // Master Scrubbed Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "services-horizontal-scroll",
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
          refreshPriority: -100,
          onRefreshInit: measureSection
        }
      });

      // PHASE 1: Card 01 Settling & Reading Pause
      // The section is pinned, completely stable. Nothing moves horizontally.
      // Gives the user ample scroll distance to read the title and Card 01.
      tl.to({}, { duration: 1.2 });

      // PHASE 2: Smooth, Gradual Horizontal Progression
      // Translates the track smoothly from right to left across all 10 cards.
      // power1.inOut ensures a gentle acceleration away from Card 01 and gentle arrival into Card 10.
      const horizontalTween = tl.to(track, {
        x: function () {
          measureSection();
          return scrollDistance;
        },
        duration: 6.0,
        ease: "power1.inOut"
      });

      // PHASE 3: Card 10 Final Viewing Window
      // Card 10 rests in place before page unpins and resumes vertical scroll.
      tl.to({}, { duration: 0.8 });"""

new_tl = """      // Master Scrubbed Timeline
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
      tl.to({}, { duration: 0.35 });"""

# Normalize
def norm(s):
    return s.replace('\r\n', '\n')

js_norm = norm(js)
old_measure_norm = norm(old_measure)
new_measure_norm = norm(new_measure)
old_tl_norm = norm(old_tl)
new_tl_norm = norm(new_tl)

assert old_measure_norm in js_norm, "old_measure not found in js"
assert old_tl_norm in js_norm, "old_tl not found in js"

js_norm = js_norm.replace(old_measure_norm, new_measure_norm)
js_norm = js_norm.replace(old_tl_norm, new_tl_norm)

with open('assets/js/cinematic-animations.js', 'w', encoding='utf-8') as f:
    f.write(js_norm)

print("cinematic-animations.js updated successfully!")
