"""Capture public portfolio routes, without personal browser storage."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
rows = []
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width':1440,'height':1000}, reduced_motion='reduce')
    for view, route in [('home','/'),('projects','/projects/')]:
        response = page.goto('http://127.0.0.1:3002'+route, wait_until='networkidle')
        assert response.status == 200
        page.add_style_tag(content='nextjs-portal {display:none !important}')
        page.wait_for_timeout(3500)
        path = ROOT/'public/media/projects'/f'nichsedge.github.io-{view}.png'
        page.screenshot(path=str(path))
        print(view, page.locator('body').inner_text()[:1500])
        rows.append({'project':'nichsedge.github.io','url':page.url,'path':str(path),'caption':f'Running portfolio: {view} page.','command':'bun run dev; uv run --with playwright --no-project python scripts/capture-portfolio.py','privacyReview':'Isolated browser, public routes; developer badge hidden only. No personal storage or credential entry.'})
    browser.close()
(ROOT/'scripts/captures-portfolio.json').write_text(json.dumps(rows,indent=2)+'\n')
