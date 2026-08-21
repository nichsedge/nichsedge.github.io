#!/usr/bin/env python3
"""Generate dark-themed project cover images matching site aesthetic."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.expanduser("~/Projects/nichsedge.github.io/public/media/projects")
os.makedirs(OUT, exist_ok=True)

W, H = 1280, 800
BG = (13, 13, 18)
BG2 = (18, 18, 26)
ACCENT = (167, 139, 250)      # purple-400
ACCENT_DIM = (167, 139, 250, 40)
BORDER = (40, 40, 55)
TEXT0 = (237, 237, 240)
TEXT3 = (140, 140, 155)
GREEN = (52, 211, 153)

FONT_DIR = "/usr/share/fonts/truetype/jetbrains-mono"
def font(size, bold=False):
    for cand in [
        "/usr/share/fonts/nerd-fonts/JetBrainsMono/JetBrainsMonoNerdFont-Bold.ttf" if bold else "/usr/share/fonts/nerd-fonts/JetBrainsMono/JetBrainsMonoNerdFont-Regular.ttf",
        "/usr/share/fonts/jetbrains-mono-fonts/JetBrainsMono-Bold.ttf" if bold else "/usr/share/fonts/jetbrains-mono-fonts/JetBrainsMono-Regular.ttf",
    ]:
        if os.path.exists(cand):
            return ImageFont.truetype(cand, size)
    return ImageFont.load_default()

def grid_layer(draw, alpha=14):
    for x in range(0, W, 40):
        draw.line([(x, 0), (x, H)], fill=(255, 255, 255, alpha), width=1)
    for y in range(0, H, 40):
        draw.line([(0, y), (W, y)], fill=(255, 255, 255, alpha), width=1)

def base(name, subtitle, tag, lang_color=ACCENT):
    img = Image.new("RGB", (W, H), BG)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    grid_layer(d)
    # radial-ish glow top-left
    for r in range(500, 0, -10):
        a = int(28 * (1 - r / 500))
        d.ellipse([200 - r, -200 - r, 200 + r, -200 + r], fill=(ACCENT[0], ACCENT[1], ACCENT[2], a))
    img = Image.alpha_composite(img.convert("RGBA"), ov)
    d = ImageDraw.Draw(img)
    # border frame
    d.rectangle([24, 24, W - 24, H - 24], outline=BORDER, width=2)
    # top decorative corner lines
    d.line([(W - 24 - 96, 24), (W - 24, 24)], fill=ACCENT, width=2)
    d.line([(W - 24, 24), (W - 24, 24 + 96)], fill=ACCENT, width=2)
    # tag chip top-left
    f_tag = font(26, bold=True)
    tw = d.textlength(tag, font=f_tag)
    d.rounded_rectangle([48, 48, 48 + tw + 44, 100], radius=8, outline=BORDER, width=2, fill=BG2)
    d.text((70, 60), tag, font=f_tag, fill=ACCENT)
    # title
    d.text((48, 300), name, font=font(88, bold=True), fill=TEXT0)
    # subtitle
    d.text((48, 430), subtitle, font=font(34), fill=TEXT3)
    # bottom bar: dot + lang + fake path
    d.ellipse([48, H - 96, 64, H - 80], fill=lang_color)
    d.text((80, H - 100), "~/projects/" + name.lower(), font=font(28), fill=TEXT3)
    return img

PROJECTS = [
    ("ksei", "Unofficial MCP server for AKSes KSEI portfolio", "PY", ACCENT),
    ("debank-scraper", "Async EVM wallet & DeFi position scraper", "PY", ACCENT),
    ("indoscraping", "Unified web scraper suite & visual CLI dashboard", "PY", ACCENT),
    ("deepfocus", "Neon-glow Pomodoro & focus timer for Android", "KT", (240, 171, 252)),
    ("hydrotrack", "Lightweight water intake tracker for Android", "KT", (240, 171, 252)),
    ("yt-summarizer", "YouTube video summarizer to markdown", "PY", ACCENT),
    ("ngantriwoy", "Smart real-time queue system for Indonesian UMKM", "TS", (96, 165, 250)),
    ("jira-clone", "ProFlow Tickets: AI-powered Jira clone", "TS", (96, 165, 250)),
    ("bijak-beli", "Shop with purpose — conscious consumer app", "TS", (96, 165, 250)),
    ("digital-garden", "Personal digital garden & knowledge base", "TS", (96, 165, 250)),
    ("nutrijoy", None, None, None),  # skip, already has
]

for name, subtitle, tag, color in PROJECTS:
    if subtitle is None:
        continue
    img = base(name, subtitle, tag, color)
    img.convert("RGB").save(os.path.join(OUT, f"{name}.png"), optimize=True)
    print("saved", name)
