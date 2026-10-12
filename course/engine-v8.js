/*
 * Sprachtreppe — engine v8 integration
 * Loaded after german-core.js, exercises-v8.js and reading-writing-v8.js, inside the app scope.
 * Replaces the old procedural engine: registers adaptive grammar practice, a safer sentence builder,
 * interactive reading (multiple choice + richtig/falsch) and writing with a real rubric.
 */
(function () {
  'use strict';
  if (typeof EXERCISE_REGISTRY === 'undefined' || !window.EX || !window.RW) return;
  const LEVELS = ['A1', 'A2', 'B1'];
  const lvl = l => (l && l !== 'all') ? l : LEVELS[Math.floor(Math.random() * 3)];
  const safe = (fn, fb) => { try { const v = fn(); if (v) return v; } catch (e) { console.warn('exercise recovered', e); } return fb ? fb() : null; };

  /* ---------- exercise registry ---------- */
  Object.keys(EX.GEN).forEach(tag => {
    EXERCISE_REGISTRY['g_' + tag] = c => EX.next({tag, level: c.level || 'A2', difficulty: c.difficulty});
  });
  EXERCISE_REGISTRY.gen = c => EX.next({level: c.level || 'A2', difficulty: c.difficulty});
  EXERCISE_REGISTRY.sentence = c => EX.next({tag: Math.random() < .5 ? 'v2' : 'translate-en', level: c.level || 'A2', difficulty: c.difficulty});
  EXERCISE_REGISTRY.random = c => EXERCISE_REGISTRY.mixed(c);
  EXERCISE_REGISTRY.mixed = c => {
    const keys = ['vocab', 'article', 'de_en', 'en_de', 'opposite', 'synonym', 'grammar', 'listening', 'connector', 'collocation', 'compare', 'verbusage', 'gen', 'gen', 'gen', 'gen'];
    const k = keys[Math.floor(Math.random() * keys.length)];
    return safe(() => EXERCISE_REGISTRY[k](c), () => EX.next({level: c.level}));
  };
  window.generateRandomExercise = (level, difficulty) => EXERCISE_REGISTRY.mixed({level: level || 'A2', difficulty: difficulty || 'mixed'});
  window.generateSentenceExercise = level => EX.next({level: lvl(level)});
  window.safeGenerateExercise = (fn, fb) => safe(fn, () => EX.next({level: fb || 'A2'}));

  /* the original collocation quiz sometimes offered the same verb twice, or a verb that is ALSO correct (e.g. Kaffee machen) */
  if (typeof COLLOCATIONS !== 'undefined') {
    const GENERIC = new Set(['machen', 'haben', 'nehmen', 'geben', 'tun']);
    const rest = (p, v) => p.replace(new RegExp('\\b' + v + '\\b'), '').trim();
    window.generateCollocationExercise = function (c) {
      const r = rest(c.phrase, c.verb);
      const bad = new Set(COLLOCATIONS.filter(x => rest(x.phrase, x.verb) === r).map(x => x.verb));
      bad.add(c.verb);
      const pool = Array.from(new Set(COLLOCATIONS.map(x => x.verb))).filter(v => !bad.has(v) && (!GENERIC.has(v) || GENERIC.has(c.verb)));
      const options = shuffle([c.verb].concat(shuffle(pool).slice(0, 3)));
      const prompt = c.phrase.replace(new RegExp('\\b' + c.verb + '\\b'), '___');
      return {prompt: `Which verb completes: "${prompt}"?`, promptHTML: `Which verb completes <b>${esc(prompt)}</b>?`, options, correct: c.verb, explanation: `${c.phrase} — ${c.en}`, collocation: c, skill: 'collocation'};
    };
  }

  /* adaptive picker used by "Session": weak grammar skills come up more often */
  if (typeof selectAdaptiveSkill === 'function') {
    const oldAdaptive = selectAdaptiveSkill;
    window.selectAdaptiveSkill = function () {
      const r = Math.random();
      if (r < 0.55) return 'gen';
      return oldAdaptive();
    };
  }

  /* ---------- sentence builder (tiles) ---------- */
  window.generateSentenceBuilderExercise = function (level) {
    const L = lvl(level);
    const it = EX.builderItem(L);
    if (it) return it;
    return {level: L, answer: 'Ich lerne Deutsch.', accept: [], en: 'I learn German.', tokens: ['Deutsch', 'lerne', 'Ich']};
  };

  /* ---------- reading ---------- */
  window.generateReadingTask = function (level, topic) {
    const r = RW.readingTask(lvl(level), topic);
    S.readingsGenerated = (S.readingsGenerated || 0) + 1; STORE.save();
    return r;
  };
  window.viewRead = function (el) {
    if (!readState.current || !readState.current.items) readState.current = generateReadingTask(readState.level);
    const r = readState.current, answered = readState.answered || (readState.answered = {});
    const all = r.items.map((i, k) => Object.assign({id: 'q' + k}, i)).concat(r.tfs.map((i, k) => Object.assign({id: 't' + k, q: i.de, options: ['Richtig', 'Falsch']}, i)));
    el.innerHTML = `<h2>${t('read_title')}</h2><p class="sub">Generated passage · every question comes from the text</p>
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
          <div class="chipgroup" id="rdLevels">${LEVELS.map(l => `<button data-l="${l}" class="${r.level === l ? 'active' : ''}">${l}</button>`).join('')}</div>
          <div class="row" style="margin:0"><button class="btn small" id="readNew">🔄 New passage</button><button class="btn small ghost" id="readAloud">🔊 Read aloud</button></div>
        </div>
        <div style="font-weight:750;font-size:17px;margin-bottom:10px">${esc(r.title)}</div>
        <div style="line-height:1.75;font-size:14.5px">${esc(r.text)}</div>
      </div>
      <h3>Comprehension</h3>
      <div class="card" id="rdQs">${all.map((q, i) => `<div style="margin-top:${i ? 16 : 0}px" data-id="${q.id}">
        <div style="font-weight:650;margin-bottom:8px;font-size:14px">${i + 1}. ${q.type === 'tf' ? 'Richtig oder falsch? ' : ''}${esc(q.q)}</div>
        <div class="rd-opts">${q.options.map(o => `<button class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
        <div id="rdScore" class="mt" style="font-weight:700"></div></div>`;
    const paint = () => {
      let done = 0, ok = 0;
      all.forEach(q => {
        const box = el.querySelector(`[data-id="${q.id}"]`); if (!box) return;
        const a = answered[q.id];
        box.querySelectorAll('.opt').forEach(b => {
          b.classList.remove('correct', 'wrong'); b.disabled = a !== undefined;
          if (a !== undefined) { if (b.dataset.v === q.correct) b.classList.add('correct'); else if (b.dataset.v === a) b.classList.add('wrong'); }
        });
        if (a !== undefined) { done++; if (a === q.correct) ok++; }
      });
      $('#rdScore').textContent = done === all.length ? `Score: ${ok} / ${all.length}` : '';
    };
    el.querySelectorAll('.rd-opts .opt').forEach(b => b.onclick = () => {
      const id = b.closest('[data-id]').dataset.id, q = all.find(x => x.id === id);
      if (answered[id] !== undefined) return;
      answered[id] = b.dataset.v;
      const good = b.dataset.v === q.correct;
      recordPracticeActivity('reading', good);
      if (!good) recordMistake({type: 'reading', topic: 'Reading comprehension', prompt: q.q, userAnswer: b.dataset.v, correctAnswer: q.correct, explanation: r.text, sourceId: 'rd-' + r.title + '-' + q.q});
      paint();
    });
    el.querySelectorAll('#rdLevels button').forEach(b => b.onclick = () => { readState.level = b.dataset.l; readState.current = null; readState.answered = {}; viewRead(el); });
    $('#readAloud').onclick = () => speakGerman(r.text, 0.85);
    $('#readNew').onclick = () => { readState.current = null; readState.answered = {}; viewRead(el); };
    paint();
  };

  /* ---------- writing ---------- */
  window.generateWritingTask = function (level) {
    const w = RW.writingTask(lvl(level));
    S.writingsDone = (S.writingsDone || 0) + 1; STORE.save();
    return w;
  };
  window.viewWrite = function (el) {
    if (!writeState.current || !writeState.current.requiredIds) writeState.current = generateWritingTask(writeState.level);
    const task = writeState.current;
    el.innerHTML = `<h2>${t('write_title')}</h2><p class="sub">Generated task · automatic checklist</p>
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          <div class="chipgroup" id="wrLevels">${LEVELS.map(l => `<button data-l="${l}" class="${task.level === l ? 'active' : ''}">${l}</button>`).join('')}</div>
          <button class="btn small" id="writeNew">🔄 New task</button>
        </div>
        <div style="font-weight:750;font-size:16px">${esc(task.title)}</div>
        <div class="mini-muted" style="margin:6px 0 10px">${esc(task.prompt)}</div>
        <div style="font-size:11.5px;font-weight:800;color:var(--accent)">CHECKLIST</div>
        <div id="wrReq" style="display:flex;flex-direction:column;gap:6px;margin:10px 0">${task.required.map(r => `<div class="wr-item" style="display:flex;gap:10px;padding:9px 12px;border:1px solid var(--line);border-radius:9px;background:var(--bg);font-size:13px;align-items:center"><span class="wr-mark">☐</span><span>${esc(r)}</span></div>`).join('')}</div>
        <textarea id="wPad" placeholder="Schreibe hier…" style="min-height:180px;padding:14px;font-size:14.5px;line-height:1.6;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--text);width:100%">${esc(writeState.text || '')}</textarea>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin:6px 0"><span>Words: <b id="wCount">0</b></span><span>Target: <b>${task.minWords}+</b></span></div>
        <div class="row"><button class="btn" id="wCheck">🔍 Check</button><button class="btn ghost" id="wModel">📄 Model</button></div>
        <div id="wFb" class="mt" style="font-size:13.5px"></div>
        <div id="wModelBox" class="hidden mt"><div style="font-size:11.5px;font-weight:800;color:var(--accent2);display:flex;justify-content:space-between;align-items:center">MODEL ${speakerBtn(task.model, 12)}</div>
          <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.65;background:var(--bg);border-left:3px solid var(--accent2);border-radius:6px;padding:11px 13px;margin-top:6px;overflow-x:auto">${esc(task.model)}</pre></div>
      </div>`;
    const pad = $('#wPad');
    const marks = () => {
      const res = RW.checkWriting(task, pad.value);
      $('#wCount').textContent = res.words;
      el.querySelectorAll('.wr-item').forEach((n, i) => { const ok = res.items[i] && res.items[i].ok; n.querySelector('.wr-mark').textContent = ok ? '☑' : '☐'; n.style.borderColor = ok ? 'var(--ok)' : 'var(--line)'; });
      return res;
    };
    pad.oninput = () => { writeState.text = pad.value; marks(); }; marks();
    $('#wModel').onclick = () => $('#wModelBox').classList.toggle('hidden');
    $('#writeNew').onclick = () => { writeState.current = null; writeState.text = ''; viewWrite(el); };
    el.querySelectorAll('#wrLevels button').forEach(b => b.onclick = () => { writeState.level = b.dataset.l; writeState.current = null; writeState.text = ''; viewWrite(el); });
    $('#wCheck').onclick = () => {
      const text = pad.value.trim(); const fb = $('#wFb');
      if (!text) { fb.innerHTML = '⚠️ Write something first.'; return; }
      const res = marks();
      const tone = res.score >= 80 ? 'rgba(22,163,74,.10)' : res.score >= 50 ? 'rgba(245,158,11,.12)' : 'rgba(225,29,72,.08)';
      fb.innerHTML = `<div style="padding:10px 12px;border-radius:9px;background:${tone}"><b>Score ${res.score}/100</b> · ${res.words} words
        ${res.good.map(g => `<div style="margin-top:6px">✅ ${esc(g)}</div>`).join('')}
        ${res.items.filter(i => !i.ok).map(i => `<div style="margin-top:6px">⬜ Missing: ${esc(i.text)}</div>`).join('')}
        ${res.tips.map(x => `<div style="margin-top:6px">💡 ${esc(x)}</div>`).join('')}</div>`;
      recordPracticeActivity('writing', res.score >= 60);
      S.writingLog = (S.writingLog || []).concat([{t: Date.now(), level: task.level, title: task.title, score: res.score, words: res.words, text: text.slice(0, 2500)}]).slice(-15);
      STORE.save();
    };
    wireSpeakers(el);
  };

  window.__SP_ENGINE_VERSION = '8.0-grammar-core';
})();
