import re

with open('scratch/pookubeh.js', 'r', encoding='utf-8', errors='ignore') as f:
    js_content = f.read()

# Search for "GOT A QUESTION"
idx = js_content.find("GOT A QUESTION")
if idx != -1:
    print("Found 'GOT A QUESTION' in JS at:", idx)
    snippet = js_content[max(0, idx-1000):min(len(js_content), idx+2000)]
    print("\n--- SNIPPET ---")
    print(snippet)
else:
    print("'GOT A QUESTION' not found in JS, searching case-insensitive...")
    m = re.search(r'got[\s\w]*question', js_content, re.IGNORECASE)
    if m:
        print("Found regex match at:", m.start())
        print(js_content[m.start()-500:m.start()+1500])

with open('scratch/pookubeh.css', 'r', encoding='utf-8', errors='ignore') as f:
    css_content = f.read()

# Search for faq or accordion or got a question
css_matches = re.findall(r'(\.[a-zA-Z0-9_-]*(?:faq|accordion|question)[a-zA-Z0-9_-]*\s*\{[^}]+\})', css_content, re.IGNORECASE)
print(f"\nFound {len(css_matches)} CSS rules:")
for rule in css_matches[:10]:
    print(rule)
