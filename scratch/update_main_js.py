with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

faq_js = """
  // 7. Pookubeh Accordion Interaction
  const faqItems = document.querySelectorAll('.pookubeh-faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    const body = item.querySelector('.faq-accordion-body');
    if (!trigger || !body) return;

    // Set initial heights
    if (item.classList.contains('is-open')) {
      body.style.maxHeight = body.scrollHeight + 'px';
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      body.style.maxHeight = '0px';
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      if (isOpen) {
        item.classList.remove('is-open');
        body.style.maxHeight = '0px';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Re-calculate open accordion heights on window resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('.pookubeh-faq-item.is-open .faq-accordion-body').forEach(body => {
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  });
});
"""

# Replace the final }); with our code
if '// 7. Pookubeh Accordion Interaction' not in js:
    last_brace_idx = js.rfind('});')
    if last_brace_idx != -1:
        js = js[:last_brace_idx] + faq_js
        with open('assets/js/main.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("Updated assets/js/main.js successfully!")
    else:
        print("Could not find closing }); in main.js")
else:
    print("FAQ interaction already present in main.js")
