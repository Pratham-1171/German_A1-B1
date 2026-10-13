/* Source module: views-practice.js
 * Practice, exam, resources, and progress screens.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
function viewConnectors(el){
  if(connState.practice){ renderConnectorPractice(el); return; }
  el.innerHTML = `<h2>${t('connectors_title')}</h2><p class="sub">Function, clause type, word order.</p>
    <button class="btn" id="connPractice" style="width:100%;margin-bottom:14px">⚡ Practice ∞</button>
    <div>${CONNECTORS.map(c => `<div class="conn-card">
      <div class="cn-head"><div class="cn-word">${esc(c.word)} ${speakerBtn(c.word)}</div><span class="cn-func">${c.func}</span></div>
      <div class="cn-meta"><span class="tag ${c.level}">${c.level}</span><span>${esc(c.meaning)}</span><span>${c.clause}</span><span>${c.order}</span></div>
      <div class="cn-ex">${esc(c.ex[0])}<br><em style="color:var(--muted);font-style:normal;font-size:12.5px">${esc(c.ex[1])}</em> ${speakerBtn(c.ex[0])}</div>
    </div>`).join('')}</div>`;
  $('#connPractice').onclick = () => {
    connState.practice = true;
    connState.queue = Array.from({length:20}, () => generateConnectorExercise(rPick(CONNECTORS)));
    connState.idx = 0; connState.score = 0; connState.answered = false;
    viewConnectors(el);
  };
  wireSpeakers(el);
}
function renderConnectorPractice(el){
  if(connState.idx >= connState.queue.length){
    el.innerHTML = `<h2>${t('connectors_title')}</h2>
      <div class="card center"><h3>Round complete!</h3>
        <div style="font-size:34px;font-weight:800;color:var(--accent);margin:8px 0">${connState.score} / ${connState.queue.length}</div>
        <button class="btn" id="again">Continue ∞</button>
        <button class="btn ghost" id="back">← Back</button>
      </div>`;
    $('#again').onclick = () => {
      connState.queue = Array.from({length:20}, () => generateConnectorExercise(rPick(CONNECTORS)));
      connState.idx = 0; connState.score = 0; connState.answered = false;
      viewConnectors(el);
    };
    $('#back').onclick = () => { connState.practice = false; viewConnectors(el); };
    return;
  }
  const ex = connState.queue[connState.idx];
  el.innerHTML = `<h2>${t('connectors_title')}</h2>
    <div class="card"><div class="qstat"><span>Q <b>${connState.idx+1}</b> / ${connState.queue.length}</span><span>Score <b>${connState.score}</b></span></div>
      <div style="font-size:16px;margin:8px 0 14px">${ex.promptHTML}</div>
      <div id="cOpts">${ex.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div id="cFb" class="mt" style="font-size:13.5px;color:var(--muted)"></div>
    </div>
    <button class="btn ghost" id="cBack">← Back</button>`;
  el.querySelectorAll('#cOpts .opt').forEach(b => b.onclick = () => {
    if(connState.answered) return;
    connState.answered = true;
    const ok = b.dataset.v === ex.correct;
    if(ok) connState.score++;
    el.querySelectorAll('#cOpts .opt').forEach(x => { x.disabled = true; if(x.dataset.v === ex.correct) x.classList.add('correct'); else if(x === b) x.classList.add('wrong'); });
    $('#cFb').innerHTML = ok ? '✅ Correct!' : `❌ Correct: <b>${esc(ex.correct)}</b>. ${esc(ex.explanation)}`;
    S.connectorsDone = (S.connectorsDone||0) + 1; STORE.save(); checkAchievements();
    if(!ok) recordMistake({type:'connector', topic:ex.connector.func, prompt:ex.prompt, userAnswer:b.dataset.v, correctAnswer:ex.correct, explanation:ex.explanation});
    setTimeout(() => { connState.idx++; connState.answered = false; renderConnectorPractice(el); }, 1200);
  });
  $('#cBack').onclick = () => { connState.practice = false; viewConnectors(el); };
}

let collState = {practice:false, queue:[], idx:0, score:0, answered:false};
function viewCollocations(el){
  if(collState.practice){ renderCollocationPractice(el); return; }
  el.innerHTML = `<h2>${t('collocations_title')}</h2><p class="sub">Fixed word combinations native speakers use.</p>
    <button class="btn" id="collPractice" style="width:100%;margin-bottom:14px">⚡ Practice ∞</button>
    <div>${COLLOCATIONS.map(c => `<div class="collo-card">
      <div class="cc-phrase">${esc(c.phrase)} ${speakerBtn(c.phrase)}</div>
      <div class="cc-en">${esc(c.en)}</div>
      <div class="cc-ex">${esc(c.ex)}<br><em style="color:var(--muted);font-style:normal;font-size:12.5px">${esc(c.exEn)}</em></div>
    </div>`).join('')}</div>`;
  $('#collPractice').onclick = () => {
    collState.practice = true;
    collState.queue = Array.from({length:20}, () => generateCollocationExercise(rPick(COLLOCATIONS)));
    collState.idx = 0; collState.score = 0; collState.answered = false;
    viewCollocations(el);
  };
  wireSpeakers(el);
}
function renderCollocationPractice(el){
  if(collState.idx >= collState.queue.length){
    el.innerHTML = `<h2>${t('collocations_title')}</h2>
      <div class="card center"><h3>Round complete!</h3>
        <div style="font-size:34px;font-weight:800;color:var(--accent)">${collState.score} / ${collState.queue.length}</div>
        <button class="btn" id="again">Continue ∞</button>
        <button class="btn ghost" id="back">← Back</button>
      </div>`;
    $('#again').onclick = () => {
      collState.queue = Array.from({length:20}, () => generateCollocationExercise(rPick(COLLOCATIONS)));
      collState.idx = 0; collState.score = 0; collState.answered = false;
      viewCollocations(el);
    };
    $('#back').onclick = () => { collState.practice = false; viewCollocations(el); };
    return;
  }
  const ex = collState.queue[collState.idx];
  el.innerHTML = `<h2>${t('collocations_title')}</h2>
    <div class="card"><div class="qstat"><span>Q <b>${collState.idx+1}</b> / ${collState.queue.length}</span><span>Score <b>${collState.score}</b></span></div>
      <div style="font-size:16px;margin:8px 0 14px">${ex.promptHTML}</div>
      <div id="cOpts">${ex.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div id="cFb" class="mt"></div>
    </div>
    <button class="btn ghost" id="cBack">← Back</button>`;
  el.querySelectorAll('#cOpts .opt').forEach(b => b.onclick = () => {
    if(collState.answered) return;
    collState.answered = true;
    const ok = b.dataset.v === ex.correct;
    if(ok) collState.score++;
    el.querySelectorAll('#cOpts .opt').forEach(x => { x.disabled = true; if(x.dataset.v === ex.correct) x.classList.add('correct'); else if(x === b) x.classList.add('wrong'); });
    $('#cFb').innerHTML = ok ? '✅ Correct!' : `❌ Correct: <b>${esc(ex.correct)}</b>. ${esc(ex.explanation)}`;
    S.collocationsDone = (S.collocationsDone||0) + 1; STORE.save(); checkAchievements();
    if(!ok) recordMistake({type:'collocation', topic:'collocations', prompt:ex.prompt, userAnswer:b.dataset.v, correctAnswer:ex.correct, explanation:ex.explanation});
    setTimeout(() => { collState.idx++; collState.answered = false; renderCollocationPractice(el); }, 1200);
  });
  $('#cBack').onclick = () => { collState.practice = false; viewCollocations(el); };
}

let cmpState = {practice:false, queue:[], idx:0, score:0, answered:false};
function viewCompare(el){
  if(cmpState.practice){ renderComparePractice(el); return; }
  el.innerHTML = `<h2>${t('compare_title')}</h2><p class="sub">Distinguish verbs learners often confuse.</p>
    <button class="btn" id="cmpPractice" style="width:100%;margin-bottom:14px">⚡ Practice ∞</button>
    <div>${VERB_COMPARISONS.map(c => `<div class="cmp-card">
      <div class="cmp-head"><span class="cmp-word">${esc(c.a)}</span><span class="cmp-vs">vs.</span><span class="cmp-word">${esc(c.b)}</span></div>
      <div class="cmp-row">
        <div class="cmp-side"><b>${esc(c.a)}</b>${esc(c.aMeaning)}</div>
        <div class="cmp-side"><b>${esc(c.b)}</b>${esc(c.bMeaning)}</div>
      </div>
      <div class="mini-muted" style="margin-top:8px">${esc(c.aEx)} ${speakerBtn(c.aEx, 11)}<br>${esc(c.bEx)} ${speakerBtn(c.bEx, 11)}</div>
      <div class="cmp-note">💡 ${esc(c.note)}</div>
    </div>`).join('')}</div>`;
  $('#cmpPractice').onclick = () => {
    cmpState.practice = true;
    cmpState.queue = Array.from({length:16}, () => generateComparisonExercise(rPick(VERB_COMPARISONS)));
    cmpState.idx = 0; cmpState.score = 0; cmpState.answered = false;
    viewCompare(el);
  };
  wireSpeakers(el);
}
function renderComparePractice(el){
  if(cmpState.idx >= cmpState.queue.length){
    el.innerHTML = `<h2>${t('compare_title')}</h2>
      <div class="card center"><h3>Round complete!</h3>
        <div style="font-size:34px;font-weight:800;color:var(--accent)">${cmpState.score} / ${cmpState.queue.length}</div>
        <button class="btn" id="again">Continue ∞</button>
        <button class="btn ghost" id="back">← Back</button>
      </div>`;
    $('#again').onclick = () => {
      cmpState.queue = Array.from({length:16}, () => generateComparisonExercise(rPick(VERB_COMPARISONS)));
      cmpState.idx = 0; cmpState.score = 0; cmpState.answered = false;
      viewCompare(el);
    };
    $('#back').onclick = () => { cmpState.practice = false; viewCompare(el); };
    return;
  }
  const ex = cmpState.queue[cmpState.idx];
  el.innerHTML = `<h2>${t('compare_title')}</h2>
    <div class="card"><div class="qstat"><span>Q <b>${cmpState.idx+1}</b> / ${cmpState.queue.length}</span><span>Score <b>${cmpState.score}</b></span></div>
      <div class="mini-muted" style="margin-bottom:8px">Choose the correct verb:</div>
      <div style="font-size:16px;margin:8px 0 14px">${ex.promptHTML}</div>
      <div id="cOpts">${ex.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <div id="cFb" class="mt"></div>
    </div>
    <button class="btn ghost" id="cBack">← Back</button>`;
  el.querySelectorAll('#cOpts .opt').forEach(b => b.onclick = () => {
    if(cmpState.answered) return;
    cmpState.answered = true;
    const ok = b.dataset.v === ex.correct;
    if(ok) cmpState.score++;
    el.querySelectorAll('#cOpts .opt').forEach(x => { x.disabled = true; if(x.dataset.v === ex.correct) x.classList.add('correct'); else if(x === b) x.classList.add('wrong'); });
    $('#cFb').innerHTML = ok ? '✅ Correct!' : `❌ Correct: <b>${esc(ex.correct)}</b>.<br>${esc(ex.note)}`;
    if(!ok) recordMistake({type:'comparison', topic:'verb-comparison', prompt:ex.prompt, userAnswer:b.dataset.v, correctAnswer:ex.correct, explanation:ex.note});
    setTimeout(() => { cmpState.idx++; cmpState.answered = false; renderComparePractice(el); }, 1400);
  });
  $('#cBack').onclick = () => { cmpState.practice = false; viewCompare(el); };
}

/* ============================================================
   SENTENCE / SPELLING / DICTATION / FAMILIES
   ============================================================ */
let sbState = {item: null, used: [], answer: []};
function viewSentence(el){
  if(!sbState.item) sbState.item = generateSentenceBuilderExercise();
  const item = sbState.item;
  el.innerHTML = `<h2>${t('sentence_title')}</h2><p class="sub">New sentences generated each round.</p>
    <div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <span class="tag ${item.level}">${item.level}</span>
        <button class="btn small" id="sbNew">🔄 New</button>
      </div>
      <div style="font-size:14px;color:var(--muted);margin-bottom:6px">${esc(item.en)}</div>
      <div class="builder-answer" id="sbAnswer"></div>
      <div class="builder-tiles" id="sbTiles"></div>
      <div class="row">
        <button class="btn" id="sbCheck">✓ Check</button>
        <button class="btn ghost" id="sbReset">↻ Reset</button>
      </div>
      <div id="sbFb" class="mt"></div>
    </div>`;
  const renderAnswer = () => {
    const ans = $('#sbAnswer');
    if(!sbState.answer.length){ ans.innerHTML = '<span class="mini-muted">Tap tiles to build the sentence…</span>'; return; }
    ans.innerHTML = sbState.answer.map((a, i) => `<span class="word" data-a="${i}">${esc(a.word)}</span>`).join('');
    ans.querySelectorAll('[data-a]').forEach(w => w.onclick = () => {
      const idx = +w.dataset.a;
      const removed = sbState.answer.splice(idx, 1)[0];
      sbState.used[removed.origIndex] = false;
      renderTiles(); renderAnswer();
    });
  };
  const renderTiles = () => {
    const tiles = $('#sbTiles');
    tiles.innerHTML = item.tokens.map((tk, i) => `<button class="builder-tile ${sbState.used[i]?'used':''}" data-i="${i}">${esc(tk)}</button>`).join('');
    tiles.querySelectorAll('.builder-tile').forEach(b => b.onclick = () => {
      const i = +b.dataset.i; if(sbState.used[i]) return;
      sbState.used[i] = true;
      sbState.answer.push({word: item.tokens[i], origIndex: i});
      renderTiles(); renderAnswer();
    });
  };
  if(sbState.used.length !== item.tokens.length){ sbState.used = item.tokens.map(() => false); sbState.answer = []; }
  renderAnswer(); renderTiles();
  $('#sbReset').onclick = () => { sbState.used = item.tokens.map(() => false); sbState.answer = []; renderTiles(); renderAnswer(); $('#sbFb').innerHTML = ''; };
  $('#sbNew').onclick = () => { sbState.item = null; sbState.used = []; sbState.answer = []; viewSentence(el); };
  $('#sbCheck').onclick = () => {
    const user = sbState.answer.map(a => a.word).join(' ').replace(/\s+/g, ' ').trim();
    const correct = item.answer.replace(/\s+/g, ' ').trim();
    const fb = $('#sbFb');
    const ok = user === correct;
    fb.innerHTML = ok ? `<div style="padding:10px;background:rgba(22,163,74,.12);border-radius:8px;color:var(--ok);font-weight:650">✅ Correct!</div>` :
      `<div style="padding:10px;background:rgba(225,29,72,.10);border-radius:8px"><b>❌ Correct:</b> ${esc(correct)} ${speakerBtn(correct)}</div>`;
    if(ok){ S.sentencesBuilt = (S.sentencesBuilt||0) + 1; STORE.save(); checkAchievements(); }
    wireSpeakers(fb);
    setTimeout(() => { if(ok){ sbState.item = null; sbState.used = []; sbState.answer = []; viewSentence(el); } }, 1800);
  };
}

let spellState = {idx:0, pool:[], submitted:false};
function viewSpelling(el){
  if(!spellState.pool.length){
    const weak = VOCAB.filter(w => { const m = S.mastery['v'+w.n]; return m && (m.status === 'LEARNING' || m.status === 'FAMILIAR' || m.status === 'NEW'); });
    spellState.pool = shuffle(weak.length ? weak : VOCAB).slice(0, 30);
  }
  const w = spellState.pool[spellState.idx % spellState.pool.length];
  const speakText = (w.art && w.art !== '-' ? w.art + ' ' : '') + w.de;
  el.innerHTML = `<h2>${t('spelling_title')}</h2><p class="sub">Listen and type the German word.</p>
    <div class="card" style="text-align:center">
      <div style="margin:10px 0"><button class="btn" id="spPlay">🔊 Play</button></div>
      <div class="mini-muted" style="margin-top:6px">${esc(meaningFull(w))}</div>
      <input type="text" class="spell-input" id="spInput" placeholder="Type here…" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
      <div class="row" style="justify-content:center;margin-top:12px">
        <button class="btn" id="spCheck">Check</button>
        <button class="btn ghost" id="spReveal">Reveal</button>
        <button class="btn ghost" id="spNext">Next →</button>
      </div>
      <div id="spFb" class="mt" style="font-size:14px;min-height:24px"></div>
    </div>`;
  const input = $('#spInput');
  setTimeout(() => input.focus(), 100);
  speakGerman(speakText);
  const checkAnswer = () => {
    if(spellState.submitted) return;
    spellState.submitted = true;
    const user = input.value.trim();
    const target = w.de.toLowerCase();
    const ok = user.toLowerCase().replace(/\s+/g, ' ') === target;
    input.classList.add(ok ? 'correct' : 'wrong');
    const fb = $('#spFb');
    if(ok){
      fb.innerHTML = '<span style="color:var(--ok);font-weight:650">✅ Correct!</span>';
      S.spelledCorrect = (S.spelledCorrect||0) + 1;
      updateMastery(vocabKey(w), 2);
    } else {
      fb.innerHTML = `<span style="color:var(--warn)">❌ Correct: </span><b>${esc(speakText)}</b> ${speakerBtn(speakText)}`;
      wireSpeakers(fb);
      updateMastery(vocabKey(w), 0);
      recordMistake({type:'spelling', topic:w.topic, prompt:`Spell: "${w.en}"`, userAnswer:user, correctAnswer:w.de, explanation:`${speakText} = ${meaningFull(w)}`, sourceId:'v'+w.n});
    }
  };
  $('#spCheck').onclick = checkAnswer;
  input.onkeydown = e => { if(e.key === 'Enter'){ spellState.submitted ? nextSpell(el) : checkAnswer(); } };
  $('#spPlay').onclick = () => speakGerman(speakText);
  $('#spReveal').onclick = () => { input.value = w.de; input.classList.add('wrong'); $('#spFb').innerHTML = `<span style="color:var(--warn)">Correct: </span><b>${esc(speakText)}</b>`; spellState.submitted = true; };
  $('#spNext').onclick = () => nextSpell(el);
}
function nextSpell(el){ spellState.idx = (spellState.idx + 1) % spellState.pool.length; if(spellState.idx === 0) spellState.pool = shuffle(spellState.pool); spellState.submitted = false; viewSpelling(el); }

let dictState = {item: null, submitted: false};
function viewDictation(el){
  if(!dictState.item) dictState.item = generateDictationExercise();
  const item = dictState.item;
  el.innerHTML = `<h2>${t('dictation_title')}</h2><p class="sub">Listen and write the sentence.</p>
    <div class="card">
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
        <span class="tag ${item.level}">${item.level}</span>
        <button class="btn small" id="dNew">🔄 New</button>
      </div>
      <div class="row"><button class="btn" id="dPlay">🔊 Play</button><button class="btn ghost" id="dSlow">🐢 Slow</button></div>
      <textarea id="dInput" style="margin-top:12px;min-height:80px" placeholder="Type what you hear…" autocomplete="off" spellcheck="false"></textarea>
      <div class="row" style="margin-top:10px">
        <button class="btn" id="dCheck">Check</button>
        <button class="btn ghost" id="dReveal">Reveal</button>
      </div>
      <div id="dFb" class="mt" style="font-size:13.5px"></div>
    </div>`;
  setTimeout(() => speakGerman(item.de, 0.85), 200);
  $('#dPlay').onclick = () => speakGerman(item.de, S.settings.speechRate);
  $('#dSlow').onclick = () => speakGerman(item.de, 0.6);
  $('#dCheck').onclick = () => {
    if(dictState.submitted) return; dictState.submitted = true;
    const user = $('#dInput').value.trim().replace(/\s+/g, ' ');
    const target = item.de.replace(/\s+/g, ' ').trim();
    const norm = s => s.toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
    const ok = norm(user) === norm(target);
    const fb = $('#dFb');
    if(ok){
      fb.innerHTML = `<div style="padding:10px;background:rgba(22,163,74,.12);border-radius:8px"><b style="color:var(--ok)">✅ Perfect!</b>${item.en ? `<div class="mini-muted" style="margin-top:4px">${esc(item.en)}</div>` : ''}</div>`;
    } else {
      const uw = user.split(/\s+/), tw = target.split(/\s+/);
      const diff = tw.map((word, i) => uw[i] === word ? esc(word) : `<span style="background:rgba(225,29,72,.2);padding:1px 4px;border-radius:3px">${esc(word)}</span>`).join(' ');
      fb.innerHTML = `<div style="padding:10px;background:rgba(225,29,72,.08);border-radius:8px"><b style="color:var(--warn)">❌ Try again</b><div style="margin-top:6px">${diff}</div></div>`;
    }
  };
  $('#dReveal').onclick = () => { $('#dInput').value = item.de; dictState.submitted = true; };
  $('#dNew').onclick = () => { dictState.item = null; dictState.submitted = false; viewDictation(el); };
}

function viewFamilies(el){
  el.innerHTML = `<h2>${t('families_title')}</h2><p class="sub">Related words sharing a root.</p>
    <div>${WORD_FAMILIES.map(f => `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
        <div><div style="font-weight:750;font-size:17px">${esc(f.root)} <span class="tag ${f.level}">${f.level}</span></div>
        <div class="mini-muted">${esc(f.en)}</div></div>${speakerBtn(f.root)}
      </div>
      <div class="family-tree">${esc(f.root)}\n├── ${f.members.map(m => m.de).join('\n├── ')}</div>
      <div style="margin-top:10px">${f.members.map(m => `<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;padding:8px 10px;background:var(--bg);border-radius:8px;margin-bottom:4px">
        <div><div style="font-weight:650;font-size:14px">${esc(m.de)} <span class="pill" style="font-size:10px">${esc(m.pos)}</span></div><div class="mini-muted">${esc(m.en)}</div></div>${speakerBtn(m.de)}
      </div>`).join('')}</div>
    </div>`).join('')}</div>`;
  S.familiesViewed = (S.familiesViewed||0) + WORD_FAMILIES.length; STORE.save(); checkAchievements();
  wireSpeakers(el);
}

/* ============================================================
   EXAM
   ============================================================ */
let examState = {active:false, level:'A1', questions:[], idx:0, answers:[], startTime:0, timeLimit:1800, timer:null};
function viewExam(el){
  if(examState.active){ renderExamQuestion(el); return; }
  el.innerHTML = `<h2>${t('exam_title')}</h2><p class="sub">Timed test with mixed questions.</p>
    <div class="card"><h4 style="margin-top:0">Choose level:</h4>
      <div class="row">${['A1','A2','B1'].map(l => `<button class="btn ${examState.level===l?'':'ghost'}" data-level="${l}">${l}</button>`).join('')}</div>
    </div>
    <button class="btn" id="examStart" style="width:100%">${t('exam_start')}</button>`;
  el.querySelectorAll('[data-level]').forEach(b => b.onclick = () => { examState.level = b.dataset.level; viewExam(el); });
  $('#examStart').onclick = () => startExam(el);
}
function startExam(el){
  examState.questions = generateExerciseBatch({count:20, skill:'mixed', level:examState.level, difficulty:'mixed'});
  examState.idx = 0;
  examState.answers = new Array(20).fill(null);
  examState.startTime = Date.now();
  examState.active = true;
  examState.timeLimit = 1800;
  clearInterval(examState.timer);
  examState.timer = setInterval(() => {
    if(!examState.active) return;
    const elapsed = Math.floor((Date.now() - examState.startTime) / 1000);
    const remaining = examState.timeLimit - elapsed;
    const timeEl = $('#examTimer');
    if(timeEl){ const m = Math.floor(Math.abs(remaining)/60); const s = Math.abs(remaining)%60; timeEl.textContent = `${remaining<0?'-':''}${m}:${String(s).padStart(2,'0')}`; }
    if(remaining <= 0) finishExam(el);
  }, 1000);
  renderExamQuestion(el);
}
function renderExamQuestion(el){
  const q = examState.questions[examState.idx];
  const user = examState.answers[examState.idx];
  el.innerHTML = `<div class="exam-box">
    <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center">
      <div><div style="font-size:12px;color:var(--muted);font-weight:700">EXAM · ${examState.level}</div>
      <div style="margin-top:4px">${examState.idx+1} / ${examState.questions.length}</div></div>
      <div class="exam-timer" id="examTimer">30:00</div>
    </div>
  </div>
  <div class="card"><div style="font-size:16px;margin-bottom:10px">${q.promptHTML}</div>
    <div id="exOpts">${q.options.map(o => `<button class="opt ${user === o ? 'correct' : ''}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
  </div>
  <div class="row">
    <button class="btn ghost" id="exPrev" ${examState.idx === 0 ? 'disabled' : ''}>← Prev</button>
    <button class="btn ghost" id="exAbort">Abort</button>
    ${examState.idx === examState.questions.length - 1 ? `<button class="btn good" id="exSubmit">Submit</button>` : `<button class="btn" id="exNext">Next →</button>`}
  </div>`;
  wireSpeakers(el);
  el.querySelectorAll('#exOpts .opt').forEach(b => b.onclick = () => {
    examState.answers[examState.idx] = b.dataset.v;
    el.querySelectorAll('#exOpts .opt').forEach(x => x.classList.remove('correct'));
    b.classList.add('correct');
  });
  const btnPrev = $('#exPrev'); if(btnPrev && !btnPrev.disabled) btnPrev.onclick = () => { examState.idx--; renderExamQuestion(el); };
  $('#exAbort').onclick = () => { if(confirm('Abort?')){ clearInterval(examState.timer); examState.active = false; viewExam(el); } };
  const btnNext = $('#exNext'); if(btnNext) btnNext.onclick = () => { examState.idx++; renderExamQuestion(el); };
  const btnSubmit = $('#exSubmit'); if(btnSubmit) btnSubmit.onclick = () => finishExam(el);
}
function finishExam(el){
  clearInterval(examState.timer);
  examState.active = false;
  const results = examState.questions.map((q,i) => ({q, user: examState.answers[i], ok: examState.answers[i] === q.correct}));
  const correct = results.filter(r => r.ok).length;
  const accuracy = pct(correct, results.length);
  const bySkill = {};
  results.forEach(r => {
    const s = r.q.skill || 'vocabulary';
    if(!bySkill[s]) bySkill[s] = {done:0, correct:0};
    bySkill[s].done++; if(r.ok) bySkill[s].correct++;
    if(!r.ok) recordMistake({type:'exam_'+s, topic:r.q.topic, prompt:r.q.prompt, userAnswer:r.user, correctAnswer:r.q.correct, explanation:r.q.explanation, sourceId:r.q.sourceId});
  });
  el.innerHTML = `<h2>📊 Test Report</h2>
    <div class="card" style="text-align:center"><div style="font-size:52px;font-weight:800;color:var(--accent)">${accuracy}%</div><div class="mini-muted">${correct} / ${results.length}</div></div>
    <div class="stats">${Object.entries(bySkill).map(([k,v]) => `<div class="stat"><div class="n">${pct(v.correct,v.done)}%</div><div class="l">${esc(k)}</div></div>`).join('')}</div>
    <div class="row"><button class="btn" id="examAgain">Take again</button><button class="btn ghost" id="examHome">🏠</button></div>`;
  $('#examAgain').onclick = () => viewExam(el);
  $('#examHome').onclick = () => location.hash = '#/home';
}

/* ============================================================
   RESOURCES / PROGRESS / SETTINGS
   ============================================================ */
function viewResources(el){
  el.innerHTML = `<h2>${t('res_title')}</h2><p class="sub">Quality free tools.</p>
    ${RESOURCES.map(r => `<div class="card res-card"><div class="res-icon">${r.icon}</div><div class="res-body"><h4>${esc(r.name)}</h4><div class="res-url"><a href="https://${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)} ↗</a></div><div class="res-desc">${esc(r.desc)}</div></div></div>`).join('')}`;
}
function viewProgress(el){
  const total = VOCAB.length;
  const mastered = Object.keys(S.mastery).filter(k => k.startsWith('v') && (S.mastery[k].status === 'MASTERED' || S.mastery[k].status === 'STRONG')).length;
  const gTotal = GRAMMAR_DATA.reduce((a,s) => a + s.items.length, 0);
  const gDone = Object.keys(S.grammarDone).length;
  const mistakeCount = Object.keys(S.mistakes).length;
  const breakdown = {NEW:0, LEARNING:0, FAMILIAR:0, STRONG:0, MASTERED:0};
  VOCAB.forEach(w => { const m = getMastery('v'+w.n); breakdown[m.status] = (breakdown[m.status]||0) + 1; });
  const fmtTime = s => { s = Math.floor(s); if(s < 60) return s + 's'; const m = Math.floor(s/60); if(m < 60) return m + 'm'; return Math.floor(m/60) + 'h ' + (m%60) + 'm'; };
  const grammarByTopic = GRAMMAR_DATA.map(sec => {
    const done = sec.items.filter((it,idx) => S.grammarDone[sec.level + '_' + idx]).length;
    return {level:sec.level, title:sec.title, done, total: sec.items.length, pct: pct(done, sec.items.length)};
  });
  const achHTML = ACHIEVEMENTS.map(a => {
    const unlocked = !!S.achievements[a.id];
    return `<div class="achievement ${unlocked ? '' : 'locked'}"><div class="ach-icon">${unlocked ? a.icon : '🔒'}</div><div class="ach-body"><div class="ach-name">${esc(a.name)}</div><div class="ach-desc">${esc(a.desc)}</div></div></div>`;
  }).join('');
  el.innerHTML = `<h2>${t('prog_title')}</h2><p class="sub">All data stored locally.</p>
    <div class="stats" style="margin-bottom:14px">
      <div class="stat"><div class="n">${mastered}/${total}</div><div class="l">Mastered</div></div>
      <div class="stat"><div class="n">${gDone}/${gTotal}</div><div class="l">Grammar</div></div>
      <div class="stat"><div class="n">${mistakeCount}</div><div class="l">Mistakes</div></div>
    </div>
    <h3>Study time</h3>
    <div class="stats">
      <div class="stat"><div class="n">${fmtTime(S.studyTime.today)}</div><div class="l">Today</div></div>
      <div class="stat"><div class="n">${fmtTime(S.studyTime.week)}</div><div class="l">This week</div></div>
      <div class="stat"><div class="n">${fmtTime(S.studyTime.total)}</div><div class="l">Total</div></div>
    </div>
    <h3>Streak</h3>
    <div class="stats">
      <div class="stat"><div class="n">${S.streak.current}🔥</div><div class="l">Current</div></div>
      <div class="stat"><div class="n">${S.streak.longest}</div><div class="l">Longest</div></div>
    </div>
    <h3>Mastery</h3>
    <div class="card">${Object.entries(breakdown).map(([k,v]) => `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:3px"><span class="mastery-chip mastery-${k}">${k}</span><span class="mini-muted">${v} / ${total} (${pct(v,total)}%)</span></div>
      <div class="bar"><i style="width:${pct(v,total)}%"></i></div>
    </div>`).join('')}</div>
    <h3>Grammar progress by topic</h3>
    <div class="card">${grammarByTopic.map(t => `<div class="topic-prog">
      <div class="tp-name"><span class="tag ${t.level}">${t.level}</span> ${esc(t.title)}</div>
      <div class="tp-val">${t.done}/${t.total} (${t.pct}%)</div>
      <div class="tp-bar"><i style="width:${t.pct}%"></i></div>
    </div>`).join('')}</div>
    <h3>Achievements (${Object.keys(S.achievements).length}/${ACHIEVEMENTS.length})</h3>
    <div class="card">${achHTML}</div>
    <h3>Backup</h3>
    <div class="card"><button class="btn" id="exportP">📤 Export</button>
      <label class="btn ghost" style="cursor:pointer;margin-left:6px">📥 Import<input type="file" id="importP" accept="application/json" hidden></label></div>
    <h3>Danger zone</h3>
    <div class="card"><button class="btn ghost" id="reset">Reset all</button></div>`;
  $('#exportP').onclick = () => {
    const payload = {version:5.3, exportedAt:new Date().toISOString(), store:S};
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'german-a1-b1-progress.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#importP').onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const r = new FileReader();
    r.onload = () => { try{ const p = JSON.parse(r.result); if(p.store) localStorage.setItem(STORE.key, JSON.stringify(p.store)); alert('Imported! Reloading…'); location.reload(); }catch(err){ alert('Invalid file.'); } };
    r.readAsText(file);
  };
  $('#reset').onclick = () => { if(confirm('Reset all progress?')){ localStorage.removeItem(STORE.key); location.reload(); } };
}

