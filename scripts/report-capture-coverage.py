"""Regenerate the coverage checklist from repository metadata and manifests."""
import json
from collections import Counter
from pathlib import Path
root = Path(__file__).resolve().parents[1]
repos = json.loads((root/'data/github_repos_all.json').read_text())['repos']
manifest = json.loads((root/'data/project-screenshots.json').read_text())
statuses = json.loads((root/'data/project-capture-status.json').read_text())
rows = ['# Project screenshot coverage', '', 'Two distinct actual running-app views per eligible UI project. Archived repositories and forks are excluded. No-UI decisions cite repository evidence; launch failures are blocked, not no-UI.', '', '| Project | Status | Reason / evidence |', '|---|---|---|']
counts = Counter()
for repo in sorted(repos, key=lambda r:r['name'].lower()):
    if repo['private'] or repo['owner_login'] != 'nichsedge':
        continue
    name = repo['name']
    record = statuses.get(name, {})
    status = 'excluded' if repo['fork'] or repo['archived'] else 'captured' if len(manifest.get(name, [])) >= 2 else record.get('status', 'pending')
    counts[status] += 1
    reason = 'Archived or forked' if status == 'excluded' else f'{len(manifest[name])} screenshots in data/project-screenshots.json' if status == 'captured' else record.get('reason', 'UI inspection / capture pending')
    if record.get('evidence'):
        reason += f" [Evidence]({record['evidence']})"
    rows.append(f'| {name} | {status} | {reason} |')
(root/'docs').mkdir(exist_ok=True)
(root/'docs/project-capture-coverage.md').write_text('\n'.join(rows)+'\n')
print(dict(counts))
