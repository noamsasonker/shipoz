with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

s6 = html.find('<!-- Service 06 -->')
assert s6 != -1, "Service 06 not found"

closing_str = '        </div>\n      </div>\n    </section>'
end_idx = html.find(closing_str, s6)
assert end_idx != -1, "Closing string not found"

html_new = html[:s6] + closing_str + html[end_idx + len(closing_str):]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_new)

print("Trimmed cards 06-10 successfully!")
