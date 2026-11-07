with open('assets/css/cinematic-animations.css', 'r', encoding='utf-8') as f:
    css = f.read()

old_css_part = """.contact-detail-icon svg {
  display: block;
  stroke: #242424;
  transition: stroke 0.25s ease, transform 0.25s ease;
}

.contact-detail-row:hover .contact-detail-icon svg {
  stroke: #F1B86E;
  transform: scale(1.08);
}"""

new_css_part = """.contact-detail-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background-color 0.25s ease;
}

.contact-detail-icon svg {
  display: block;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.contact-detail-row:hover .contact-detail-icon {
  transform: translateY(-2px);
}

.contact-detail-row:hover .contact-detail-icon svg {
  transform: scale(1.12);
}

/* Individual Icon Brand Colors, Hover Glows & Subtle Tints */
.contact-detail-row:hover .contact-detail-icon.icon-phone {
  box-shadow: 0 6px 18px rgba(22, 163, 74, 0.28);
  background-color: #F0FDF4;
}

.contact-detail-row:hover .contact-detail-icon.icon-whatsapp {
  box-shadow: 0 6px 18px rgba(37, 211, 102, 0.35);
  background-color: #F0FDF4;
}

.contact-detail-row:hover .contact-detail-icon.icon-location {
  box-shadow: 0 6px 18px rgba(234, 67, 53, 0.28);
  background-color: #FEF2F2;
}

.contact-detail-row:hover .contact-detail-icon.icon-clock {
  box-shadow: 0 6px 18px rgba(26, 115, 232, 0.28);
  background-color: #EFF6FF;
}"""

# Normalize
css_norm = css.replace('\r\n', '\n')
old_part_norm = old_css_part.replace('\r\n', '\n')

assert old_part_norm in css_norm, "old_css_part not found in cinematic-animations.css"

css_norm = css_norm.replace(old_part_norm, new_css_part)

with open('assets/css/cinematic-animations.css', 'w', encoding='utf-8') as f:
    f.write(css_norm)

print("Updated cinematic-animations.css successfully!")
