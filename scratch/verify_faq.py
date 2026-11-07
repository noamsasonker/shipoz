import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('assets/css/cinematic-animations.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Check fonts in index.html
assert 'family=Playfair+Display' in html, "Playfair Display font link missing in index.html"
assert 'family=Rubik' in html, "Rubik font link missing in index.html"

# 2. Check FAQ markup in index.html
assert 'pookubeh-faq-section' in html, "pookubeh-faq-section class missing"
assert 'GOT A' in html and 'QUESTION?' in html, "GOT A QUESTION? headline missing"
assert 'שאלות נפוצות' in html, "שאלות נפוצות missing"
assert 'faq-diamond' in html, "faq-diamond missing"
assert 'faq-ornament-line' in html, "faq-ornament-line missing"
assert 'faq-accordion-trigger' in html, "faq-accordion-trigger missing"

# 3. Check all 6 original questions
original_questions = [
    "כמה זמן לוקח שיפוץ דירה?",
    "איך נקבעת עלות השיפוץ וכיצד מונעים חריגות?",
    "האם ניתן לשפץ חדר אחד בלבד או לבצע שיפוץ חלקי?",
    "האם אתם מספקים את חומרי העבודה?",
    "האם ניתן לקבל הצעת מחיר מדויקת לאחר ביקור בנכס?",
    "האם אפשר לבצע שיפוץ בהתאם לתקציב מוגדר מראש?"
]

for q in original_questions:
    assert q in html, f"Missing question: {q}"
print(f"All {len(original_questions)} original questions verified in index.html!")

# 4. Check CSS rules
assert '.pookubeh-faq-section' in css, "CSS .pookubeh-faq-section missing"
assert '#235347' in css, "CSS dark green color #235347 missing"
assert '#1B2626' in css, "CSS text color #1B2626 missing"
assert '#D5E2D9' in css, "CSS divider color #D5E2D9 missing"
assert '.faq-diamond' in css, "CSS .faq-diamond missing"
assert '.faq-trigger-icon' in css, "CSS .faq-trigger-icon missing"

# 5. Check JS logic
assert 'pookubeh-faq-item' in js, "JS pookubeh-faq-item logic missing in main.js"
assert 'faq-accordion-trigger' in js, "JS faq-accordion-trigger logic missing in main.js"

print("All FAQ redesign verifications passed 100% successfully!")
