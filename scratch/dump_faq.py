with open('scratch/pookubeh_clean.js', 'r', encoding='utf-8') as f:
    data = f.read()

faq_code = data[364000:371000]
with open('scratch/faq_source.txt', 'w', encoding='utf-8') as out:
    out.write(faq_code)

print("Saved faq_source.txt successfully!")
