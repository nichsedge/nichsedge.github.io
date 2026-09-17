"""Finalize reviewed real-device captures; never seed data or edit app/gallery source.
Run: uv run --no-project python scripts/recover-existing-captures.py
Inputs were captured by adb from the new isolated 'recovered' AVD on emulator-5582.
"""
import hashlib
import json
import shutil
import struct
import subprocess
from datetime import datetime, timezone
from pathlib import Path

PORTFOLIO = Path(__file__).resolve().parents[1]
PROJECTS = PORTFOLIO.parent
STAGING = PROJECTS / '.captures-recovered'
OUTPUT = PORTFOLIO / 'public/media/projects'
PAIRS = {
    'deepfocus': [
        ('p1', 'timer', 'Running Android app: Pomodoro setup with duration presets and session tags, ready at 25:00.', 'Pomodoro selected; 25:00 READY; Timer navigation active. Readable, no records or private identifiers.'),
        ('p2', 'statistics', 'Running Android app: Performance Overview with zero sessions and an empty weekly activity chart.', 'Stats navigation active; 0m focus and 0 sessions. Distinct analytics view; readable and no private data.'),
    ],
    'sansfinance': [
        ('p1', 'dashboard', 'Running Android app: fresh empty dashboard with net worth, monthly cash flow and 30-day forecast.', 'Dashboard displays Rp0 for assets, liabilities, income, expense, cash flow and forecast; 0.00% savings. No private records.'),
        ('p2', 'transactions', 'Running Android app: empty Transactions view with period navigation and installment/recurring filters.', 'Transactions navigation active; zero totals and No data available for this period. Distinct readable list/filter view, no private data.'),
    ],
}

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(PROJECTS / repo), *args], text=True).strip()

entries = []
manifest = {}
for project, views in PAIRS.items():
    manifest[project] = []
    for stage, view, caption, review in views:
        source = STAGING / f'{project}-{stage}.png'
        target = OUTPUT / f'{project}-{view}.png'
        assert source.read_bytes()[:8] == b'\x89PNG\r\n\x1a\n'
        dimensions = struct.unpack('>II', source.read_bytes()[16:24])
        assert dimensions == (1080, 1920)
        old_hash = sha(target) if target.exists() else None
        shutil.copyfile(source, target)
        item = {'url': f'/media/projects/{target.name}', 'caption': caption}
        manifest[project].append(item)
        entries.append({
            'project': project, 'url': f'android://com.sans.{"finance" if project == "sansfinance" else project}/{view}',
            'path': str(target), 'caption': caption, 'manifestEntry': item,
            'sha256': sha(target), 'supersededSha256': old_hash, 'dimensions': list(dimensions),
            'provenance': 'Recaptured from actual running locally built APK because the existing pair had no recovered capture provenance.',
            'command': '/home/al/Android/Sdk/platform-tools/adb -s emulator-5582 exec-out screencap -p',
            'captureSource': str(source), 'capturedAt': datetime.fromtimestamp(source.stat().st_mtime, timezone.utc).isoformat(),
            'visualReview': {'tool': 'vision_analyze', 'result': 'accepted', 'notes': review},
            'privacyReview': 'New isolated AVD under ~/Projects/.captures-recovered/avd, started with -wipe-data -no-snapshot. No account login, backup/database imports or records seeded/submitted. No personal device accessed. No masks or source/UI modifications. Finance Wi-Fi/mobile data disabled before first launch; repository database snapshot never opened or imported.',
        })
assert len(entries) == 4 and len({e['sha256'] for e in entries}) == 4
rejected = []
for view in ['catalog', 'storage']:
    f = OUTPUT / f'indoscraping-{view}.png'
    rejected.append({'path': str(f), 'sha256': sha(f), 'visualReview': 'vision_analyze confirms terminal command output, not graphical application UI. Ineligible under user requirement. Existing file left unchanged; do not integrate.'})
evidence = {
    'reviewedAt': datetime.now(timezone.utc).isoformat(),
    'scope': ['deepfocus', 'indoscraping', 'sansfinance'],
    'counts': {'requestedProjects': 3, 'acceptedProjectsWithTwoDistinctViews': 2, 'acceptedImages': 4, 'noGraphicalUiProjects': 1},
    'captures': entries, 'manifestEntries': manifest,
    'sourceState': {p: {'head': git(p, 'rev-parse', 'HEAD'), 'preservedWorkingTree': git(p, 'status', '--short')} for p in ['deepfocus', 'indoscraping', 'sansfinance']},
    'runEvidence': {
        'emulator': {'name': 'recovered', 'serial': 'emulator-5582', 'systemImage': 'android-36.1/google_apis_playstore/x86_64', 'boot': 'sys.boot_completed=1', 'command': 'ANDROID_AVD_HOME=/home/al/Projects/.captures-recovered/avd ANDROID_HOME=/home/al/Android/Sdk /home/al/Android/Sdk/emulator/emulator -avd recovered -port 5582 -no-window -no-audio -no-snapshot -wipe-data -gpu swiftshader_indirect'},
        'deepfocus': {'build': 'ANDROID_HOME=/home/al/Android/Sdk ./gradlew :app:assembleDebug --console=plain', 'buildResult': 'exit 0; BUILD SUCCESSFUL in 23s; 37 tasks: 1 executed, 36 up-to-date', 'apkSha256': sha(PROJECTS / 'deepfocus/app/build/outputs/apk/debug/app-debug.apk'), 'install': 'adb -s emulator-5582 install -r app/build/outputs/apk/debug/app-debug.apk => Success', 'launch': 'adb -s emulator-5582 shell am start -W -n com.sans.deepfocus/.MainActivity => Status: ok', 'navigation': 'Capture timer, then adb shell input tap 810 1800 to Stats and capture; no session started.', 'tests': ':app:testDebugUnitTest exit 0, BUILD SUCCESSFUL; task UP-TO-DATE, not a fresh execution. Existing XML: 1 test, 0 failures/errors/skipped.'},
        'sansfinance': {'build': 'ANDROID_HOME=/home/al/Android/Sdk ./gradlew :app:assembleDebug --console=plain', 'buildResult': 'exit 0; BUILD SUCCESSFUL in 19s; 41 tasks up-to-date', 'apkSha256': sha(PROJECTS / 'sansfinance/app/build/outputs/apk/debug/app-debug.apk'), 'install': 'adb -s emulator-5582 install -r app/build/outputs/apk/debug/app-debug.apk => Success', 'launch': 'adb -s emulator-5582 shell am start -W -n com.sans.finance/.MainActivity => Status: ok, COLD, TotalTime 3676', 'navigation': 'Capture empty Dashboard, then adb shell input tap 403 1750 to Transactions and capture. No financial record created.', 'tests': ':app:testDebugUnitTest exit 0, BUILD SUCCESSFUL; task UP-TO-DATE, not a fresh execution. Existing XML: 97 tests across 27 suites, 0 failures/errors/skipped.'},
        'indoscraping': {'command': "uv run --no-sync pytest -o addopts='' -q", 'result': 'exit 0; 11 passed in 0.51s; no scraping run'},
    },
    'blockers': [{'project': 'indoscraping', 'status': 'no-ui', 'reason': 'Repository is a Rich CLI scraper suite, not a graphical app. Existing catalog/storage images are terminal output and cannot meet the requested GUI-only two-view requirement. No substitute frontend generated.', 'sourceEvidence': ['README.md lines 10, 21, 49-66 describe visual CLI', 'AGENTS.md lines 7-16 describe Rich command-line dashboard', 'pyproject.toml lines 58-59: indoscraping entry point', 'git ls-files *.html *.tsx *.jsx *.vue returned no frontend files'], 'rejectedAssets': rejected}],
    'issues': ['First UIAutomator dump failed with UiAutomationService already registered; retry succeeded and dashboard XML confirmed empty values. This was a dump-tool failure, not an app UI crash.', 'Sansfinance Gradle reports deprecated features incompatible with Gradle 10; build succeeds.', 'No source app bug fix requested or performed. Zero financial balances are the required genuine fresh-install state, not a bug to populate.'],
    'integration': 'Assets and this evidence only. Shared manifest/status/gallery untouched; parent must integrate four accepted entries and no-ui status. No deployment or gallery E2E claimed.',
}
path = PORTFOLIO / 'scripts/captures-recovered-existing.json'
path.write_text(json.dumps(evidence, indent=2) + '\n')
print(json.dumps({'evidence': str(path), 'counts': evidence['counts'], 'manifestEntries': manifest}, indent=2))
