with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('assets/css/cinematic-animations.css', 'r', encoding='utf-8') as f:
    css = f.read()

assert 'icon-phone' in html, "icon-phone class missing"
assert 'icon-whatsapp' in html, "icon-whatsapp class missing"
assert 'icon-location' in html, "icon-location class missing"
assert 'icon-clock' in html, "icon-clock class missing"

# Check brand colors
assert '#16A34A' in html, "Phone green color missing"
assert '#25D366' in html, "WhatsApp green color missing"
assert '#EA4335' in html, "Google Maps red color missing"
assert '#1A73E8' in html, "Clock blue color missing"

# Check CSS
assert '.contact-detail-icon.icon-phone' in css, "icon-phone CSS missing"
assert '.contact-detail-icon.icon-whatsapp' in css, "icon-whatsapp CSS missing"
assert '.contact-detail-icon.icon-location' in css, "icon-location CSS missing"
assert '.contact-detail-icon.icon-clock' in css, "icon-clock CSS missing"

# Ensure stroke: #242424 was removed from .contact-detail-icon svg
assert 'stroke: #242424' not in css[css.find('10. CONTACT DETAIL ICONS'):css.find('11. POOKUBEH')], "stroke: #242424 still overriding contact icons"

print("All icon verification checks passed with 100% success!")
