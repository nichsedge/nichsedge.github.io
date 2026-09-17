import os
import sys
import time
import json
import sqlite3
import subprocess
from pathlib import Path
from datetime import datetime, timedelta

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public/media/projects"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

DEMO_DB = Path("/tmp/ierp_demo.sqlite")
if DEMO_DB.exists():
    DEMO_DB.unlink()

# 1. Initialize schema via ierp
env = os.environ.copy()
env["IERP_DB"] = str(DEMO_DB)

subprocess.run(["uv", "run", "ierp", "init"], cwd="/home/al/Projects/ierp", env=env, check=True)

# 2. Seed realistic demo data (anonymized/professional)
conn = sqlite3.connect(str(DEMO_DB))
cur = conn.cursor()

now = datetime.now()

# Seed events (scattered across recent months for heatmap)
events_data = [
    ("Architecture Review: BigQuery Data Lakehouse", "Bandung, West Java", (now - timedelta(days=2)).strftime("%Y-%m-%d 10:00:00"), json.dumps(["engineering", "architecture", "bigquery"])),
    ("Apache Airflow Pipeline Optimization", "Bandung, West Java", (now - timedelta(days=5)).strftime("%Y-%m-%d 14:30:00"), json.dumps(["airflow", "etl", "python"])),
    ("dbt Dimensional Modeling & CI Validation", "Remote Office", (now - timedelta(days=8)).strftime("%Y-%m-%d 09:00:00"), json.dumps(["dbt", "sql", "ci-cd"])),
    ("Tech Sync: High-Throughput Event Streaming", "Jakarta (Hybrid)", (now - timedelta(days=12)).strftime("%Y-%m-%d 16:00:00"), json.dumps(["kafka", "streaming", "devops"])),
    ("Personal Knowledge Graph Quartz v4 Sync", "Home Workstation", (now - timedelta(days=18)).strftime("%Y-%m-%d 20:00:00"), json.dumps(["knowledge", "quartz", "pkm"])),
    ("Quarterly Life Ops & Gadget Audit", "Home Workstation", (now - timedelta(days=25)).strftime("%Y-%m-%d 11:00:00"), json.dumps(["lifeops", "hardware", "audit"])),
    ("Sovereign Runway Review & Treasury Allocation", "Remote", (now - timedelta(days=32)).strftime("%Y-%m-%d 15:00:00"), json.dumps(["finance", "runway", "treasury"])),
    ("Deep Work: Rust Axiom Telemetry Daemon", "Home Workstation", (now - timedelta(days=40)).strftime("%Y-%m-%d 13:00:00"), json.dumps(["rust", "systems", "telemetry"])),
]

for d in range(1, 120, 2):
    t = now - timedelta(days=d)
    cur.execute(
        "INSERT INTO events (title, place, start_date, raw_date, tags, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (f"Engineering Focus Session #{d//2}", "Workspace", t.strftime("%Y-%m-%d 11:00:00"), t.strftime("%Y-%m-%d 11:00:00"), json.dumps(["engineering", "sprint"]), "Sprint milestone session")
    )

for title, place, date_str, tags in events_data:
    cur.execute(
        "INSERT INTO events (title, place, start_date, raw_date, tags, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (title, place, date_str, date_str, tags, f"Operational record for {title}")
    )

# Seed contacts
contacts = [
    ("Dr. Sarah Lin", "FinTech Systems", "Lead Architect", "Singapore", "sarah.lin@fintech.sg", "+65 8123 4567", "T1"),
    ("Marcus Vance", "Distributed Labs", "Principal Engineer", "London, UK", "marcus@distributedlabs.io", "+44 20 7946 0912", "T1"),
    ("Ahmad Fauzi", "Cloud Infrastructure Corp", "VP of Engineering", "Jakarta", "ahmad.fauzi@cloudinfra.co.id", "+62 811 2345 678", "T2"),
    ("Elena Rostova", "Algorithmic Quant Research", "Quant Researcher", "Zurich, CH", "elena@quantresearch.ch", "+41 44 668 1234", "T2"),
    ("Budi Pratama", "Modern Data Stack ID", "Community Organizer", "Bandung", "budi@mds-indonesia.org", "+62 812 3456 789", "T3"),
]
for name, org, client, loc, email, phone, tier in contacts:
    cur.execute(
        "INSERT INTO contacts (name, org, client, location, email, phone, tier, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (name, org, client, loc, email, phone, tier, f"Strategic contact ({org})")
    )

# Seed decisions
decisions = [
    ("Adopt SQLite with WAL Mode as Personal ERP SSOT", "Evaluating local-first database options for zero-latency journaling and local privacy.", "Adopted SQLite with WAL mode, foreign keys, and 5000ms busy timeout.", "Zero cloud subscription dependency, sub-millisecond query speed, and atomic backups to R2.", 9, "active"),
    ("Migrate Workstation Script Wrappers to uv", "Standardizing Python environments across workstation background daemons and scrapers.", "Adopted uv run exclusively with pyproject.toml inline scripts.", "Eliminated venv drift and multi-second startup overhead.", 8, "active"),
    ("Establish 36-Month Sovereign Capital Runway", "Risk mitigation against market downturns and career pivots.", "Set sovereign runway floor with conservative burn rate modeling.", "High career optionality and disciplined financial capital allocation.", 10, "active"),
]
for title, context, choice, expected, conf, status in decisions:
    cur.execute(
        "INSERT INTO decisions (title, context, choice, expected_outcome, confidence, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (title, context, choice, expected, conf, status, now.strftime("%Y-%m-%d %H:%M:%S"))
    )

# Seed projects
projects = [
    ("ierp-core", "ierp Core Engine", "Personal Enterprise Resource Planning system & CRM event log", "active", "high", (now - timedelta(days=60)).strftime("%Y-%m-%d")),
    ("lakehouse", "Distributed Lakehouse", "BigQuery and Airflow Kimball architecture for enterprise banking", "active", "high", (now - timedelta(days=90)).strftime("%Y-%m-%d")),
    ("sovereign-node", "Sovereign Cloud Node", "Encrypted R2 atomic sync and Tailscale workstation mesh", "completed", "medium", (now - timedelta(days=120)).strftime("%Y-%m-%d")),
]
for slug, title, desc, status, prio, start_d in projects:
    cur.execute(
        "INSERT INTO projects (slug, title, description, status, priority, start_date) VALUES (?, ?, ?, ?, ?, ?)",
        (slug, title, desc, status, prio, start_d)
    )

# Seed balance sheet & commitments for runway
cur.execute(
    "INSERT INTO networth_snapshots (snapshot_date, liquid_cash, investments, hard_assets, liabilities, currency, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    (now.strftime("%Y-%m-%d"), 320000000.0, 530000000.0, 0.0, 0.0, "IDR", "Quarterly calibration")
)
cur.execute(
    "INSERT INTO recurring_commitments (name, category, amount, currency, frequency, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ("Cloud & Fiber Infrastructure", "fixed", 1250000.0, "IDR", "monthly", "active", "Fiber broadband + VPS nodes")
)
cur.execute(
    "INSERT INTO recurring_commitments (name, category, amount, currency, frequency, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ("Sovereign Health & Wellness", "fixed", 2500000.0, "IDR", "monthly", "active", "Health insurance & sports")
)
cur.execute(
    "INSERT INTO recurring_commitments (name, category, amount, currency, frequency, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ("Nutritional Fuel & Life Ops", "variable", 5000000.0, "IDR", "monthly", "active", "Nutritious dining & essentials")
)

conn.commit()
conn.close()

print("Demo database successfully initialized and populated.")

# 3. Start ierp dashboard server on port 8766
server_process = subprocess.Popen(
    ["uv", "run", "ierp", "dashboard", "--port", "8766", "--no-browser"],
    cwd="/home/al/Projects/ierp",
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

time.sleep(2)

try:
    from playwright.sync_api import sync_playwright
    chrome_path = os.environ.get("CHROME_PATH", "/usr/bin/google-chrome-stable")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path=chrome_path)
        page = browser.new_page(viewport={"width": 1440, "height": 920})
        
        # Capture 1: Overview
        page.goto("http://localhost:8766/", wait_until="networkidle")
        page.wait_for_timeout(1500)
        overview_path = MEDIA_DIR / "ierp-overview.png"
        page.screenshot(path=str(overview_path))
        print(f"Captured: {overview_path}")
        
        # Capture 2: Decisions tab
        page.click("button:has-text('Decisions')")
        page.wait_for_timeout(1000)
        decisions_path = MEDIA_DIR / "ierp-decisions.png"
        page.screenshot(path=str(decisions_path))
        print(f"Captured: {decisions_path}")
        
        browser.close()
finally:
    server_process.terminate()
    server_process.wait()
    print("Server cleanly shut down.")
