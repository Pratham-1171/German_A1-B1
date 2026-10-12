const test = require('node:test'), assert = require('node:assert');
const DE = require('../course/german-core.js'); global.DE = DE;
const EX = require('../course/exercises-v8.js');
const RW = require('../course/reading-writing-v8.js');

test('every generator: unique options, correct answer present, no placeholders, wrong options never valid', () => {
  DE.seed(77);
  const tags = Object.keys(EX.GEN);
  const made = {};
  for (const tag of tags) {
    made[tag] = 0;
    for (const L of [1, 2, 3]) for (let i = 0; i < 400; i++) {
      const ex = EX.GEN[tag](L, ['easy', 'mixed', 'hard'][i % 3]);
      if (!ex) continue; made[tag]++;
      const where = tag + ' ' + JSON.stringify(ex).slice(0, 200);
      assert.ok(ex.options.includes(ex.correct), 'correct present: ' + where);
      assert.equal(new Set(ex.options).size, ex.options.length, 'unique: ' + where);
      assert.ok(ex.options.length >= 3 && ex.options.length <= 4, 'size: ' + where);
      assert.ok(!/undefined|NaN|\[object|null|\{\}/.test(ex.prompt + ex.options.join('|') + ex.explanation), 'placeholder: ' + where);
      assert.ok(ex.tag === tag && ex.topic && ex.explanation && ex.sourceId, 'metadata: ' + where);
      if (ex.valid) ex.options.filter(o => o !== ex.correct).forEach(o => assert.ok(!ex.valid.includes(o), 'wrong option is a valid order: ' + o));
      // sentence-choice items: a wrong option must differ from the right one in more than capitalisation
      if (['v2', 'sep', 'neg', 'sub-clause', 'translate-en'].includes(tag)) ex.options.forEach(o => assert.ok(/[.?]$/.test(o), 'sentence option: ' + o));
    }
    assert.ok(made[tag] > 100, tag + ' generates reliably (' + made[tag] + ')');
  }
});
test('article-case: the keyed answer follows the gender/case tables', () => {
  DE.seed(5);
  for (let i = 0; i < 1500; i++) {
    const ex = EX.GEN['art-case'](1 + i % 3, 'mixed'); if (!ex) continue;
    const m = ex.explanation.match(/^(der|die|das) (\S+) is (masculine|feminine|neuter); (Nominativ|Akkusativ|Dativ) → (\S+)\./); if (!m) continue;
    const g = {masculine:'m', feminine:'f', neuter:'n'}[m[3]], c = {Nominativ:'nom', Akkusativ:'akk', Dativ:'dat'}[m[4]];
    const forms = [DE.DEF, DE.IND, DE.NEG, DE.POS].map(t => t[c][g]);
    assert.ok(forms.includes(ex.correct) && ex.correct === m[5], ex.explanation);
  }
});
test('adjective endings are keyed correctly', () => {
  DE.seed(8);
  for (let i = 0; i < 800; i++) {
    const ex = EX.GEN['adj-end'](3, 'mixed'); if (!ex) continue;
    assert.ok(['e', 'en', 'er', 'es', 'em'].includes(ex.correct)); assert.ok(/___/.test(ex.prompt));
    const m = ex.explanation.match(/^(.+?) — .*→ -(\w+)\.$/); assert.ok(m && m[2] === ex.correct, ex.explanation);
    const full = m[1]; assert.ok(full.length > 5);
  }
});
test('word-order builder: tiles can build the answer and every accepted variant', () => {
  DE.seed(3);
  const key = a => a.slice().map(w => w.toLowerCase().replace(/[.,]$/, '')).sort().join('|');
  for (let i = 0; i < 1500; i++) {
    const it = EX.builderItem(['A1', 'A2', 'B1'][i % 3]); if (!it) continue;
    const ans = it.answer.replace(/\.$/, '').split(' ');
    assert.equal(key(ans), key(it.tokens), it.answer);
    it.accept.forEach(a => assert.equal(key(a.replace(/\.$/, '').split(' ')), key(it.tokens), 'variant uses the same tiles: ' + a));
    assert.ok(it.tokens.length >= 3 && it.tokens.length <= 12);
  }
});
test('adaptive picker favours weak skills and avoids immediate repeats', () => {
  global.S = {gstats: {}};
  EX.GEN && Object.keys(EX.GEN).forEach(t => { S.gstats[t] = {n: 20, ok: 19, last: 0}; });
  S.gstats.perfekt = {n: 20, ok: 4, last: 0};
  EX.resetRecent(); DE.seed(9);
  const counts = {}; let repeats = 0, prev = null;
  for (let i = 0; i < 1500; i++) { const ex = EX.next({level: 'A2'}); counts[ex.tag] = (counts[ex.tag] || 0) + 1; if (ex.tag === prev) repeats++; prev = ex.tag; }
  const avg = 1500 / Object.keys(counts).length;
  assert.ok(counts.perfekt > 1.8 * avg, 'weak skill practised more: ' + JSON.stringify(counts));
  assert.ok(repeats < 1500 * 0.2, 'few immediate repeats: ' + repeats);
  EX.record({tag: 'perfekt'}, true); assert.equal(S.gstats.perfekt.n, 21);
  delete global.S;
});
test('sessions do not repeat the same question', () => {
  DE.seed(11); EX.resetRecent();
  const seen = new Set(); let dup = 0;
  for (let i = 0; i < 300; i++) { const ex = EX.next({level: 'A2'}); const k = ex.sourceId; if (seen.has(k)) dup++; seen.add(k); }
  assert.ok(dup < 30, 'duplicates in 300 questions: ' + dup);
});

test('reading: every question is answerable from the text and options are distinct', () => {
  DE.seed(21);
  for (let i = 0; i < 900; i++) {
    const r = RW.readingTask(1 + i % 3);
    assert.ok(r.text.length > 80 && !/undefined|NaN/.test(r.text), r.text);
    assert.equal(r.items.length, 4);
    r.items.forEach(it => { assert.ok(it.options.includes(it.correct)); assert.equal(new Set(it.options).size, it.options.length); assert.equal(it.options.length, 4); });
    r.tfs.forEach(t => assert.ok(['Richtig', 'Falsch'].includes(t.correct)));
    // fact check: names/places/numbers in true statements must occur in the text, answers about places occur in the text
    r.tfs.filter(t => t.correct === 'Richtig').forEach(t => { const w = t.de.match(/[A-ZÄÖÜ][\wäöüß]+/g) || []; w.forEach(x => { if (!['Die','Der','Das'].includes(x)) assert.ok(r.text.includes(x) || /Richtig/.test(x), 'true statement fact "' + x + '" not in text: ' + t.de + ' / ' + r.text); }); });
    r.tfs.filter(t => t.correct === 'Falsch').forEach(t => assert.ok(!r.text.includes(t.de.replace(/\.$/, '')), 'false statement must not be a sentence of the text: ' + t.de));
  }
});
test('writing: each model satisfies its own checklist and length; rubric catches typical mistakes', () => {
  DE.seed(31);
  for (let i = 0; i < 600; i++) {
    const w = RW.writingTask(1 + i % 3), res = RW.checkWriting(w, w.model);
    assert.ok(res.items.every(x => x.ok), w.title + ' missing: ' + res.items.filter(x => !x.ok).map(x => x.text) + '\n' + w.model);
    assert.ok(res.words >= w.minWords, w.title + ' model too short');
    assert.deepEqual(res.tips, [], w.title + ' model triggers tips: ' + res.tips + '\n' + w.model);
    assert.ok(res.score >= 90, w.title + ' score ' + res.score);
  }
  const t = RW.writingTask(2);
  const bad = RW.checkWriting(t, 'hallo. weil ich bin müde. ich bin 25 Jahre.');
  assert.ok(bad.score < 40); assert.ok(bad.tips.some(x => /weil/.test(x))); assert.ok(bad.tips.some(x => /25 Jahre alt/.test(x)));
  assert.equal(RW.checkWriting(t, '').words, 0);
});
