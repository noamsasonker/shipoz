import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove articles nav link
html = html.replace('<li><a href="#articles" class="nav-link">מדריכים</a></li>\n', '')
html = html.replace('<li><a href="#articles" class="nav-link">מדריכים</a></li>\r\n', '')

# 2. In #services, keep cards 01..05, remove cards 06..10
# Card 05 ends before <!-- Service 06 -->
# Check where <!-- Service 06 --> is
service_06_idx = html.find('<!-- Service 06 -->')
if service_06_idx != -1:
    # Find the closing tag of the .my-container
    # Cards 06-10 are between <!-- Service 06 --> and </div>\n        </div>\n    </section>
    end_container_idx = html.find('</div>\n        </div>\n    </section>', service_06_idx)
    if end_container_idx == -1:
        end_container_idx = html.find('</div>\r\n        </div>\r\n    </section>', service_06_idx)
    if end_container_idx != -1:
        html = html[:service_06_idx] + html[end_container_idx:]
        print("Successfully trimmed cards 06-10")
    else:
        print("Warning: end_container_idx not found, trying alternate pattern")
        # Find </section> after #services
        end_sec_idx = html.find('</section>', service_06_idx)
        # backtrack to the closing of my-container
        # Replace from service_06_idx to before the two closing divs of my-container and work-pin-stage
        sub = html[service_06_idx:end_sec_idx]
        print(f"Section end area: {repr(sub[-80:])}")

# 3. Remove #articles section entirely
art_idx = html.find('<section class="articles-section" id="articles">')
if art_idx != -1:
    end_art_idx = html.find('</section>', art_idx)
    if end_art_idx != -1:
        end_art_idx += len('</section>')
        # also consume trailing whitespace/newline
        while end_art_idx < len(html) and html[end_art_idx] in '\r\n ':
            end_art_idx += 1
        html = html[:art_idx] + html[end_art_idx:]
        print("Successfully removed #articles section")
    else:
        print("Warning: could not find end of #articles section")

# 4. Replace contact icons with Lucide SVG icons
old_contact_details = """          <div class="contact-details stagger-container">
            <a href="tel:0548438856" class="contact-detail-row stagger-item">
              <span class="contact-detail-icon">📞</span>
              <span>054-8438856</span>
            </a>
            <a href="https://wa.me/972548438856?text=%D7%A9%D7%9param%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%95%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%9C%D7%A9%D7%99%D7%A4%D7%95%D7%A5" class="contact-detail-row stagger-item" target="_blank" rel="noopener">
              <span class="contact-detail-icon">💬</span>
              <span>הודעה ישירה בוואטסאפ (זמינות מיידית)</span>
            </a>
            <div class="contact-detail-row stagger-item">
              <span class="contact-detail-icon">📍</span>
              <span>שירות מקצועי בכל אזור המרכז, השפלה וירושלים</span>
            </div>
            <div class="contact-detail-row stagger-item">
              <span class="contact-detail-icon">⏱</span>
              <span>ימים א'-ה': 08:00 - 19:00 | ימי ו': 08:00 - 13:00</span>
            </div>
          </div>"""

new_contact_details = """          <div class="contact-details stagger-container">
            <a href="tel:0548438856" class="contact-detail-row stagger-item">
              <span class="contact-detail-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </span>
              <span>054-8438856</span>
            </a>
            <a href="https://wa.me/972548438856?text=%D7%A9%D7%9param%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%95%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%9C%D7%A9%D7%99%D7%A4%D7%95%D7%A5" class="contact-detail-row stagger-item" target="_blank" rel="noopener">
              <span class="contact-detail-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <span>הודעה ישירה בוואטסאפ (זמינות מיידית)</span>
            </a>
            <div class="contact-detail-row stagger-item">
              <span class="contact-detail-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span>שירות מקצועי בכל אזור המרכז, השפלה וירושלים</span>
            </div>
            <div class="contact-detail-row stagger-item">
              <span class="contact-detail-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <span>ימים א'-ה': 08:00 - 19:00 | ימי ו': 08:00 - 13:00</span>
            </div>
          </div>"""

# Normalize line breaks for matching
def normalize_newlines(text):
    return text.replace('\r\n', '\n')

html_norm = normalize_newlines(html)
old_contact_norm = normalize_newlines(old_contact_details)
new_contact_norm = normalize_newlines(new_contact_details)

if old_contact_norm in html_norm:
    html_norm = html_norm.replace(old_contact_norm, new_contact_norm)
    print("Successfully replaced contact icons with Lucide SVG icons")
else:
    print("Warning: old_contact_details not found exactly")

# 5. Add Creators Credit below .footer-bottom
old_footer_bottom = """    <div class="footer-bottom">
      <div>כל הזכויות שמורות 2026 © ארזים — שיפוצים ועבודות גמר</div>
      <div>מקצועיות • אמינות • שקיפות</div>
    </div>"""

roni_url = "https://wa.me/972584462009?text=%D7%94%D7%99%D7%99%20%D7%A8%D7%95%D7%A0%D7%99%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%93%D7%91%D7%A8%20%D7%90%D7%99%D7%AA%D7%9A%20%D7%A2%D7%9C%20%D7%91%D7%A0%D7%99%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8."
noam_url = "https://wa.me/972585620507?text=%D7%94%D7%99%D7%99%20%D7%A0%D7%95%D7%A2%D7%9D%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%93%D7%91%D7%A8%20%D7%90%D7%99%D7%AA%D7%9A%20%D7%A2%D7%9C%20%D7%91%D7%A0%D7%99%D7%99%D7%AA%20%D7%90%D7%AA%D7%A8."

new_footer_bottom = f"""    <div class="footer-bottom">
      <div>כל הזכויות שמורות 2026 © ארזים — שיפוצים ועבודות גמר</div>
      <div>מקצועיות • אמינות • שקיפות</div>
    </div>

    <div class="creators-credit" dir="ltr">
      Website created by <a href="{roni_url}" target="_blank" rel="noopener" class="creator-link">Roni Levi</a> &amp; <a href="{noam_url}" target="_blank" rel="noopener" class="creator-link">Noam Sasonker</a>
    </div>"""

old_fb_norm = normalize_newlines(old_footer_bottom)
new_fb_norm = normalize_newlines(new_footer_bottom)

if old_fb_norm in html_norm:
    html_norm = html_norm.replace(old_fb_norm, new_fb_norm)
    print("Successfully added creators credit")
else:
    print("Warning: old_footer_bottom not found exactly")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_norm)

print("index.html update complete!")
