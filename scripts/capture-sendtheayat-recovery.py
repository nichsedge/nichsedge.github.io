"""Capture the running static app in isolated Android Chrome via CDP.
Prereqs: serve SendTheAyat/out on 8394; adb -s emulator-5580 reverse tcp:8394 tcp:8394;
adb -s emulator-5580 forward tcp:9394 localabstract:chrome_devtools_remote.
Run: uv run --no-project --with playwright python scripts/capture-sendtheayat-recovery.py
No source edits, seeded storage, account login or message submissions.
"""
import hashlib,json,subprocess,time
from pathlib import Path
from datetime import datetime,timezone
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'public/media/projects'
EVID=ROOT/'scripts/sendtheayat-recovery-evidence'
EVID.mkdir(exist_ok=True)
ADB=['/home/al/Android/Sdk/platform-tools/adb','-s','emulator-5580']
rows=[]
with sync_playwright() as p:
    browser=p.chromium.connect_over_cdp('http://127.0.0.1:9394')
    page=browser.contexts[0].pages[0]
    errors=[];failed=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('response',lambda r:failed.append({'url':r.url,'status':r.status}) if r.status>=400 else None)
    response=page.goto('http://127.0.0.1:8394/',wait_until='networkidle')
    assert response and response.status==200
    expect(page.locator('#nav-history-btn')).to_be_visible()
    assert page.evaluate("localStorage.getItem('kirimayat_saved_verses')") in (None,'[]')
    assert page.evaluate("localStorage.getItem('kirimayat_sent_messages')") in (None,'[]')
    page.locator('h1').click()
    def capture(view,caption):
        time.sleep(2)
        # Browser viewport screenshot excludes browser onboarding/tooltips, not app content.
        f=ASSETS/f'SendTheAyat-{view}.png'
        page.screenshot(path=str(f),full_page=False)
        (EVID/f'{view}.txt').write_text(page.locator('body').inner_text())
        rows.append({'project':'SendTheAyat','url':page.url,'path':str(f),'manifestEntry':{'url':'/media/projects/'+f.name,'caption':caption},'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'captureMethod':'Playwright screenshot of actual Android Chrome viewport via CDP','capturedAt':datetime.now(timezone.utc).isoformat()})
    capture('home','Running mobile web app: KirimAyat landing page; repository-provided demonstration messages, not live submissions.')
    page.get_by_role('button',name='Pesan Tersimpan',exact=True).click()
    expect(page.get_by_text('Arsip Ayat & Pesan Kamu',exact=True)).to_be_visible()
    expect(page.locator('#tab-saved-verses')).to_have_text('Ayat Tersimpan (0)')
    capture('saved','Running mobile web app: saved-verses archive in a fresh browser, with no saved or sent personal messages.')
    page.locator('#tab-sent-messages').click()
    expect(page.locator('#tab-sent-messages')).to_have_text('Pesan Terkirim (0)')
    sent_text=page.locator('body').inner_text()
    assert 'Belum' in sent_text or 'belum' in sent_text
    page.locator('#close-history-modal-btn').click()
    expect(page.get_by_text('Arsip Ayat & Pesan Kamu',exact=True)).not_to_be_visible()
    page.locator('#nav-cta-kirim-btn').click()
    (EVID/'compose.txt').write_text(page.locator('body').inner_text())
    print('COMPOSE',page.locator('body').inner_text()[:1800])
    (EVID/'runtime.json').write_text(json.dumps({'rootHTTP':response.status,'pageErrors':errors,'httpFailures':failed,'checks':['home renders','accessible-name Pesan Tersimpan opens archive','saved count 0','sent tab count 0','archive closes'],'captures':rows},indent=2))
    print(json.dumps(rows,indent=2))
    browser.close()
