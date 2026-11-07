import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Target the contact details section
old_contact_start = html.find('<div class="contact-details stagger-container">')
assert old_contact_start != -1, "contact-details section not found"

old_contact_end = html.find('</div>\n        </div>\n\n        <div>\n          <form class="contact-form', old_contact_start)
if old_contact_end == -1:
    old_contact_end = html.find('</div>\r\n        </div>\r\n\r\n        <div>\r\n          <form class="contact-form', old_contact_start)
assert old_contact_end != -1, "End of contact-details not found"

old_block = html[old_contact_start:old_contact_end + len('</div>')]

new_block = """<div class="contact-details stagger-container">
            <a href="tel:0548438856" class="contact-detail-row stagger-item">
              <span class="contact-detail-icon icon-phone" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 3.93c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.55c0-.55-.45-1-.99-1z" fill="#16A34A"/>
                </svg>
              </span>
              <span>054-8438856</span>
            </a>
            <a href="https://wa.me/972548438856?text=%D7%A9%D7%9param%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%95%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%9C%D7%A9%D7%99%D7%A4%D7%95%D7%A5" class="contact-detail-row stagger-item" target="_blank" rel="noopener">
              <span class="contact-detail-icon icon-whatsapp" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.585.698 5.01 1.916 7.106L2.062 29.24a.8.8 0 0 0 .977.977l6.237-1.871A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>
                  <path d="M23.23 19.34c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.52-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61s1.12 3.03 1.28 3.24c.16.21 2.2 3.37 5.34 4.72.75.32 1.33.52 1.78.66.75.24 1.43.21 1.97.13.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.35.18-1.49-.08-.13-.29-.21-.6-.36z" fill="#FFFFFF"/>
                </svg>
              </span>
              <span>הודעה ישירה בוואטסאפ (זמינות מיידית)</span>
            </a>
            <div class="contact-detail-row stagger-item">
              <span class="contact-detail-icon icon-location" aria-hidden="true">
                <svg width="22" height="24" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 8.5 10.8 13.5 11.28 13.72a1.6 1.6 0 0 0 1.44 0C13.2 25.5 24 20.5 24 12c0-6.627-5.373-12-12-12z" fill="#EA4335"/>
                  <ellipse cx="12" cy="11" rx="4.5" ry="4.5" fill="#B31412" opacity="0.15"/>
                  <circle cx="12" cy="10.5" r="4.2" fill="#FFFFFF"/>
                </svg>
              </span>
              <span>שירות מקצועי בכל אזור המרכז, השפלה וירושלים</span>
            </div>
            <div class="contact-detail-row stagger-item">
              <span class="contact-detail-icon icon-clock" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 5a1 1 0 1 0-2 0v5a1 1 0 0 0 .5.866l3.5 2.02a1 1 0 0 0 1-1.732L13 11.634V7z" fill="#1A73E8"/>
                </svg>
              </span>
              <span>ימים א'-ה': 08:00 - 19:00 | ימי ו': 08:00 - 13:00</span>
            </div>
          </div>"""

html = html[:old_contact_start] + new_block + html[old_contact_end + len('</div>'):]

# Also update FAQ contact links to have real colors
# Update faq-phone-link SVG
old_faq_phone_svg = '<a href="tel:0548438856" class="faq-contact-link faq-phone-link">\n                    <span class="faq-link-icon">\n                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>\n                      </svg>\n                    </span>'

new_faq_phone_svg = '<a href="tel:0548438856" class="faq-contact-link faq-phone-link">\n                    <span class="faq-link-icon">\n                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 3.93c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.55c0-.55-.45-1-.99-1z" fill="#16A34A"/>\n                      </svg>\n                    </span>'

old_faq_wa_svg = '<span class="faq-link-icon">\n                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>\n                      </svg>\n                    </span>\n                    <span class="faq-link-label">מענה ישיר בוואטסאפ (זמינות מיידית)</span>'

new_faq_wa_svg = '<span class="faq-link-icon">\n                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.585.698 5.01 1.916 7.106L2.062 29.24a.8.8 0 0 0 .977.977l6.237-1.871A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366"/>\n                        <path d="M23.23 19.34c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.37.23-.68.08-.31-.16-1.32-.49-2.52-1.56-.93-.83-1.56-1.86-1.74-2.17-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54-.18-.01-.39-.01-.6-.01-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61s1.12 3.03 1.28 3.24c.16.21 2.2 3.37 5.34 4.72.75.32 1.33.52 1.78.66.75.24 1.43.21 1.97.13.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.35.18-1.49-.08-.13-.29-.21-.6-.36z" fill="#FFFFFF"/>\n                      </svg>\n                    </span>\n                    <span class="faq-link-label">מענה ישיר בוואטסאפ (זמינות מיידית)</span>'

html = html.replace(old_faq_phone_svg, new_faq_phone_svg)
html = html.replace(old_faq_wa_svg, new_faq_wa_svg)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html with authentic icons and colors!")
