import urllib.request
import re

url = "https://pookubeh.web.app/assets/index-CWBVpquR.js"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = resp.read().decode('utf-8')

with open('scratch/pookubeh_clean.js', 'w', encoding='utf-8') as f:
    f.write(data)

print("Downloaded clean JS, length:", len(data))

# Let's search for FAQ or question keywords in clean JS
matches = []
for m in re.finditer(r'שאלות|נפוצות|question', data, re.IGNORECASE):
    matches.append(m.start())

print("Found matches:", len(matches))
for p in matches[:10]:
    print("--- MATCH AT", p, "---")
    print(data[max(0, p-300):min(len(data), p+600)])
