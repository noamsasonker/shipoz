with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

s6 = html.find('<!-- Service 06 -->')
print("Service 06 found:", s6 != -1)
if s6 != -1:
    s_end = html.find('</section>', s6)
    print("Section content from s6 to s_end:")
    print(repr(html[s6:s6+400]))
    print("...")
    print(repr(html[s_end-200:s_end+20]))
