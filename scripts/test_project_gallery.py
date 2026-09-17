"""Exercise the real screenshot manifest against a running portfolio.

Run: uv run --with playwright python scripts/test_project_gallery.py http://localhost:3002
Requires Playwright Chromium (or CHROME_PATH). Does not create or substitute images.
An empty manifest checks the honest missing-capture state but cannot verify a gallery.
"""

import json
import os
from pathlib import Path
import sys
from urllib.parse import urlparse

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[1]


def main():
    base = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3002").rstrip("/")
    manifest = json.loads((ROOT / "data/project-screenshots.json").read_text())
    repos = json.loads((ROOT / "data/github_repos_all.json").read_text())["repos"]
    excluded = {repo["name"] for repo in repos if not repo["private"] and repo["owner_login"] == "nichsedge" and (repo["fork"] or repo["archived"])}
    displayed = {repo["name"] for repo in repos if not repo["private"] and repo["owner_login"] == "nichsedge" and not repo["fork"] and not repo["archived"]}
    eligible = displayed
    statuses = json.loads((ROOT / "data/project-capture-status.json").read_text())
    no_ui = {name for name, record in statuses.items() if record["status"] == "no-ui"}
    blocked = {name for name, record in statuses.items() if record["status"] == "blocked"}
    assert isinstance(manifest, dict), "Manifest must be an object keyed by repository name"
    for name, images in manifest.items():
        assert isinstance(images, list) and len(images) >= 2, f"{name}: requires two distinct captures"
        assert len({image["url"] for image in images}) == len(images), f"{name}: duplicate URL"
        for image in images:
            assert isinstance(image.get("caption"), str) and image["caption"].strip(), f"{name}: missing caption"
            path = urlparse(image["url"])
            assert path.path and not path.query and not path.fragment, f"{name}: invalid asset URL"
            if not path.netloc:
                assert (ROOT / "public" / path.path.lstrip("/")).is_file(), f"{name}: asset missing"

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, executable_path=os.environ.get("CHROME_PATH"))
        page = browser.new_page(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
        page.goto(f"{base}/projects/", wait_until="networkidle")
        search = page.get_by_placeholder("Search projects...", exact=True)
        missing = sorted(eligible - no_ui - blocked - {name for name, images in manifest.items() if images})
        # Verify excluded forks/archived repos do not appear
        for name in sorted(excluded)[:3]:
            search.fill(name)
            expect(page.get_by_text(name, exact=True)).to_have_count(0)
        # Verify repos without screenshots do not show broken placeholders or gallery
        if missing:
            search.fill(missing[0])
            expect(page.get_by_text("Screenshots not captured yet", exact=True)).to_have_count(0)
            expect(page.locator("[data-project-gallery]")).to_have_count(0)

        captured = sorted(displayed & manifest.keys())
        for name in captured:
            images = manifest[name]
            search.fill(name)
            gallery = page.locator("[data-project-gallery]").filter(has=page.get_by_role("button", name=f"Show screenshot 1: {images[0]['caption']}", exact=True))
            expect(gallery).to_have_count(1)
            for index, image in enumerate(images):
                thumb = gallery.get_by_role("button", name=f"Show screenshot {index + 1}: {image['caption']}", exact=True)
                thumb.click()
                expect(thumb).to_have_attribute("aria-pressed", "true")
                cover = gallery.get_by_role("button", name=f"Open full-size screenshot: {name} — {image['caption']}", exact=True)
                expect(cover.locator("img")).to_have_attribute("alt", f"{name} — {image['caption']}")
                expect(cover.locator("img")).to_have_js_property("complete", True)
                assert cover.locator("img").evaluate("image => image.naturalWidth > 0"), f"{name}: broken cover"

            cover = gallery.get_by_role("button", name="Open full-size screenshot", exact=False)
            cover.focus()
            page.keyboard.press("Enter")
            dialog = page.get_by_role("dialog")
            expect(dialog).to_be_visible()
            assert dialog.evaluate("element => element.parentElement === document.body && element.matches(':modal')")
            close = dialog.get_by_role("button", name="Close gallery", exact=True)
            expect(close).to_be_focused()
            page.keyboard.press("ArrowRight")
            expect(dialog.locator("figcaption")).to_contain_text(f"1 / {len(images)}")
            page.keyboard.press("ArrowLeft")
            expect(dialog.locator("figcaption")).to_contain_text(f"{len(images)} / {len(images)}")
            dialog.get_by_role("button", name="Next screenshot", exact=True).click()
            expect(dialog.locator("figcaption")).to_contain_text(images[0]["caption"])
            dialog.get_by_role("button", name="Previous screenshot", exact=True).click()
            expect(dialog.locator("figcaption")).to_contain_text(images[-1]["caption"])
            assert dialog.locator("img").evaluate("image => getComputedStyle(image).objectFit === 'contain'")
            for _ in range(5):
                page.keyboard.press("Tab")
                assert dialog.evaluate("element => element.contains(document.activeElement)"), "Focus escaped modal"
            page.keyboard.press("Escape")
            expect(dialog).to_have_count(0)
            expect(cover).to_be_focused()
            cover.click()
            page.get_by_role("button", name="Close gallery", exact=True).click()
            expect(cover).to_be_focused()
            assert page.evaluate("document.body.style.overflow !== 'hidden'"), "Scroll lock leaked"

        page.set_viewport_size({"width": 390, "height": 844})
        if captured:
            search.fill(captured[0])
            gallery = page.locator(f'[data-project-gallery="{captured[0]}"]')
            gallery.get_by_role("button", name="Open full-size screenshot", exact=False).click()
            dialog = page.get_by_role("dialog")
            box = dialog.bounding_box()
            assert box and box["x"] >= 0 and box["width"] <= 390 and box["height"] <= 844
            page.keyboard.press("Escape")
        page.goto(f"{base}/id/projects/", wait_until="networkidle")
        if missing:
            page.get_by_placeholder("Cari proyek...", exact=True).fill(missing[0])
            expect(page.get_by_text("Tangkapan layar belum diambil", exact=True)).to_have_count(0)
            expect(page.locator("[data-project-gallery]")).to_have_count(0)
        browser.close()
    print(f"PASS: {len(captured)} real galleries; {len(missing)} uncaptured repositories; keyboard, dialog and mobile checks")
    if not captured:
        print("NOT VERIFIED: gallery interactions require reviewed captures in the manifest")


if __name__ == "__main__":
    main()
