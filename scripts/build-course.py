#!/usr/bin/env python3
"""Build www/index.html from the course sources.

Environment (set as GitHub repository secrets for CI builds):
  SUPABASE_URL        e.g. https://abcdxyz.supabase.co
  SUPABASE_ANON_KEY   the project's *anon / publishable* key (public by design; protected by RLS policies)
  ALLOW_LOCAL_MODE=1  build WITHOUT login/sync (practice only). Without it, a missing backend is a build error,
                      so you can never ship a classroom build with the login accidentally missing.
"""
import hashlib, json, os, re, sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = (root / 'course/original.html').read_text(encoding='utf-8')

def replace(old, new, count=None):
    global src
    if old not in src:
        raise SystemExit('Course source changed, cannot patch: ' + old[:90])
    src = src.replace(old, new) if count is None else src.replace(old, new, count)

# ---- behaviour fixes carried over from the previous build ----
replace("en: p[3].trim()", "en: p.slice(3).join('|').trim()")
replace("S.grammarDone[ex.dataset.key] = 1; STORE.save();", "if(ok) S.grammarDone[ex.dataset.key] = 1; recordPracticeActivity('grammar', ok); STORE.save();")
replace("m.seen++;", "m.seen++; recordPracticeActivity(S.lastView || 'vocabulary', q >= 1);")
replace("if(w) updateMastery(vocabKey(w), ok ? 2 : 0);", "if(w) updateMastery(vocabKey(w), ok ? 2 : 0); else recordPracticeActivity(ex.skill || 'session', ok);")
replace("if(q.vocab) updateMastery(vocabKey(q.vocab), ok ? 2 : 0);", "if(q.vocab) updateMastery(vocabKey(q.vocab), ok ? 2 : 0); else recordPracticeActivity(q.skill || 'quiz', ok);")
replace("S.sessionHistory.filter(s => s.date === new Date().toISOString().slice(0,10)).reduce((a,b) => a + b.questions, 0)", "practiceSnapshot().today")
replace("new Date().toISOString().slice(0,10)", "localStudyDate()")
replace("new Date(Date.now() - 86400000).toISOString().slice(0,10)", "localStudyDate(new Date(Date.now() - 86400000))")
replace("new Date(d.setDate(diff)).toISOString().slice(0,10)", "localStudyDate(new Date(d.setDate(diff)))")
replace("sessionState.results.push({correct:true}); sessionState.idx++;", "recordPracticeActivity('mistakes', true); sessionState.results.push({correct:true}); sessionState.idx++;")
replace("setTimeout(() => { sessionState.idx++; renderSessionCard($('#view')); }, 900);", "const nextButton = document.createElement('button'); nextButton.className='btn small'; nextButton.textContent='Next →'; nextButton.onclick=()=>{ sessionState.idx++; renderSessionCard($('#view')); }; body.appendChild(nextButton);")
replace("setTimeout(() => { quizState.idx++; quizState.answered = false; renderQuiz(); }, 1100);", "const nextButton = document.createElement('button'); nextButton.className='btn small'; nextButton.textContent='Next →'; nextButton.onclick=()=>{ quizState.idx++; quizState.answered=false; renderQuiz(); }; $('#feedback').appendChild(nextButton);")
replace("function renderSessionExercise(body, ex, w){", "function renderSessionExercise(body, ex, w){ delete body.dataset.done;")
replace("if(p.store) localStorage.setItem(STORE.key, JSON.stringify(p.store)); alert(", "if(p.store){ localStorage.setItem(STORE.key, JSON.stringify(p.store)); markSystemEvent('import'); } alert(")
replace("localStorage.removeItem(STORE.key); location.reload();", "localStorage.removeItem(STORE.key); markSystemEvent('reset'); location.reload();")

# ---- v8 engine hooks ----
# sentence builder: case-insensitive, accepts every valid word order supplied by the generator
replace("const ok = user === correct;",
        "const norm = s => String(s).toLowerCase().replace(/[.!?]+$/,'').replace(/\\s+/g,' ').trim(); "
        "const ok = norm(user) === norm(correct) || (item.accept || []).some(a => norm(a) === norm(user)); "
        "if(!$('#sbCheck').dataset.logged){ recordPracticeActivity('sentence', ok); $('#sbCheck').dataset.logged = '1'; }")
# adaptive statistics for generated grammar exercises (session + exam)
replace("sessionState.results.push({correct:ok});", "if(window.EX) EX.record(ex, ok); sessionState.results.push({correct:ok});")
replace("const correct = results.filter(r => r.ok).length;", "results.forEach(r => { recordPracticeActivity(r.q.skill || 'exam', r.ok); if(window.EX) EX.record(r.q, r.ok); }); const correct = results.filter(r => r.ok).length;")
# new routes (account / admin); admin view is only reachable for verified admins and RLS protects the data anyway
replace("connectors:viewConnectors, collocations:viewCollocations, compare:viewCompare", "connectors:viewConnectors, collocations:viewCollocations, compare:viewCompare, account:(window.viewAccount||viewHome), admin:(window.viewAdmin||viewHome)")
src = src.replace('<title>Sprachtreppe — German A1–B1 Master Course v5.4</title>', '<title>Sprachtreppe — German A1–B1</title>')
src = src.replace('<title>German A1–B1 · Offline Master Course v5.3</title>', '<title>Sprachtreppe — German A1–B1</title>')
src = src.replace('A1→B1 · v5.4', 'A1→B1 · v8')

# ---- backend config ----
url = os.environ.get('SUPABASE_URL', '').strip().rstrip('/')
key = os.environ.get('SUPABASE_ANON_KEY', '').strip()
local = os.environ.get('ALLOW_LOCAL_MODE', '') in ('1', 'true', 'yes')
cfg_file = root / 'course/config.local.json'
if (not url or not key) and cfg_file.exists():
    c = json.loads(cfg_file.read_text()); url = url or c.get('url', ''); key = key or c.get('key', '')
if url or key:
    if not re.fullmatch(r'https://[a-z0-9-]+\\.supabase\\.(co|in)', url):
        raise SystemExit('SUPABASE_URL must look like https://<project>.supabase.co')
    if len(key) < 30 or 'service_role' in key.lower():
        raise SystemExit('SUPABASE_ANON_KEY missing or invalid. NEVER put the service_role key in the app.')
    if key.count('.') == 2:
        import base64
        try:
            payload = json.loads(base64.urlsafe_b64decode(key.split('.')[1] + '==='))
            if payload.get('role') != 'anon':
                raise SystemExit('This key has role "%s". Only the anon (public) key may be bundled in the app.' % payload.get('role'))
        except SystemExit: raise
        except Exception: pass
    config = {'url': url, 'key': key, 'syncDays': 7, 'warnDays': 5}
    mode = 'ACCOUNTS + WEEKLY SYNC enabled'
elif local:
    config = {}; mode = 'LOCAL MODE (no login, no sync)'
else:
    raise SystemExit('No backend configured. Set SUPABASE_URL and SUPABASE_ANON_KEY (GitHub: Settings → Secrets and variables → Actions), '
                     'or set ALLOW_LOCAL_MODE=1 to build a practice-only app without login.')

# ---- bundle ----
parts = [(root / 'course' / f).read_text(encoding='utf-8') for f in
         ['enhancements.js', 'content-expansion.js', 'german-core.js', 'exercises-v8.js', 'reading-writing-v8.js', 'engine-v8.js', 'password-recovery.js', 'auth-sync.js']]
theme = (root / 'course/theme.css').read_text(encoding='utf-8')
shim = (root / 'course/native-shim.js').read_text(encoding='utf-8')
cfg_js = 'window.SP_CONFIG=' + json.dumps(config) + ';\n'
replace('</head>', '<style>' + theme + '</style><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon-192.png"><meta name="mobile-web-app-capable" content="yes"><meta name="theme-color" content="#1e6feb"></head>', 1)
replace("$('#themeBtn').onclick =", cfg_js + '\n'.join(parts) + "\n$('#themeBtn').onclick =", 1)
i = src.rindex('</body>')
src = src[:i] + '<script>' + shim + '</script>' + src[i:]

out = Path(os.environ.get('SP_OUT_DIR') or (root / 'www'))
out.mkdir(parents=True, exist_ok=True)
(out / 'index.html').write_text(src, encoding='utf-8')
# service-worker cache name changes with every build so updates reach installed apps
build_id = hashlib.sha1(src.encode('utf-8')).hexdigest()[:10]
sw = (root / 'web-assets/sw.js').read_text().replace('__BUILD__', build_id)
(out / 'sw.js').write_text(sw, encoding='utf-8')
for f in ['manifest.webmanifest']:
    (out / f).write_text((root / 'web-assets' / f).read_text())
(out / 'icons').mkdir(exist_ok=True)
for p in (root / 'web-assets/icons').glob('*.png'):
    (out / 'icons' / p.name).write_bytes(p.read_bytes())
print('Built www/index.html (%d KB) — %s — build %s' % (len(src) // 1024, mode, build_id))
