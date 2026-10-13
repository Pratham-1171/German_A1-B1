/* Source module: views-communication.js
 * Listening, speaking, reading and writing tasks.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
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

