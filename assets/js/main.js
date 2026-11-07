/**
 * ארזים - שיפוצים ועבודות גמר
 * Interactive Engine: Navigation, Hotspots, Filters, FAQ, Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuBtn.innerHTML = '&#9776;';
      });
    });
  }

  // 2. Interactive Hotspot Pins & Popups
  const pins = document.querySelectorAll('.hotspot-pin');
  const cards = document.querySelectorAll('.hotspot-card');

  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = pin.getAttribute('data-target');
      const targetCard = document.getElementById(targetId);

      const isActive = pin.classList.contains('active');

      // Close all cards & deactivate pins
      pins.forEach(p => p.classList.remove('active'));
      cards.forEach(c => c.classList.remove('show'));

      if (!isActive && targetCard) {
        pin.classList.add('active');
        targetCard.classList.add('show');
      }
    });
  });

  // Close hotspot cards on click outside
  document.addEventListener('click', () => {
    pins.forEach(p => p.classList.remove('active'));
    cards.forEach(c => c.classList.remove('show'));
  });

  // 3. Gallery Category Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
          item.classList.add('is-revealed');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 4. Contact Form Validation and Submission
  const contactForm = document.getElementById('renovationContactForm');
  const successMsg = document.getElementById('formSuccessMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const projectType = document.getElementById('projectType').value;
      const notes = document.getElementById('projectNotes').value.trim();

      if (!name || !phone) {
        alert('נא למלא שם מלא ומספר טלפון תקין ליצירת קשר.');
        return;
      }

      // Basic phone check
      const phoneClean = phone.replace(/[^0-9]/g, '');
      if (phoneClean.length < 9) {
        alert('נא להזין מספר טלפון תקין (לפחות 9 ספרות).');
        return;
      }

      // Save lead locally
      const lead = {
        name,
        phone,
        projectType,
        notes,
        date: new Date().toISOString()
      };

      try {
        const leads = JSON.parse(localStorage.getItem('erezim_leads') || '[]');
        leads.push(lead);
        localStorage.setItem('erezim_leads', JSON.stringify(leads));
      } catch (err) {
        console.warn('Storage error:', err);
      }

      // Show success feedback
      if (successMsg) {
        successMsg.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    });
  }

  // 5. Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.04)';
    }
  });

  // 6. Smooth Scroll for all internal hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

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
