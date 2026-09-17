"""Capture the actual Saba Lembang app in an isolated browser."""
import json
import subprocess
import time
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT.parent / 'Marketplace-Desa-Wisata'
server = subprocess.Popen(['bun', 'run', 'preview', '--host', '127.0.0.1', '--port', '5186'], cwd=APP)
try:
    for _ in range(30):
        try:
            urllib.request.urlopen('http://127.0.0.1:5186', timeout=1)
            break
        except OSError:
            time.sleep(1)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.goto('http://127.0.0.1:5186', wait_until='networkidle')
        records = []
        for view, caption in [('home', 'Saba Lembang public landing page, running locally with the repository-supplied tourism content.'), ('catalog', 'Saba Lembang marketplace filters and product cards; repository-supplied catalog, not verified live inventory.')]:
            if view == 'catalog':
                page.get_by_role('button', name='Marketplace', exact=True).click()
            page.wait_for_timeout(1500)
            page.evaluate('window.scrollTo(0, 0)')
            page.screenshot(path=str(ROOT / 'public/media/projects' / f'Marketplace-Desa-Wisata-{view}.png'))
            records.append({'project': 'Marketplace-Desa-Wisata', 'url': page.url, 'caption': caption, 'path': str(ROOT / 'public/media/projects' / f'Marketplace-Desa-Wisata-{view}.png'), 'command': 'bun install --frozen-lockfile && bun run build; uv run --with playwright --no-project python scripts/capture-marketplace.py', 'privacyReview': 'Fresh browser; public screens only, no login, checkout, personal records or fabricated substitutions. Repository catalog may include demonstration content; not represented as verified live inventory.'})
        (ROOT / 'scripts/captures-marketplace.json').write_text(json.dumps(records, indent=2) + '\n')
        print('Captured', len(records), 'screens')
        browser.close()
finally:
    server.terminate()
    server.wait(timeout=10)
