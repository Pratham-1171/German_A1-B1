#!/usr/bin/env python3
"""Run the normal course build, then inject the mobile-first LMS layer."""
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
subprocess.run(["python3", str(root / "scripts/build-course.py")], check=True)
out = root / "www" / "index.html"
lms = (root / "course" / "lms-ui.js").read_text(encoding="utf-8")
src = out.read_text(encoding="utf-8")
old = "connectors:viewConnectors, collocations:viewCollocations, compare:viewCompare"
new = old + ", classroom:(window.viewClassroom||viewHome), assignments:(window.viewAssignments||viewHome), announcements:(window.viewAnnouncements||viewHome), audit:(window.viewAudit||viewHome)"
if old not in src:
    raise SystemExit("Could not locate the course route registry")
src = src.replace(old, new, 1)
marker = "</body>"
if marker not in src:
    raise SystemExit("Could not locate </body>")
src = src.replace(marker, "<script>" + lms + "</script>" + marker, 1)
out.write_text(src, encoding="utf-8")
print("Injected mobile LMS UI into www/index.html")
