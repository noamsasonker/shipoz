import re

with open('scratch/pookubeh.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

print("HTML script tags:")
for s in re.findall(r'<script[^>]*>', html):
    print(s)

with open('scratch/pookubeh.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

chunks = re.findall(r'["\'](/assets/[^"\']+\.js)["\']', js)
print("\nJS dynamic imports/chunks:", set(chunks))

# Search for "QUESTION" or Hebrew questions from FAQPage schema
faq_keywords = ["קובות", "משלוח", "הזמנה", "כשר", "תשובות", "שאלה", "סיר", "קפוא"]
for kw in faq_keywords:
    count = js.count(kw)
    if count > 0:
        print(f"Keyword '{kw}' found in main JS: {count} times")
