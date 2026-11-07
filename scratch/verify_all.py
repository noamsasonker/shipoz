import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('assets/js/cinematic-animations.js', 'r', encoding='utf-8') as f:
    js = f.read()

with open('assets/css/cinematic-animations.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Services section cards
card_nums = re.findall(r'<span class="work-card-num">(\d+)</span>', html)
print(f"Service card numbers found ({len(card_nums)}):", card_nums)
assert card_nums == ['01', '02', '03', '04', '05'], f"Expected ['01', '02', '03', '04', '05'], got {card_nums}"

# 2. Articles section check
assert 'id="articles"' not in html, "id='articles' still found in index.html"
assert 'מדריכים וטיפים לשיפוץ חכם' not in html, "'מדריכים וטיפים לשיפוץ חכם' still found in index.html"
assert 'href="#articles"' not in html, "href='#articles' still found in index.html"

# 3. Contact icons check
assert '📞' not in html, "Emoji phone icon still found in index.html"
assert '💬' not in html, "Emoji chat icon still found in index.html"
assert '<svg' in html and 'M22 16.92v3a2 2 0 0 1-2.18 2' in html, "Lucide phone SVG not found"
assert 'M21 15a2 2 0 0 1-2 2H7l-4 4V5' in html, "Lucide message-square SVG not found"

# 4. Creators credit check
assert 'creators-credit' in html, "creators-credit class not found"
assert 'Website created by' in html, "'Website created by' text not found"
assert 'Roni Levi' in html and 'Noam Sasonker' in html, "Creator names not found"
assert '0584462009' not in re.search(r'<div class="creators-credit".*?</div>', html, re.DOTALL).group(0).replace('https://wa.me/972584462009', ''), "Phone number visible in text for Roni"
assert '0585620507' not in re.search(r'<div class="creators-credit".*?</div>', html, re.DOTALL).group(0).replace('https://wa.me/972585620507', ''), "Phone number visible in text for Noam"
assert 'https://wa.me/972584462009' in html, "Roni WhatsApp URL not found"
assert 'https://wa.me/972585620507' in html, "Noam WhatsApp URL not found"
assert 'target="_blank"' in html and 'rel="noopener"' in html, "target or rel attributes missing"

# 5. JS timeline scroll check
assert 'tl.to({}, { duration: 0.35 });' in js, "Initial pause duration not updated"
assert 'pauseInHeight = window.innerHeight * 0.28;' in js, "pauseInHeight not updated"
assert 'scrub: 0.85' in js, "scrub not updated"

# 6. CSS styling
assert '.creators-credit' in css, ".creators-credit CSS missing"
assert '.creator-link' in css, ".creator-link CSS missing"
assert '.contact-detail-icon svg' in css, ".contact-detail-icon svg CSS missing"

print("\nALL VERIFICATIONS PASSED PERFECTLY! 100% SUCCESS.")
