/* Source module: views-learning.js
 * Main learning screens.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
function viewHome(el){
  const total = VOCAB.length;
  const mastered = Object.keys(S.mastery).filter(k => k.startsWith('v') && (S.mastery[k].status === 'MASTERED' || S.mastery[k].status === 'STRONG')).length;
  const due = dueCount();
  const streak = S.streak.current;
  const dailyGoal = S.settings.dailyGoal || 20;
  const todayDone = S.sessionHistory.filter(s => s.date === new Date().toISOString().slice(0,10)).reduce((a,b) => a + b.questions, 0);
  const goalPct = Math.min(100, pct(todayDone, dailyGoal));
  const mistakeCount = Object.keys(S.mistakes).length;
  el.innerHTML = `
    <div class="today-dash">
      <div class="streak-badge">🔥 ${streak} ${t('stat_streak')}</div>
      <h3>${t('home_title')}</h3>
      <div class="td-sub">${t('home_desc')}</div>
      <div style="font-size:12.5px;opacity:.9;margin-bottom:6px">Today: ${todayDone} / ${dailyGoal}</div>
      <div class="goal-bar"><i style="width:${goalPct}%"></i></div>
      <div class="td-stats">
        <span>📚 ${mastered}/${total}</span>
        <span>🧠 ${due} ${t('stat_due')}</span>
        <span>❌ ${mistakeCount}</span>
      </div>
    </div>
    <div class="row" style="margin-bottom:14px">
      <button class="btn grow" id="quickStart">⚡ ${t('session_start')}</button>
      <button class="btn ghost" id="quickReview">🧠 ${t('review_start')}</button>
    </div>
    <h3>${t('study_modules')}</h3>
    <div class="grid">
      <button class="tile" data-go="session"><span class="t-ico">⚡</span><span class="t-name">Session</span><span class="t-desc">Infinite guided</span></button>
      <button class="tile" data-go="review"><span class="t-ico">🧠</span><span class="t-name">Smart Review</span><span class="t-desc">Due + mistakes</span></button>
      <button class="tile" data-go="vocab"><span class="t-ico">📚</span><span class="t-name">Vocabulary</span><span class="t-desc">${total} words</span></button>
      <button class="tile" data-go="grammar"><span class="t-ico">📖</span><span class="t-name">Grammar</span><span class="t-desc">A1 / A2 / B1</span></button>
      <button class="tile" data-go="quiz"><span class="t-ico">🎯</span><span class="t-name">Quiz</span><span class="t-desc">Infinite modes</span></button>
      <button class="tile" data-go="verbs"><span class="t-ico">🔥</span><span class="t-name">Verbs</span><span class="t-desc">Usage + freq</span></button>
      <button class="tile" data-go="connectors"><span class="t-ico">🔗</span><span class="t-name">Connectors</span><span class="t-desc">${CONNECTORS.length} rules</span></button>
      <button class="tile" data-go="collocations"><span class="t-ico">🧱</span><span class="t-name">Collocations</span><span class="t-desc">${COLLOCATIONS.length} phrases</span></button>
      <button class="tile" data-go="compare"><span class="t-ico">⚖️</span><span class="t-name">Verb Compare</span><span class="t-desc">${VERB_COMPARISONS.length} pairs</span></button>
      <button class="tile" data-go="flash"><span class="t-ico">🧠</span><span class="t-name">Flashcards</span><span class="t-desc">SRS</span></button>
      <button class="tile" data-go="mistakes"><span class="t-ico">❌</span><span class="t-name">Mistakes</span><span class="t-desc">${mistakeCount}</span></button>
      <button class="tile" data-go="sentence"><span class="t-ico">🧩</span><span class="t-name">Sentences</span><span class="t-desc">Infinite</span></button>
      <button class="tile" data-go="spelling"><span class="t-ico">✏️</span><span class="t-name">Spelling</span><span class="t-desc">Infinite</span></button>
      <button class="tile" data-go="dictation"><span class="t-ico">📝</span><span class="t-name">Dictation</span><span class="t-desc">Infinite</span></button>
      <button class="tile" data-go="families"><span class="t-ico">🌳</span><span class="t-name">Word Families</span><span class="t-desc">${WORD_FAMILIES.length}</span></button>
      <button class="tile" data-go="listen"><span class="t-ico">🎧</span><span class="t-name">Listening</span><span class="t-desc">Generated ∞</span></button>
      <button class="tile" data-go="speak"><span class="t-ico">🎤</span><span class="t-name">Speaking</span><span class="t-desc">Generated ∞</span></button>
      <button class="tile" data-go="read"><span class="t-ico">📕</span><span class="t-name">Reading</span><span class="t-desc">Generated ∞</span></button>
      <button class="tile" data-go="write"><span class="t-ico">✍️</span><span class="t-name">Writing</span><span class="t-desc">Generated ∞</span></button>
      <button class="tile" data-go="exam"><span class="t-ico">🎓</span><span class="t-name">Exam</span><span class="t-desc">Timed</span></button>
      <button class="tile" data-go="progress"><span class="t-ico">📊</span><span class="t-name">Progress</span><span class="t-desc">Statistics</span></button>
      <button class="tile" data-go="settings"><span class="t-ico">⚙️</span><span class="t-name">Settings</span><span class="t-desc">Preferences</span></button>
    </div>`;
  el.querySelectorAll('[data-go]').forEach(b => b.onclick = () => location.hash = '#/' + b.dataset.go);
  $('#quickStart').onclick = () => location.hash = '#/session';
  $('#quickReview').onclick = () => location.hash = '#/review';
}

/* ============================================================
   SESSION
   ============================================================ */
let sessionState = {active:false, results:[], startTime:0, queue:[], idx:0, total:0};

function viewSession(el){
  if(sessionState.active){ renderSessionCard(el); return; }
  el.innerHTML = `<h2>${t('session_title')}</h2><p class="sub">Infinite guided mix of review + practice.</p>
    <div class="card"><h4 style="margin-top:0">Session length</h4>
      <div class="chipgroup">${[10,15,30,45].map(n => `<button data-len="${n}" class="${(S.settings.sessionLen||15)===n?'active':''}">${n} min</button>`).join('')}</div>
    </div>
    <div class="card"><h4 style="margin-top:0">Preview</h4>
      <div class="mini-muted" style="line-height:1.8">
        🎯 Warm-up review<br>
        🧠 Due vocabulary (${dueCount()})<br>
        ❌ Mistake practice (${Object.keys(S.mistakes).length})<br>
        📚 New words · 📖 Grammar · 🎧 Listening · 🎤 Speaking
      </div>
    </div>
    <button class="btn" id="startSession" style="width:100%">${t('session_start')}</button>`;
  el.querySelectorAll('[data-len]').forEach(b => b.onclick = () => {
    S.settings.sessionLen = parseInt(b.dataset.len, 10); STORE.save();
    el.querySelectorAll('[data-len]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  });
  $('#startSession').onclick = () => {
    sessionState = {active:true, results:[], startTime:Date.now(), queue:[], idx:0, total:0};
    // Build a mix: 5 due, 3 mistakes, 5 new, 3 grammar, 1 listening, 1 speaking
    const dueWords = dueWordKeys().map(k => VOCAB.find(w => 'v'+w.n === k)).filter(Boolean);
    const mistakes = Object.values(S.mistakes).sort((a,b) => b.count - a.count);
    const queue = [];
    const warm = dueWords.length ? dueWords.slice(0, 5) : shuffle(VOCAB).slice(0, 5);
    warm.forEach(w => queue.push({kind:'vocab', w}));
    mistakes.slice(0, 3).forEach(m => queue.push({kind:'mistake', m}));
    shuffle(VOCAB.filter(w => !S.mastery['v'+w.n] || S.mastery['v'+w.n].status === 'NEW')).slice(0, 5).forEach(w => queue.push({kind:'vocab', w}));
    for(let i = 0; i < 3; i++) queue.push({kind:'generated', ex: generateExercise({skill:'mixed', level:'A2', difficulty:'mixed'})});
    queue.push({kind:'generated', ex: generateExercise({skill:'listening', level:'A2', difficulty:'normal'})});
    queue.push({kind:'generated', ex: generateExercise({skill:'sentence', level:'A2', difficulty:'normal'})});
    sessionState.queue = shuffle(queue);
    sessionState.total = queue.length;
    renderSessionCard(el);
  };
}

function renderSessionCard(el){
  if(sessionState.idx >= sessionState.total){ renderSessionSummary(el); return; }
  const item = sessionState.queue[sessionState.idx];
  el.innerHTML = `<div class="session-progress">${Array.from({length: sessionState.total}, (_, i) =>
    `<div class="sp-dot ${i < sessionState.idx ? 'done' : i === sessionState.idx ? 'current' : ''}"></div>`).join('')}</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:8px">Step ${sessionState.idx+1} of ${sessionState.total} · ${item.kind}</div>
    <div id="sessionBody"></div>`;
  const body = $('#sessionBody');
  if(item.kind === 'vocab'){
    const w = item.w;
    const ex = generateVocabExercise('de-en', [w, ...shuffle(VOCAB).slice(0,20)]);
    renderSessionExercise(body, ex, w);
  } else if(item.kind === 'mistake'){
    const m = item.m;
    body.innerHTML = `<div class="session-card"><div class="sc-type">Mistake review</div>
      <div style="font-size:15px;margin:8px 0">${esc(m.prompt)}</div>
      <div class="mini-muted">Your last: <span style="color:var(--warn)">${esc(m.userAnswer)}</span></div>
      <div class="mini-muted">Correct: <span style="color:var(--ok)">${esc(m.correctAnswer)}</span></div>
      <div class="mini-muted" style="margin-top:6px">${esc(m.explanation||'')}</div>
      <div class="row" style="margin-top:10px"><button class="btn good" id="sOk">✓ Got it</button></div></div>`;
    $('#sOk').onclick = () => {
      sessionState.results.push({correct:true}); sessionState.idx++;
      addStudyTime(20); renderSessionCard(el);
    };
  } else if(item.kind === 'generated'){
    renderSessionExercise(body, item.ex, null);
  }
}

function renderSessionExercise(body, ex, w){
  body.innerHTML = `<div class="session-card">
    <div class="sc-type">${ex.skill || 'practice'}</div>
    <div style="font-size:16px;margin:8px 0;line-height:1.5">${ex.promptHTML}</div>
    <div id="sOpts">${ex.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
    <div class="fb" style="margin-top:10px;font-size:13px"></div>
  </div>`;
  wireSpeakers(body);
  if(ex.autoPlay) speakGerman(ex.autoPlay);
  const fb = body.querySelector('.fb');
  body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if(body.dataset.done) return;
    body.dataset.done = '1';
    const ok = b.dataset.v === ex.correct;
    body.querySelectorAll('.opt').forEach(x => { x.disabled = true; if(x.dataset.v === ex.correct) x.classList.add('correct'); else if(x === b) x.classList.add('wrong'); });
    fb.textContent = (ok ? '✅ ' : '❌ Correct: ' + ex.correct + '. ') + (ex.explanation || '');
    fb.style.color = ok ? 'var(--ok)' : 'var(--warn)';
    if(w) updateMastery(vocabKey(w), ok ? 2 : 0);
    if(!ok) recordMistake({type:'session', topic:ex.topic||ex.skill, prompt:ex.prompt, userAnswer:b.dataset.v, correctAnswer:ex.correct, explanation:ex.explanation, sourceId:ex.sourceId});
    sessionState.results.push({correct:ok});
    addStudyTime(15);
    setTimeout(() => { sessionState.idx++; renderSessionCard($('#view')); }, 900);
  });
}

function renderSessionSummary(el){
  const total = sessionState.results.length;
  const correct = sessionState.results.filter(r => r.correct).length;
  const accuracy = pct(correct, total);
  const duration = Math.floor((Date.now() - sessionState.startTime) / 1000);
  S.studyTime.sessions = (S.studyTime.sessions || 0) + 1;
  S.sessionHistory.push({date:new Date().toISOString().slice(0,10), questions:total, correct, duration});
  if(S.sessionHistory.length > 200) S.sessionHistory = S.sessionHistory.slice(-200);
  touchStreak(); STORE.save(); checkAchievements();
  sessionState.active = false;
  el.innerHTML = `<h2>${t('session_complete')}</h2>
    <div class="card" style="text-align:center"><div style="font-size:44px;font-weight:800;color:var(--accent)">${accuracy}%</div><div class="mini-muted">Accuracy</div></div>
    <div class="stats">
      <div class="stat"><div class="n">${correct}/${total}</div><div class="l">Correct</div></div>
      <div class="stat"><div class="n">${Math.floor(duration/60)}:${String(duration%60).padStart(2,'0')}</div><div class="l">Time</div></div>
      <div class="stat"><div class="n">${Object.keys(S.mistakes).length}</div><div class="l">Mistakes</div></div>
    </div>
    <div class="row"><button class="btn" id="toReview">Review mistakes</button><button class="btn ghost" id="finish">Finish</button></div>`;
  $('#toReview').onclick = () => location.hash = '#/review';
  $('#finish').onclick = () => location.hash = '#/home';
}

/* ============================================================
   REVIEW / MISTAKES
   ============================================================ */
function viewReview(el){
  const due = dueWordKeys().map(k => VOCAB.find(w => 'v'+w.n === k)).filter(Boolean);
  const mistakes = Object.values(S.mistakes).sort((a,b) => b.count - a.count).slice(0, 10);
  const weak = VOCAB.filter(w => { const m = S.mastery['v'+w.n]; return m && (m.status === 'LEARNING' || m.status === 'FAMILIAR'); }).slice(0, 10);
  el.innerHTML = `<h2>${t('review_title')}</h2><p class="sub">Due cards, mistakes, weak areas.</p>
    <button class="btn" id="startReview" style="width:100%;margin-bottom:14px">${t('review_start')}</button>
    <h3>Due today (${due.length})</h3>
    <div class="card">${due.length ? `<div class="vlist">${due.slice(0, 6).map(w => vocabRowHTML(w)).join('')}</div>` : `<div class="empty">Nothing due — great!</div>`}</div>
    <h3>Top mistakes (${mistakes.length})</h3>
    <div class="card">${mistakes.length ? mistakes.slice(0, 4).map(m => mistakeCardHTML(m)).join('') : `<div class="empty">${t('mistakes_empty')}</div>`}</div>
    <h3>Weak words (${weak.length})</h3>
    <div class="card">${weak.length ? `<div class="vlist">${weak.slice(0, 4).map(w => vocabRowHTML(w)).join('')}</div>` : `<div class="empty">—</div>`}</div>`;
  wireSpeakers(el);
  el.querySelectorAll('.bookmark').forEach(b => {
    b.onclick = e => { e.stopPropagation(); const n = b.dataset.n; if(S.bookmarked[n]) delete S.bookmarked[n]; else S.bookmarked[n] = 1; STORE.save(); b.classList.toggle('on'); b.textContent = S.bookmarked[n] ? '★' : '☆'; };
  });
  $('#startReview').onclick = () => {
    sessionState = {active:true, results:[], startTime:Date.now(), queue:[], idx:0, total:0};
    const queue = [];
    due.slice(0, 10).forEach(w => queue.push({kind:'vocab', w}));
    weak.slice(0, 5).forEach(w => queue.push({kind:'vocab', w}));
    mistakes.slice(0, 5).forEach(m => queue.push({kind:'mistake', m}));
    sessionState.queue = queue.length ? queue : shuffle(VOCAB).slice(0, 10).map(w => ({kind:'vocab', w}));
    sessionState.total = sessionState.queue.length;
    location.hash = '#/session';
    setTimeout(() => { if(sessionState.active) renderSessionCard($('#view')); }, 50);
  };
}

function mistakeCardHTML(m){
  const key = m.type + '::' + (m.sourceId || m.prompt);
  return `<div class="mistake-card">
    <div class="mc-prompt">${esc(m.prompt)}</div>
    <div><span class="mc-user">Your: ${esc(m.userAnswer||'—')}</span></div>
    <div><span class="mc-correct">✓ ${esc(m.correctAnswer||'—')}</span></div>
    ${m.explanation ? `<div class="mini-muted" style="margin-top:4px">${esc(m.explanation)}</div>` : ''}
    <div class="mc-meta"><span>${esc(m.topic||m.type)}</span><span>× ${m.count}</span>
      <button class="btn small ghost" data-clear="${esc(key)}">Mark understood</button></div>
  </div>`;
}
function viewMistakes(el){
  const mistakes = Object.values(S.mistakes).sort((a,b) => b.count - a.count);
  el.innerHTML = `<h2>${t('mistakes_title')}</h2><p class="sub">Sorted by frequency.</p>
    ${mistakes.length ? `<button class="btn ghost" id="clearAll" style="margin-bottom:12px">🗑 Clear all</button>` : ''}
    <div>${mistakes.length ? mistakes.map(m => mistakeCardHTML(m)).join('') : `<div class="empty">${t('mistakes_empty')}</div>`}</div>`;
  el.querySelectorAll('[data-clear]').forEach(b => b.onclick = () => {
    clearMistake(b.dataset.clear); viewMistakes(el);
  });
  if($('#clearAll')) $('#clearAll').onclick = () => { clearAllMistakes(); viewMistakes(el); };
}

/* ============================================================
   VOCAB
   ============================================================ */
let vocabState = {q:'', topic:'all', art:'all', level:'all'};
function viewVocab(el){
  el.innerHTML = `<h2>📚 Vocabulary</h2><p class="sub">${VOCAB.length} words</p>
    <div class="card">
      <input type="search" id="vq" placeholder="${t('vocab_search')}" value="${esc(vocabState.q)}">
      <div class="row mt">
        <select id="vtopic" class="grow"><option value="all">${t('all_topics')}</option>${TOPIC_NAMES.map(x => `<option value="${esc(x)}" ${vocabState.topic===x?'selected':''}>${esc(x)}</option>`).join('')}</select>
        <select id="vart" style="width:auto"><option value="all">${t('all_articles')}</option><option value="der" ${vocabState.art==='der'?'selected':''}>der</option><option value="die" ${vocabState.art==='die'?'selected':''}>die</option><option value="das" ${vocabState.art==='das'?'selected':''}>das</option></select>
        <select id="vlevel" style="width:auto"><option value="all">${t('all_levels')}</option><option value="A1" ${vocabState.level==='A1'?'selected':''}>A1</option><option value="A2" ${vocabState.level==='A2'?'selected':''}>A2</option><option value="B1" ${vocabState.level==='B1'?'selected':''}>B1</option></select>
      </div>
      <div class="mt row" style="justify-content:space-between">
        <span style="font-size:13px;color:var(--muted)" id="vcount"></span>
        <button class="btn small ghost" id="playAll">🔊 Play first 10</button>
      </div>
    </div>
    <div id="vlist" class="vlist"></div>`;
  const q = $('#vq'), topicSel = $('#vtopic'), a = $('#vart'), l = $('#vlevel');
  let currentList = [];
  const render = () => {
    vocabState.q = q.value.trim().toLowerCase();
    vocabState.topic = topicSel.value; vocabState.art = a.value; vocabState.level = l.value;
    const list = VOCAB.filter(w => {
      if(vocabState.topic!=='all' && w.topic!==vocabState.topic) return false;
      if(vocabState.art!=='all' && w.art!==vocabState.art) return false;
      if(vocabState.level!=='all' && w.level!==vocabState.level) return false;
      if(vocabState.q){
        const s = vocabState.q;
        const syn = SYNONYMS.find(x => x.word === w.de);
        const synText = syn ? syn.syn.map(x => x[0]).join(' ') : '';
        const opp = OPPOSITES.filter(p => p[0] === w.de || p[2] === w.de).map(p => p.join(' ')).join(' ');
        const hay = [w.de, w.en, guOf(w.de) || '', synText, opp].join(' ').toLowerCase();
        if(!hay.includes(s)) return false;
      }
      return true;
    });
    currentList = list;
    $('#vcount').textContent = `${list.length} shown`;
    const wrap = $('#vlist');
    if(!list.length){ wrap.innerHTML = `<div class="empty">${t('no_words')}</div>`; return; }
    wrap.innerHTML = list.slice(0, 400).map(w => vocabRowHTML(w)).join('') +
      (list.length > 400 ? `<div class="empty">Showing first 400 of ${list.length}.</div>` : '');
    wrap.querySelectorAll('.bookmark').forEach(b => {
      b.onclick = e => { e.stopPropagation(); const n = b.dataset.n; if(S.bookmarked[n]) delete S.bookmarked[n]; else S.bookmarked[n] = 1; STORE.save(); b.classList.toggle('on'); b.textContent = S.bookmarked[n] ? '★' : '☆'; };
    });
    wireSpeakers(wrap);
  };
  q.oninput = render; topicSel.onchange = render; a.onchange = render; l.onchange = render; render();
  $('#playAll').onclick = () => {
    const toPlay = currentList.slice(0, 10);
    if(!toPlay.length || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    toPlay.forEach(w => {
      const text = (w.art && w.art !== '-' ? w.art + ' ' : '') + w.de;
      const u = new SpeechSynthesisUtterance(text); u.lang='de-DE'; u.rate=S.settings.speechRate;
      const v = getGermanVoice(); if(v) u.voice=v; speechSynthesis.speak(u);
    });
    trackAudioPlay();
  };
}
function vocabRowHTML(w){
  const bm = S.bookmarked[w.n] ? '★' : '☆';
  const speakText = (w.art && w.art !== '-' ? w.art + ' ' : '') + w.de;
  const m = getMastery('v'+w.n);
  return `<div class="vrow">
    <span class="vnum">#${w.n}</span>
    <div><div class="vde">${artHTML(w.art)}${esc(w.de)} <span class="mastery-chip mastery-${m.status}">${m.status}</span></div>
    <div style="font-size:11.5px;color:var(--muted);margin-top:2px"><span class="tag ${w.level}">${w.level}</span> <span style="margin-left:6px">${esc(w.topic)}</span></div></div>
    <div class="ven">
      <button class="speak-btn" data-speak="${esc(speakText)}">🔊</button>
      <span style="flex:1">${esc(meaningFull(w))}</span>
      <button class="bookmark ${S.bookmarked[w.n]?'on':''}" data-n="${w.n}">${bm}</button>
    </div>
  </div>`;
}

/* ============================================================
   ARTICLES
   ============================================================ */
let artState = {filter:'der', q:''};
function viewArticles(el){
  const nouns = VOCAB.filter(w => ['der','die','das'].includes(w.art));
  const counts = {der: nouns.filter(n => n.art === 'der').length, die: nouns.filter(n => n.art === 'die').length, das: nouns.filter(n => n.art === 'das').length};
  el.innerHTML = `<h2>📖 Articles</h2><p class="sub">${counts.der + counts.die + counts.das} nouns</p>
    <div class="stats" style="margin-bottom:14px">
      <div class="stat"><div class="n">${counts.der}</div><div class="l">der</div></div>
      <div class="stat"><div class="n">${counts.die}</div><div class="l">die</div></div>
      <div class="stat"><div class="n">${counts.das}</div><div class="l">das</div></div>
    </div>
    <div class="card"><div class="row">
      <button class="btn ${artState.filter==='der'?'':'ghost'}" data-art="der">der</button>
      <button class="btn ${artState.filter==='die'?'':'ghost'}" data-art="die">die</button>
      <button class="btn ${artState.filter==='das'?'':'ghost'}" data-art="das">das</button>
      <button class="btn small good" id="artPractice">⚡ Practice ∞</button>
    </div></div>
    <div class="art-browse" id="artList"></div>`;
  el.querySelectorAll('[data-art]').forEach(b => b.onclick = () => { artState.filter=b.dataset.art; viewArticles(el); });
  $('#artPractice').onclick = () => {
    quizState.mode = 'article'; quizState.count = 20; quizState.difficulty = 'normal';
    buildQuizQueue('article', 20, 'normal');
    location.hash = '#/quiz';
    setTimeout(() => renderQuiz(), 60);
  };
  const list = nouns.filter(n => n.art === artState.filter).slice(0, 200);
  const wrap = $('#artList');
  wrap.innerHTML = list.length ? list.map(n => `<div class="vrow" style="grid-template-columns:auto 1fr auto"><span class="art ${n.art}">${n.art}</span><div><div class="vde">${esc(n.de)}</div><div class="ven" style="text-align:left;justify-content:flex-start"><span>${esc(meaningFull(n))}</span></div></div><button class="speak-btn" data-speak="${esc(n.art+' '+n.de)}">🔊</button></div>`).join('') : `<div class="empty">${t('no_words')}</div>`;
  wireSpeakers(wrap);
}

/* ============================================================
   FLASHCARDS
   ============================================================ */
let flashState = {queue:[], idx:0, flipped:false};
function buildFlashQueue(){
  const due = dueWordKeys().map(k => VOCAB.find(w => 'v'+w.n === k)).filter(Boolean);
  flashState.queue = due.length ? shuffle(due) : shuffle(VOCAB).slice(0, 30);
  flashState.idx = 0; flashState.flipped = false;
}
function viewFlash(el){
  if(!flashState.queue.length) buildFlashQueue();
  el.innerHTML = `<h2>🧠 Flashcards</h2><p class="sub">SRS flashcards. Rate how well you knew it.</p>
    <div class="flash-wrap" id="flashWrap"></div>
    <div id="flashSrs" class="srs-buttons hidden">
      <button class="srs-btn again" data-q="0"><span class="srs-emoji">😵</span>Again</button>
      <button class="srs-btn hard" data-q="1"><span class="srs-emoji">😕</span>Hard</button>
      <button class="srs-btn good" data-q="2"><span class="srs-emoji">🙂</span>Good</button>
      <button class="srs-btn easy" data-q="3"><span class="srs-emoji">😎</span>Easy</button>
    </div>
    <div class="row mt" style="justify-content:center" id="flashRevealRow">
      <button class="btn ghost" id="fprev">← Prev</button>
      <button class="btn" id="freveal">Reveal</button>
      <button class="btn ghost" id="fnext">Next →</button>
    </div>
    <div class="center mt" style="color:var(--muted);font-size:13px" id="fcount"></div>`;
  $('#fprev').onclick = () => { if(flashState.idx > 0){ flashState.idx--; flashState.flipped = false; renderFlash(); } };
  $('#fnext').onclick = () => nextFlash();
  $('#freveal').onclick = () => { flashState.flipped = true; renderFlash(); };
  el.querySelectorAll('.srs-btn').forEach(b => b.onclick = () => {
    const w = flashState.queue[flashState.idx]; if(!w) return;
    updateMastery(vocabKey(w), +b.dataset.q);
    nextFlash();
  });
  renderFlash();
}
function renderFlash(){
  const wrap = $('#flashWrap'), total = flashState.queue.length;
  if(!total){ wrap.innerHTML = `<div class="empty">No cards.</div>`; return; }
  if(flashState.idx >= total) flashState.idx = 0;
  const w = flashState.queue[flashState.idx];
  const speakText = (w.art && w.art !== '-' ? w.art + ' ' : '') + w.de;
  const m = getMastery('v'+w.n);
  wrap.innerHTML = `<div class="flash ${flashState.flipped?'flipped':''}" id="flashCard">
    <div class="face front"><div class="big">${artHTML(w.art)}${esc(w.de)}</div><div class="small">Tap to reveal</div><div class="small" style="margin-top:12px">${esc(w.topic)} · ${w.level} · <span class="mastery-chip mastery-${m.status}">${m.status}</span></div></div>
    <div class="face back"><div class="big-en">${esc(meaningFull(w))}</div><div class="small">${artHTML(w.art)}${esc(w.de)}</div></div></div>
    <div class="center mt">${speakerBtn(speakText)}</div>`;
  $('#flashCard').onclick = e => { if(e.target.classList.contains('speak-btn'))return; flashState.flipped = !flashState.flipped; renderFlash(); };
  $('#fcount').textContent = `${flashState.idx+1} / ${total}`;
  wireSpeakers(wrap);
  if(flashState.flipped){ $('#flashSrs').classList.remove('hidden'); $('#flashRevealRow').classList.add('hidden'); }
  else { $('#flashSrs').classList.add('hidden'); $('#flashRevealRow').classList.remove('hidden'); }
  if(!flashState.flipped && S.settings.autoPlay) speakGerman(speakText);
}
function nextFlash(){ flashState.idx = (flashState.idx + 1) % flashState.queue.length; flashState.flipped = false; renderFlash(); }

/* ============================================================
   QUIZ — INFINITE
   ============================================================ */
let quizState = {mode:'article', queue:[], idx:0, score:0, answered:false, count:20, difficulty:'normal'};

const QUIZ_MODES = {
  article:     {label:'📖 Article', gen:(d) => generateVocabExercise('article', null, d)},
  de_en:       {label:'DE → EN', gen:(d) => generateVocabExercise('de-en', null, d)},
  en_de:       {label:'EN → DE', gen:(d) => generateVocabExercise('en-de', null, d)},
  opposite:    {label:'↔️ Opposites', gen:(d) => generateVocabExercise('opposite', null, d)},
  synonym:     {label:'📚 Synonyms', gen:(d) => generateVocabExercise('synonym', null, d)},
  listen:      {label:'🎧 Listening', gen:(d) => EXERCISE_REGISTRY.listening({level:'A2', difficulty:'normal'})},
  grammar:     {label:'📖 Grammar', gen:(d) => generateGrammarExerciseLadder('A2', 'normal')},
  connector:   {label:'🔗 Connectors', gen:(d) => generateConnectorExercise(rPick(CONNECTORS))},
  collocation: {label:'🧱 Collocations', gen:(d) => generateCollocationExercise(rPick(COLLOCATIONS))},
  compare:     {label:'⚖️ Compare', gen:(d) => generateComparisonExercise(rPick(VERB_COMPARISONS))},
  verbusage:   {label:'🔥 Verb usage', gen:(d) => generateVerbUsageExercise()},
  sentence:    {label:'🧩 Sentence', gen:(d) => EXERCISE_REGISTRY.sentence({level:'A2', difficulty:'normal'})},
  mixed:       {label:'🎲 Mixed', gen:(d) => EXERCISE_REGISTRY.mixed({level:'A2', difficulty:'normal'})}
};

function buildQuizQueue(mode, count, difficulty){
  const gen = (QUIZ_MODES[mode] || QUIZ_MODES.article).gen;
  const d = diffN(difficulty);
  quizState.queue = [];
  for(let i = 0; i < count; i++) quizState.queue.push(gen(d));
  quizState.idx = 0; quizState.score = 0; quizState.answered = false;
}

function viewQuiz(el){
  const modes = Object.keys(QUIZ_MODES);
  el.innerHTML = `<h2>${t('quiz_title')}</h2><p class="sub">${t('quiz_sub')}</p>
    <div class="card"><div class="row" style="gap:6px">
      ${modes.map(k => `<button class="btn small ${quizState.mode===k?'':'ghost'}" data-mode="${k}">${QUIZ_MODES[k].label}</button>`).join('')}
    </div></div>
    ${setupPanelHTML('quiz', quizState.count, quizState.difficulty)}
    <button class="btn" id="quizStart" style="width:100%">▶ Start (infinite)</button>
    <div id="quizBox" style="margin-top:14px"></div>`;
  el.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { quizState.mode = b.dataset.mode; viewQuiz(el); });
  wireSetupPanel(el, (group, val) => {
    if(group === 'count') quizState.count = +val;
    if(group === 'difficulty') quizState.difficulty = val;
  });
  $('#quizStart').onclick = () => {
    const setup = readSetupPanel(el, 'quiz');
    quizState.count = setup.count;
    quizState.difficulty = setup.difficulty;
    buildQuizQueue(quizState.mode, setup.count, setup.difficulty);
    renderQuiz();
  };
}

function renderQuiz(){
  const box = $('#quizBox');
  if(!quizState.queue.length){ box.innerHTML = ''; return; }
  if(quizState.idx >= quizState.queue.length){
    // Refill — infinite
    const more = quizState.count || 20;
    const gen = (QUIZ_MODES[quizState.mode] || QUIZ_MODES.article).gen;
    const d = diffN(quizState.difficulty);
    for(let i = 0; i < more; i++) quizState.queue.push(gen(d));
  }
  const q = quizState.queue[quizState.idx];
  box.innerHTML = `<div class="card"><div class="qstat">
      <span>${t('question_of', quizState.idx + 1, quizState.queue.length)}</span>
      <span>${t('score_label', quizState.score)}</span>
    </div>
    <div style="font-size:16px;margin:8px 0 14px;line-height:1.5">${q.promptHTML}</div>
    <div id="opts">${q.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
    <div id="feedback" class="mt" style="font-size:13.5px;color:var(--muted)"></div>
    <button class="btn small ghost mt" id="quizStop">⏹ Stop</button>
  </div>`;
  box.querySelectorAll('.opt').forEach(b => b.onclick = () => answerQuiz(b, q));
  $('#quizStop').onclick = () => {
    quizState.queue = [];
    box.innerHTML = `<div class="card center"><h3>Stopped</h3><div class="mini-muted">You answered <b>${quizState.idx}</b> questions, ${quizState.score} correct.</div><button class="btn" id="again" style="margin-top:10px">New session</button></div>`;
    $('#again').onclick = () => viewQuiz($('#view'));
  };
  wireSpeakers(box);
}

function answerQuiz(btn, q){
  if(quizState.answered) return;
  quizState.answered = true;
  const ok = btn.dataset.v === q.correct;
  if(ok) quizState.score++;
  $$('#opts .opt').forEach(b => { b.disabled = true; if(b.dataset.v === q.correct) b.classList.add('correct'); else if(b === btn) b.classList.add('wrong'); });
  $('#feedback').innerHTML = ok ? '✅ Correct!' : `❌ Correct: <b>${esc(q.correct)}</b>. ${esc(q.explanation || '')}`;
  if(q.vocab) updateMastery(vocabKey(q.vocab), ok ? 2 : 0);
  if(!ok) recordMistake({type:q.skill || 'quiz', topic:q.topic || q.skill, prompt:q.prompt, userAnswer:btn.dataset.v, correctAnswer:q.correct, explanation:q.explanation, sourceId:q.sourceId});
  setTimeout(() => { quizState.idx++; quizState.answered = false; renderQuiz(); }, 1100);
}

/* ============================================================
   VERBS
   ============================================================ */
let verbTab = 'detail', verbDetailOpen = null;
function viewVerbs(el){
  el.innerHTML = `<h2>${t('verbs_title')}</h2><p class="sub">Conjugations, prefixes, usage, frequency.</p>
    <div class="card"><div class="row">
      <button class="btn ${verbTab==='detail'?'':'ghost'}" data-tab="detail">Detailed</button>
      <button class="btn ${verbTab==='usage'?'':'ghost'}" data-tab="usage">Usage & Frequency</button>
    </div></div><div id="verbBody"></div>`;
  el.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { verbTab = b.dataset.tab; verbDetailOpen = null; viewVerbs(el); });
  const body = $('#verbBody');
  if(verbTab === 'detail'){
    body.innerHTML = VERB_DETAILS.map((v,i) => `<div class="card" style="cursor:pointer" data-vidx="${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div><div style="font-weight:700;font-size:16px">${esc(v.infinitive)} <span class="tag ${v.level}">${v.level}</span></div>
        <div style="color:var(--muted);font-size:13px;margin-top:3px">${esc(v.meaning)}</div></div>
        ${speakerBtn(v.infinitive)}
      </div>
      ${VERB_USAGE[v.infinitive] ? `<div style="font-size:11.5px;color:var(--gold);margin-top:5px;font-weight:700">${VERB_USAGE[v.infinitive].band}</div>` : ''}
    </div>`).join('');
    body.querySelectorAll('[data-vidx]').forEach(c => c.onclick = e => { if(e.target.classList.contains('speak-btn'))return; verbDetailOpen = VERB_DETAILS[+c.dataset.vidx]; renderVerbDetail(body); });
    wireSpeakers(body);
  } else {
    const keys = Object.keys(VERB_USAGE);
    body.innerHTML = keys.map(k => {
      const u = VERB_USAGE[k];
      return `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div><div style="font-weight:750;font-size:18px">${esc(k)} ${speakerBtn(k, 16)}</div>
        <div style="color:var(--accent2);font-size:14px;font-weight:600;margin-top:2px">${esc(u.meaning)}</div></div>
        <div style="font-size:12px;color:var(--gold);font-weight:800">${u.band}</div>
      </div>
      <h4>Common contexts</h4><ul style="margin:6px 0 0 20px;padding:0;font-size:13.5px;line-height:1.7">${u.contexts.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
      <h4>Patterns</h4><ul style="margin:6px 0 0 20px;padding:0;font-size:13.5px;line-height:1.7">${u.patterns.map(p => `<li>${esc(p)} ${speakerBtn(p, 11)}</li>`).join('')}</ul>
      ${u.alt && u.alt.length ? `<h4>Alternatives</h4><div class="row">${u.alt.map(a => `<span class="pill">${esc(a)}</span>`).join('')}</div>` : ''}
      <div class="cmp-note" style="margin-top:10px">💡 ${esc(u.note)}</div></div>`;
    }).join('');
    wireSpeakers(body);
  }
}
function renderVerbDetail(body){
  const v = verbDetailOpen; if(!v) return;
  const u = VERB_USAGE[v.infinitive];
  body.innerHTML = `<button class="btn small ghost" id="verbBack">← Back</button>
    <div class="card" style="margin-top:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div><div style="font-weight:750;font-size:20px">${esc(v.infinitive)} <span class="tag ${v.level}">${v.level}</span></div>
        <div style="color:var(--accent2);font-size:15px;font-weight:600;margin-top:4px">${esc(v.meaning)}</div></div>
        ${speakerBtn(v.infinitive, 18)}
      </div>
      ${u ? `<div style="font-size:12px;color:var(--gold);font-weight:800;margin-top:8px">${u.band}</div>` : ''}
      <h4>Präsens</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;margin:6px 0">
        ${Object.entries(v.praesens).map(([pr,form]) => `<div style="background:var(--bg);border-radius:8px;padding:8px 10px;font-size:13px"><b>${pr}:</b> ${esc(form)}</div>`).join('')}
      </div>
      <h4>Präteritum & Perfekt</h4>
      <div class="mini-muted">Prät.: <b>${esc(v.praeteritum)}</b> · Perfekt: <b>${esc(v.perfekt)}</b> (aux: ${esc(v.auxiliary)})</div>
      <h4>Examples</h4>
      <ul style="list-style:none;padding:0;margin:6px 0">${v.examples.map(([de,en]) => `<li style="background:var(--bg);border-radius:7px;padding:8px 10px;margin-bottom:5px;display:flex;justify-content:space-between;gap:8px"><div><b>${esc(de)}</b><span style="display:block;font-size:12.5px;color:var(--muted)">${esc(en)}</span></div>${speakerBtn(de)}</li>`).join('')}</ul>
      ${u ? `<h4>Common contexts</h4><ul style="margin:6px 0 0 20px;padding:0;font-size:13.5px;line-height:1.7">${u.contexts.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
    </div>`;
  $('#verbBack').onclick = () => { verbDetailOpen = null; viewVerbs($('#view')); };
  wireSpeakers(body);
}

/* ============================================================
   PRONUNCIATION
   ============================================================ */
function viewPronounce(el){
  el.innerHTML = `<h2>${t('nav_pronounce').replace(/^[^ ]+ /,'')}</h2><p class="sub">${PRONUNCIATION_RULES.length} rules.</p>
    <div class="card"><button class="btn small" id="testVoice">🔊 Test voice</button></div>
    <div>${PRONUNCIATION_RULES.map(r => `<div class="card"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
      <span style="font-size:22px;font-weight:800;color:var(--accent);background:var(--bg);padding:4px 12px;border-radius:8px">${esc(r.letter)}</span>
      <span style="font-size:14px;font-weight:700;color:var(--accent2)">${esc(r.sound)}</span></div>
      <div class="mini-muted">${esc(r.context)}</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;margin-top:8px">${r.examples.map(([de,en]) => `<div style="background:var(--bg);border-radius:7px;padding:7px 10px;font-size:13px;display:flex;align-items:center;gap:6px"><b style="flex:1">${esc(de)}</b><span class="mini-muted">${esc(en)}</span>${speakerBtn(de, 11)}</div>`).join('')}</div>
      <div class="mini-muted" style="margin-top:8px;font-style:italic">💡 ${esc(r.note)}</div>
    </div>`).join('')}</div>`;
  $('#testVoice').onclick = () => speakGerman('Guten Tag. Ich heiße Anna. Wie geht es dir?');
  wireSpeakers(el);
}

/* ============================================================
   SYNONYMS / PATTERNS
   ============================================================ */
let synState = {tab:'opposites'};
function viewSynonyms(el){
  el.innerHTML = `<h2>↔️ Opposites & Synonyms</h2>
    <div class="row" style="margin-bottom:12px">
      <button class="btn ${synState.tab==='opposites'?'':'ghost'}" data-tab="opposites">↔️ Gegenteil (${OPPOSITES.length})</button>
      <button class="btn ${synState.tab==='synonyms'?'':'ghost'}" data-tab="synonyms">📚 Synonyme (${SYNONYMS.length})</button>
    </div>
    <div id="synList"></div>`;
  el.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { synState.tab = b.dataset.tab; viewSynonyms(el); });
  const wrap = $('#synList');
  if(synState.tab === 'opposites'){
    wrap.innerHTML = OPPOSITES.map(([d1,e1,d2,e2]) => `<div style="background:var(--card);border:1px solid var(--line);border-radius:11px;padding:10px 12px;margin-bottom:6px;display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center">
      <div style="display:flex;align-items:center;gap:6px"><button class="speak-btn" data-speak="${esc(d1)}">🔊</button><span style="font-weight:650">${esc(d1)}<span style="display:block;font-size:11.5px;color:var(--muted);font-weight:400">${esc(e1)}</span></span></div>
      <div style="color:var(--accent);font-weight:800">↔</div>
      <div style="display:flex;align-items:center;gap:6px;justify-content:flex-end;text-align:right"><span style="font-weight:650">${esc(d2)}<span style="display:block;font-size:11.5px;color:var(--muted);font-weight:400">${esc(e2)}</span></span><button class="speak-btn" data-speak="${esc(d2)}">🔊</button></div>
    </div>`).join('');
  } else {
    wrap.innerHTML = SYNONYMS.map(s => `<div style="background:var(--card);border:1px solid var(--line);border-radius:11px;padding:10px 12px;margin-bottom:6px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
        <button class="speak-btn" data-speak="${esc(s.word)}">🔊</button>
        <b>${esc(s.word)}</b><span class="mini-muted">${esc(s.en)}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">${s.syn.map(([de,en]) => `<span class="pill"><button class="speak-btn" data-speak="${esc(de)}" style="min-width:20px;min-height:20px;padding:1px;font-size:10px;margin-right:4px">🔊</button>${esc(de)}<span class="mini-muted" style="font-size:11px"> · ${esc(en)}</span></span>`).join('')}</div>
    </div>`).join('');
  }
  wireSpeakers(wrap);
}
function viewPatterns(el){
  el.innerHTML = `<h2>${t('patterns_title')}</h2><p class="sub">${PATTERNS.length} frames.</p>
    ${PATTERNS.map(p => `<div class="card"><div style="font-size:11px;font-weight:800;color:var(--accent)">#${p[0]}</div>
      <div style="font-weight:750;font-size:15.5px;margin:4px 0 6px">${esc(p[1])}</div>
      <div class="mini-muted" style="font-size:12.5px;margin-bottom:7px">${esc(p[2])}</div>
      <div style="background:var(--bg);border-left:3px solid var(--accent2);border-radius:6px;padding:8px 12px;font-style:italic;font-size:13.5px;display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
        <div style="flex:1">${esc(p[3])}<b style="display:block;font-style:normal;color:var(--muted);font-size:12px;margin-top:4px">${esc(p[4])}</b></div>
        ${speakerBtn(p[3])}
      </div>
    </div>`).join('')}`;
  wireSpeakers(el);
}

/* ============================================================
   GRAMMAR — INFINITE PRACTICE
   ============================================================ */
function viewGrammar(el){
  let activeLevel = 'all';
  const render = () => {
    const sections = activeLevel === 'all' ? GRAMMAR_DATA : GRAMMAR_DATA.filter(g => g.level === activeLevel);
    el.innerHTML = `<h2>${t('grammar_title')}</h2><p class="sub">Rules, examples, mistakes, exercises.</p>
      <div class="card"><div class="row">
        <button class="btn ${activeLevel==='all'?'':'ghost'}" data-lvl="all">All</button>
        <button class="btn ${activeLevel==='A1'?'':'ghost'}" data-lvl="A1">A1</button>
        <button class="btn ${activeLevel==='A2'?'':'ghost'}" data-lvl="A2">A2</button>
        <button class="btn ${activeLevel==='B1'?'':'ghost'}" data-lvl="B1">B1</button>
        <button class="btn small good" id="grammarPractice">⚡ Practice ∞</button>
      </div></div>
      ${sections.map(sec => `<h3>${esc(sec.level)} · ${esc(sec.title)}</h3>${sec.items.map((it,idx) => grammarCardHTML(sec.level, idx, it)).join('')}`).join('')}`;
    el.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => { activeLevel = b.dataset.lvl; render(); });
    el.querySelectorAll('.g-exercise').forEach(ex => {
      const correct = +ex.dataset.correct;
      ex.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if(ex.dataset.done) return; ex.dataset.done = '1';
        const ok = +b.dataset.i === correct;
        ex.querySelectorAll('.opt').forEach(x => { x.disabled = true; if(+x.dataset.i === correct) x.classList.add('correct'); else if(x === b) x.classList.add('wrong'); });
        const fb = ex.querySelector('.fb');
        fb.textContent = (ok ? '✅ ' : '❌ Correct: ') + ex.dataset.why;
        fb.style.background = ok ? 'rgba(22,163,74,.12)' : 'rgba(225,29,72,.10)';
        S.grammarDone[ex.dataset.key] = 1; STORE.save();
        if(!ok) recordMistake({type:'grammar', topic:ex.dataset.key, prompt:ex.querySelector('.q').textContent, userAnswer:ex.querySelectorAll('.opt')[+b.dataset.i].textContent, correctAnswer:ex.querySelectorAll('.opt')[correct].textContent, explanation:ex.dataset.why, sourceId:ex.dataset.key});
      });
    });
    wireSpeakers(el);
    const gp = $('#grammarPractice');
    if(gp) gp.onclick = () => {
      quizState.mode = 'grammar'; quizState.count = 20; quizState.difficulty = 'normal';
      buildQuizQueue('grammar', 20, 'normal');
      location.hash = '#/quiz';
      setTimeout(() => renderQuiz(), 60);
    };
  };
  render();
}
function grammarCardHTML(level, idx, it){
  const key = level + '_' + idx;
  const done = S.grammarDone[key] ? `<span class="tag" style="background:rgba(22,163,74,.15);color:var(--ok);margin-left:8px">DONE</span>` : '';
  return `<div class="card">
    <div style="font-weight:750;font-size:16px">${esc(it.title)}${done}</div>
    <div style="font-size:13.5px;line-height:1.65;margin:8px 0">${esc(it.explanation)}</div>
    <div style="background:linear-gradient(135deg,rgba(30,111,235,.08),rgba(13,148,136,.08));border-left:4px solid var(--accent);border-radius:8px;padding:12px 14px;font-family:ui-monospace,Menlo,monospace;font-size:13.5px;line-height:1.7;white-space:pre-wrap;margin:10px 0;overflow-x:auto">${esc(it.rule)}</div>
    <div style="font-size:11.5px;font-weight:800;color:var(--muted);margin-top:12px">EXAMPLES</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0">${it.examples.map(([de,en]) => `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:9px 12px;background:var(--bg);border-radius:8px;font-size:13.5px;align-items:center"><div style="font-weight:600;display:flex;align-items:center;gap:6px">${esc(de)}${speakerBtn(de, 11)}</div><div class="mini-muted" style="font-size:12.5px">${esc(en)}</div></div>`).join('')}</div>
    <div style="font-size:11.5px;font-weight:800;color:var(--warn);margin-top:12px">COMMON MISTAKES</div>
    <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0">${it.mistakes.map(([bad,good]) => `<div style="display:grid;grid-template-columns:auto 1fr;gap:10px;padding:9px 12px;background:rgba(225,29,72,.06);border-radius:8px;font-size:13px;align-items:center"><div style="color:var(--warn);font-weight:600">${esc(bad)}</div><div style="color:var(--ok);font-weight:600">${esc(good)}</div></div>`).join('')}</div>
    <div class="g-exercise" data-correct="${it.exercise.correct}" data-key="${esc(key)}" data-why="${esc(it.exercise.why)}" style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:12px 0">
      <div style="font-weight:650;font-size:14px;margin-bottom:10px">✏️ ${esc(it.exercise.q)}</div>
      ${it.exercise.options.map((o,i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}
      <div class="fb" style="margin-top:10px;font-size:13px;padding:8px 10px;border-radius:7px"></div>
    </div>
  </div>`;
}

/* ============================================================
   LISTENING — INFINITE
   ============================================================ */
let listenState = {current: null};
function viewListen(el){
  if(!listenState.current) listenState.current = generateDialogueTask();
  const d = listenState.current;
  S.listeningsDone = (S.listeningsDone||0) + 1; STORE.save(); checkAchievements();
  el.innerHTML = `<h2>${t('listen_title')}</h2><p class="sub">Generated dialogue · infinite practice</p>
    <div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <span class="tag ${d.level}">${d.level}</span>
        <button class="btn small" id="listenNew">🔄 New dialogue</button>
      </div>
      <div style="font-weight:750;font-size:16px">${esc(d.title)}</div>
      <div class="mini-muted" style="margin-top:3px">${esc(d.setting)}</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin:14px 0;padding:14px;background:var(--bg);border-radius:12px">
        <div class="row" style="margin-bottom:6px">
          <button class="btn small" id="listenPlay">🔊 Play all</button>
          <button class="btn small ghost" id="listenStop">⏸ Stop</button>
          <button class="btn small ghost" id="listenToggle">👁 Show transcript</button>
        </div>
        ${d.lines.map(l => `<div class="listen-line" style="display:grid;grid-template-columns:80px 1fr auto;gap:10px;padding:8px 10px;border-radius:8px;font-size:14px;align-items:start">
          <div style="font-weight:700;color:var(--accent);font-size:12.5px">${esc(l.sp)}</div>
          <div>${esc(l.de)}<span style="display:block;font-size:12.5px;color:var(--muted);margin-top:3px;font-style:italic">${esc(l.en)}</span></div>
          ${speakerBtn(l.de)}
        </div>`).join('')}
      </div>
    </div>
    <h3>Comprehension</h3>
    <div class="card">${d.questions.map((q, qi) => `<div class="g-exercise" data-correct="${esc(q.correct)}" data-key="ld-${qi}" style="background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:12px 0">
      <div style="font-weight:650;font-size:14px;margin-bottom:10px">${esc(q.q)}</div>
      ${q.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}
      <div class="fb" style="margin-top:10px;font-size:13px;padding:8px 10px;border-radius:7px"></div>
    </div>`).join('')}</div>`;
  $('#listenPlay').onclick = () => {
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const v = getGermanVoice();
    d.lines.forEach(l => {
      const u = new SpeechSynthesisUtterance(l.de);
      u.lang = 'de-DE'; u.rate = S.settings.speechRate || 0.9;
      if(v) u.voice = v;
      speechSynthesis.speak(u);
    });
    trackAudioPlay();
  };
  $('#listenStop').onclick = () => { if('speechSynthesis' in window) speechSynthesis.cancel(); };
  let hidden = false;
  $('#listenToggle').onclick = () => {
    hidden = !hidden;
    el.querySelectorAll('.listen-line > div:nth-child(2)').forEach(l => l.style.filter = hidden ? 'blur(6px)' : '');
    $('#listenToggle').textContent = hidden ? '👁 Show transcript' : '🙈 Hide transcript';
  };
  $('#listenNew').onclick = () => { listenState.current = null; viewListen(el); };
  el.querySelectorAll('.g-exercise').forEach(ex => {
    const correct = ex.dataset.correct;
    ex.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if(ex.dataset.done) return; ex.dataset.done = '1';
      const ok = b.dataset.v === correct;
      ex.querySelectorAll('.opt').forEach(x => { x.disabled = true; if(x.dataset.v === correct) x.classList.add('correct'); else if(x === b) x.classList.add('wrong'); });
      ex.querySelector('.fb').textContent = ok ? '✅ Correct!' : '❌ Correct: ' + correct;
      if(!ok) recordMistake({type:'listening', topic:'dialogue', prompt:ex.querySelector('div').textContent, userAnswer:b.dataset.v, correctAnswer:correct, explanation:'From dialogue'});
    });
  });
  wireSpeakers(el);
}

/* ============================================================
   SPEAKING — INFINITE
   ============================================================ */
let speakState = {current: null};
function viewSpeak(el){
  if(!speakState.current) speakState.current = generateSpeakingTask();
  const s = speakState.current;
  el.innerHTML = `<h2>${t('speak_title')}</h2><p class="sub">Generated task · infinite practice</p>
    <div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <span class="tag ${s.level}">${s.level}</span>
        <button class="btn small" id="speakNew">🔄 New task</button>
      </div>
      <div style="font-weight:750;font-size:16px">${esc(s.title)}</div>
      <div style="font-size:11.5px;font-weight:800;color:var(--accent);margin-top:14px">SENTENCE PATTERNS</div>
      <ul style="margin:6px 0 0 20px;padding:0;font-size:13.5px;line-height:1.75">${s.patterns.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      <div style="font-size:11.5px;font-weight:800;color:var(--accent);margin-top:14px">VOCABULARY</div>
      <div class="row" style="margin-top:4px">${s.vocab.map(v => `<span class="pill">${esc(v)}</span>`).join('')}</div>
      <div style="font-size:11.5px;font-weight:800;color:var(--accent);margin-top:14px">MODEL ANSWER</div>
      <div style="font-size:14.5px;line-height:1.6;padding:14px;border-radius:12px;background:var(--bg);border:1px solid var(--line);margin:6px 0;display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div style="flex:1">${esc(s.model)}</div>${speakerBtn(s.model)}
      </div>
      <div style="font-size:11.5px;font-weight:800;color:var(--accent);margin-top:14px">SELF-CHECK</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">${s.checklist.map(c => `<label style="padding:10px;border:1px solid var(--line);border-radius:9px;font-size:12.5px;background:var(--bg);cursor:pointer;display:flex;gap:8px;align-items:flex-start"><input type="checkbox" style="width:18px;height:18px;accent-color:var(--accent)"> ${esc(c)}</label>`).join('')}</div>
    </div>`;
  $('#speakNew').onclick = () => { speakState.current = null; viewSpeak(el); };
  wireSpeakers(el);
}

/* ============================================================
   READING — INFINITE
   ============================================================ */
let readState = {current: null};
function viewRead(el){
  if(!readState.current) readState.current = generateReadingTask();
  const r = readState.current;
  el.innerHTML = `<h2>${t('read_title')}</h2><p class="sub">Generated passage · infinite practice</p>
    <div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <span class="tag ${r.level}">${r.level}</span>
        <div class="row" style="margin:0">
          <button class="btn small" id="readNew">🔄 New passage</button>
          <button class="btn small ghost" id="readAloud">🔊 Read aloud</button>
        </div>
      </div>
      <div style="font-weight:750;font-size:17px;margin-bottom:10px">${esc(r.title)}</div>
      <div style="line-height:1.75;font-size:14.5px">${r.text.split(/(?<=[.!?])\s+/).map(s => `<p style="margin-bottom:10px">${esc(s)}</p>`).join('')}</div>
    </div>
    <h3>Comprehension</h3>
    <div class="card">${r.qs.map(([q,a],i) => `<div style="margin-top:14px"><div style="font-weight:650;margin-bottom:8px;font-size:14px">${i+1}. ${esc(q)}</div>
      <button class="btn small ghost" data-a="${i}">Show answer</button>
      <div class="hidden" id="ans-${i}" style="margin-top:8px;color:var(--accent2);font-weight:600">${esc(a)}</div>
    </div>`).join('')}</div>`;
  el.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
    const d = $('#ans-'+b.dataset.a);
    d.classList.toggle('hidden');
    b.textContent = d.classList.contains('hidden') ? 'Show answer' : 'Hide answer';
  });
  $('#readAloud').onclick = () => speakGerman(r.text, 0.85);
  $('#readNew').onclick = () => { readState.current = null; viewRead(el); };
}

/* ============================================================
   WRITING — INFINITE
   ============================================================ */
let writeState = {current: null, text: ''};
function viewWrite(el){
  if(!writeState.current) writeState.current = generateWritingTask();
  const task = writeState.current;
  el.innerHTML = `<h2>${t('write_title')}</h2><p class="sub">Generated task · infinite practice</p>
    <div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        <span class="tag ${task.level}">${task.level}</span>
        <button class="btn small" id="writeNew">🔄 New task</button>
      </div>
      <div style="font-weight:750;font-size:16px">${esc(task.title)}</div>
      <div class="mini-muted" style="margin:6px 0 10px">${esc(task.prompt)}</div>
      <div style="font-size:11.5px;font-weight:800;color:var(--accent)">REQUIRED</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin:10px 0">${task.required.map(r => `<label style="display:flex;gap:10px;padding:9px 12px;border:1px solid var(--line);border-radius:9px;background:var(--bg);font-size:13px;align-items:center"><input type="checkbox" style="width:18px;height:18px;accent-color:var(--accent)"> ${esc(r)}</label>`).join('')}</div>
      <textarea id="wPad" placeholder="Schreibe hier…" style="min-height:180px;padding:14px;font-size:14.5px;line-height:1.6;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);width:100%">${esc(writeState.text)}</textarea>
      <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin:6px 0"><span>Words: <b id="wCount">0</b></span><span>Target: <b>${task.minWords}+</b></span></div>
      <div class="row"><button class="btn" id="wCheck">🔍 Check</button><button class="btn ghost" id="wModel">📄 Model</button></div>
      <div id="wFb" class="mt" style="font-size:13.5px"></div>
      <div id="wModelBox" class="hidden mt"><div style="font-size:11.5px;font-weight:800;color:var(--accent2);display:flex;justify-content:space-between;align-items:center">MODEL ${speakerBtn(task.model, 12)}</div>
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.65;background:var(--bg);border-left:3px solid var(--accent2);border-radius:6px;padding:11px 13px;margin-top:6px;overflow-x:auto">${esc(task.model)}</pre>
      </div>
    </div>`;
  const pad = $('#wPad');
  const update = () => { writeState.text = pad.value; const w = pad.value.trim() ? pad.value.trim().split(/\s+/).length : 0; $('#wCount').textContent = w; };
  pad.oninput = update; update();
  $('#wModel').onclick = () => $('#wModelBox').classList.toggle('hidden');
  $('#writeNew').onclick = () => { writeState.current = null; writeState.text = ''; viewWrite(el); };
  $('#wCheck').onclick = () => {
    const text = pad.value.trim(); const words = text ? text.split(/\s+/).length : 0; const fb = $('#wFb');
    if(!text){ fb.innerHTML = '⚠️ Write something first.'; return; }
    const issues = [];
    if(words < task.minWords) issues.push(`Text has ${words} words; target is ${task.minWords}+.`);
    if(!/^[A-ZÄÖÜ]/.test(text)) issues.push('Start with a capital letter.');
    if(!/[,.;!?]/.test(text)) issues.push('Add punctuation.');
    fb.innerHTML = `<div style="padding:10px 12px;border-radius:9px;background:${issues.length?'rgba(225,29,72,.08)':'rgba(22,163,74,.10)'}"><b>${issues.length ? '📝 Feedback' : '✅ Looking good!'}</b><div style="margin-top:6px">Words: ${words} / target ${task.minWords}+</div>${issues.length ? `<ul style="margin:8px 0 0 18px;padding:0">${issues.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}</div>`;
  };
  wireSpeakers(el);
}

/* ============================================================
   CONNECTORS / COLLOCATIONS / COMPARE
   ============================================================ */
let connState = {practice:false, queue:[], idx:0, score:0, answered:false};
