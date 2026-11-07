with open('scratch/pookubeh.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'GOT A QUESTION|question|faq|שאלות', text, re.IGNORECASE)]
print("Matches found:", len(matches))
for pos in matches[:10]:
    print("--- MATCH AT", pos, "---")
    print(text[max(0, pos-200):min(len(text), pos+400)])

# Also find CSS links or style tags
css_links = re.findall(r'<link[^>]+stylesheet[^>]+>', text)
print("\nCSS Links:", css_links)
scripts = re.findall(r'<script[^>]+src=[^>]+>', text)
print("\nScripts:", scripts)
