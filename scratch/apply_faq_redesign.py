import re

# 1. Read index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Google Fonts link if not present
fonts_link = '<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet">'

if 'family=Playfair+Display' not in html:
    html = html.replace('<link rel="stylesheet" href="assets/css/main-custom.css">', fonts_link + '\n  <link rel="stylesheet" href="assets/css/main-custom.css">')
    print("Added Google Fonts Playfair Display & Rubik")

# Find existing #faq section
faq_start = html.find('<!-- FAQ Section -->')
if faq_start == -1:
    faq_start = html.find('<section class="faq-section" id="faq">')
assert faq_start != -1, "FAQ section not found in index.html"

faq_end = html.find('</section>', faq_start) + len('</section>')

new_faq_html = """    <!-- FAQ Section — Pookubeh Exact Design Replication -->
    <section class="pookubeh-faq-section" id="faq">
      <div class="faq-inner-container">
        <div class="faq-two-col-grid">
          
          <!-- RIGHT COLUMN (Sticky on Desktop) -->
          <div class="faq-meta-col">
            <div class="faq-headline-wrap" dir="ltr">
              <h2 class="faq-editorial-heading">
                <span>GOT A</span>
                <span>QUESTION?</span>
              </h2>
            </div>

            <!-- Decorative Ornament Line with Diamonds & Subtitle -->
            <div class="faq-sub-ornament">
              <div class="faq-diamond"></div>
              <div class="faq-ornament-line"></div>
              <span class="faq-sub-badge">שאלות נפוצות</span>
              <div class="faq-ornament-line"></div>
              <div class="faq-diamond"></div>
            </div>

            <!-- Desktop Contact Box -->
            <div class="faq-contact-box faq-contact-desktop">
              <h3 class="faq-contact-title">יש לכם שאלה שלא מופיעה כאן?</h3>
              <p class="faq-contact-text">
                מוזמנים לפנות לצוות ארזים שיפוצים ונשמח לסייע בכל שאלה ובקשה:
              </p>
              <div class="faq-contact-actions">
                <div class="faq-contact-row">
                  <a href="tel:0548438856" class="faq-contact-link faq-phone-link">
                    <span class="faq-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <span class="faq-link-label">שיחה ישירה:</span>
                    <span class="faq-link-num" dir="ltr">054-8438856</span>
                  </a>
                </div>
                <div class="faq-contact-row">
                  <a href="https://wa.me/972548438856?text=%D7%A9%D7%9param%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%95%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%9C%D7%A9%D7%99%D7%A4%D7%95%D7%A5" class="faq-contact-link faq-wa-link" target="_blank" rel="noopener">
                    <span class="faq-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </span>
                    <span class="faq-link-label">מענה ישיר בוואטסאפ (זמינות מיידית)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- LEFT COLUMN (Questions Accordion) -->
          <div class="faq-accordion-col">
            <div class="faq-accordion-list">
              
              <!-- Item 01 -->
              <div class="pookubeh-faq-item is-open" data-faq-id="1">
                <button type="button" class="faq-accordion-trigger" aria-expanded="true">
                  <h3 class="faq-question-title">כמה זמן לוקח שיפוץ דירה?</h3>
                  <div class="faq-trigger-icon" aria-hidden="true">
                    <span class="faq-icon-line faq-icon-h"></span>
                    <span class="faq-icon-line faq-icon-v"></span>
                  </div>
                </button>
                <div class="faq-accordion-body" style="max-height: 500px;">
                  <p class="faq-answer-text">
                    משך הזמן תלוי בהיקף הפרויקט. שיפוץ דירה קומפלט ממוצע (הכולל הריסה, החלפת כלל התשתיות, בינוי, איטום, ריצוף וגמר) אורך בדרך כלל בין 4 ל-8 שבועות. שיפוץ ממוקד (כגון חדר רחצה או מטבח) נמשך לרוב בין 7 ל-14 ימי עבודה. לפני תחילת העבודה אנו מגדירים לוח זמנים שבועי מפורט ומתחייבים לו.
                  </p>
                </div>
              </div>

              <!-- Item 02 -->
              <div class="pookubeh-faq-item" data-faq-id="2">
                <button type="button" class="faq-accordion-trigger" aria-expanded="false">
                  <h3 class="faq-question-title">איך נקבעת עלות השיפוץ וכיצד מונעים חריגות?</h3>
                  <div class="faq-trigger-icon" aria-hidden="true">
                    <span class="faq-icon-line faq-icon-h"></span>
                    <span class="faq-icon-line faq-icon-v"></span>
                  </div>
                </button>
                <div class="faq-accordion-body">
                  <p class="faq-answer-text">
                    עלות השיפוץ מבוססת על כתב כמויות מפורט ומדידה יסודית בנכס. אנו בונים הצעת מחיר סגורה ושקופה הכוללת את כל העבודות וחומרי התשתית ("חומרים שחורים"), כך שאין תוספות בלתי צפויות. במידה ואתם מבקשים לשנות או להוסיף רכיב במהלך העבודה, הדבר מתומחר ומאושר בכתב מראש.
                  </p>
                </div>
              </div>

              <!-- Item 03 -->
              <div class="pookubeh-faq-item" data-faq-id="3">
                <button type="button" class="faq-accordion-trigger" aria-expanded="false">
                  <h3 class="faq-question-title">האם ניתן לשפץ חדר אחד בלבד או לבצע שיפוץ חלקי?</h3>
                  <div class="faq-trigger-icon" aria-hidden="true">
                    <span class="faq-icon-line faq-icon-h"></span>
                    <span class="faq-icon-line faq-icon-v"></span>
                  </div>
                </button>
                <div class="faq-accordion-body">
                  <p class="faq-answer-text">
                    בהחלט. אנו מבצעים שיפוצי חדר רחצה, שדרוג מטבחים, עבודות ריצוף, צבע או גבס גם כפרויקטים נקודתיים. כל פרויקט — קטן כגדול — מקבל אצלנו את אותה רמת הקפדה, בידוד אזור העבודה מניילונים והגנה על שאר חלקי הבית.
                  </p>
                </div>
              </div>

              <!-- Item 04 -->
              <div class="pookubeh-faq-item" data-faq-id="4">
                <button type="button" class="faq-accordion-trigger" aria-expanded="false">
                  <h3 class="faq-question-title">האם אתם מספקים את חומרי העבודה?</h3>
                  <div class="faq-trigger-icon" aria-hidden="true">
                    <span class="faq-icon-line faq-icon-h"></span>
                    <span class="faq-icon-line faq-icon-v"></span>
                  </div>
                </button>
                <div class="faq-accordion-body">
                  <p class="faq-answer-text">
                    כן. אנו מספקים את כל חומרי התשתית ("חומרים שחורים") — חול, מלט, בלוקים, גבס תקני, צנרות SP/פקסגול, חומרי איטום מורשים, דבקים ורובה אפוקסית. חומרי הגמר ("חומרים לבנים" — ריצוף, חיפוי, כלים סניטריים, גופי תאורה) נרכשים על ידכם, ואנו מלווים ומסייעים בבדיקת כמויות והתאמה טכנית.
                  </p>
                </div>
              </div>

              <!-- Item 05 -->
              <div class="pookubeh-faq-item" data-faq-id="5">
                <button type="button" class="faq-accordion-trigger" aria-expanded="false">
                  <h3 class="faq-question-title">האם ניתן לקבל הצעת מחיר מדויקת לאחר ביקור בנכס?</h3>
                  <div class="faq-trigger-icon" aria-hidden="true">
                    <span class="faq-icon-line faq-icon-h"></span>
                    <span class="faq-icon-line faq-icon-v"></span>
                  </div>
                </button>
                <div class="faq-accordion-body">
                  <p class="faq-answer-text">
                    כן, וזהו גם הצעד הנכון והמקצועי ביותר. ביקור ראשוני בנכס מאפשר לבחון את מצב התשתיות בפועל, להבין את תוכניות השיפוץ שלכם ולבצע מדידה מדויקת. בעקבות הפגישה תקבלו הצעת מחיר מפורטת ומסודרת — ללא כל התחייבות.
                  </p>
                </div>
              </div>

              <!-- Item 06 -->
              <div class="pookubeh-faq-item" data-faq-id="6">
                <button type="button" class="faq-accordion-trigger" aria-expanded="false">
                  <h3 class="faq-question-title">האם אפשר לבצע שיפוץ בהתאם לתקציב מוגדר מראש?</h3>
                  <div class="faq-trigger-icon" aria-hidden="true">
                    <span class="faq-icon-line faq-icon-h"></span>
                    <span class="faq-icon-line faq-icon-v"></span>
                  </div>
                </button>
                <div class="faq-accordion-body">
                  <p class="faq-answer-text">
                    בהחלט. אנו מאמינים בהתאמה חכמה למסגרת התקציב. בפגישת האפיון נגדיר את סדרי העדיפויות, ונמליץ על פתרונות ביצוע ובחירת חומרים שיאפשרו להגיע לתוצאה מרשימה ואיכותית במסגרת התקציב שקבעתם.
                  </p>
                </div>
              </div>

            </div>

            <!-- Mobile Contact Box (Stacked underneath questions) -->
            <div class="faq-contact-box faq-contact-mobile">
              <h3 class="faq-contact-title">יש לכם שאלה שלא מופיעה כאן?</h3>
              <p class="faq-contact-text">
                מוזמנים לפנות לצוות ארזים שיפוצים ונשמח לסייע בכל שאלה ובקשה:
              </p>
              <div class="faq-contact-actions">
                <div class="faq-contact-row">
                  <a href="tel:0548438856" class="faq-contact-link faq-phone-link">
                    <span class="faq-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </span>
                    <span class="faq-link-label">שיחה ישירה:</span>
                    <span class="faq-link-num" dir="ltr">054-8438856</span>
                  </a>
                </div>
                <div class="faq-contact-row">
                  <a href="https://wa.me/972548438856?text=%D7%A9%D7%9param%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A4%D7%92%D7%99%D7%A9%D7%AA%20%D7%99%D7%99%D7%A2%D7%95%D7%A5%20%D7%95%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8%20%D7%9C%D7%A9%D7%99%D7%A4%D7%95%D7%A5" class="faq-contact-link faq-wa-link" target="_blank" rel="noopener">
                    <span class="faq-link-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </span>
                    <span class="faq-link-label">מענה ישיר בוואטסאפ (זמינות מיידית)</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>"""

html = html[:faq_start] + new_faq_html + html[faq_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html with Pookubeh FAQ section!")
