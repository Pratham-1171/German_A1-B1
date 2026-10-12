/*
 * Sprachtreppe — grammar exercise generators (v8)
 * Every distractor is produced by a rule-based corruption of a correct sentence, so it is wrong BY CONSTRUCTION.
 * Pure logic (no DOM) except the optional adaptive picker, which reads the app state object S when it exists.
 */
(function (root) {
'use strict';
const DE = root.DE || require('./german-core.js');
const {pick, shuffle, sample, chance, cap} = DE;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LV = {A1:1, A2:2, B1:3}, LN = ['', 'A1', 'A2', 'B1'];
const lvlNum = l => typeof l==='number' ? l : (LV[l] || pick([1,2,3]));
const cxOf = d => ({easy:1, normal:2, mixed:2, hard:3, expert:4})[d] || 2;
const nOpts = d => d==='easy' ? 3 : 4;
const CASE_NAME = {nom:'Nominativ', akk:'Akkusativ', dat:'Dativ'};
const GENDER_NAME = {m:'masculine', f:'feminine', n:'neuter', p:'plural'};

const sentence = (tokens, punct) => { const t = tokens.slice(); t[0] = cap(t[0]); return t.join(' ') + (punct || '.'); };
const flat = segs => segs.reduce((a, s) => a.concat(s.t), []);
const cloneSegs = segs => segs.map(s => Object.assign({}, s, {t: s.t.slice()}));
const punctOf = spec => (spec.kind==='yn' || spec.kind==='wh') ? '?' : '.';
const sentOf = (spec, segs) => sentence(flat(segs), punctOf(spec));

function mcq(base, correct, wrongs, n, min){
  const seen = new Set([correct]), ws = [];
  for(const w of shuffle(wrongs)){ if(w!=null && w!=='' && !seen.has(w)){ seen.add(w); ws.push(w); } }
  const want = Math.min(n, ws.length + 1);
  if(want < (min || n)) return null;
  return Object.assign({options: shuffle([correct].concat(ws.slice(0, want-1))), correct}, base);
}
function mk(tag, topic, L, d, o){
  return Object.assign({skill:'grammar', tag, topic, level:LN[L], difficulty:d || 'mixed'}, o);
}
function blankedSentence(spec, segs, idx, fill){
  const c = cloneSegs(segs); c[idx].t = fill || ['___']; return sentOf(spec, c);
}

/* ---------- corruption toolbox (all wrong by construction) ---------- */
function otherFinite(spec, segs){
  const v = spec.p.v, sl = spec.subj.slot;
  const cur = segs.find(s=>s.r==='finite').t[0];
  const forms = [];
  const tbl = spec.modal ? (spec.tense==='pret' ? DE.PRET[spec.modal] : DE.T[spec.modal])
            : spec.tense==='perf' ? DE.T[v.aux] : spec.tense==='pret' ? DE.PRET[v.inf] : spec.tense==='k2' ? DE.K2.würde : null;
  DE.SLOTS.forEach(x => {
    if(x===sl) return;
    const f = tbl ? tbl[x] : (v.sep ? DE.fin(v, x) : DE.fin(v, x));
    if(f && f!==cur) forms.push(f);
  });
  return forms;
}
function weakPP(v){
  const base = v.sep ? v.inf.slice(v.pre.length) : v.inf;
  const stem = base.replace(/e?n$/, '');
  return (v.sep ? v.pre : '') + 'ge' + stem + 't';
}
function ppErrors(v){
  const out = [];
  const base = v.sep ? v.inf.slice(v.pre.length) : v.inf;
  const stem = base.replace(/e?n$/, '');
  const w = weakPP(v); if(w!==v.pp) out.push(w);
  out.push(v.inf);                                           // infinitive instead of participle
  out.push((v.sep ? v.pre : '') + 'ge' + base);              // ge + infinitive
  if(v.pp.endsWith('t')) out.push(v.pp.replace(/t$/, 'en')); // weak verb with strong ending
  else out.push(v.pp.replace(/en$/, 't'));                   // strong verb with weak ending
  { const pre = v.sep ? v.pre : '', rest = v.pp.slice(pre.length); if(rest.startsWith('ge')) out.push(pre + rest.slice(2)); }
  return DE.uniq(out).filter(x => x!==v.pp);
}
function articleFamily(det){ const t = {def:DE.DEF, indef:DE.IND, neg:DE.NEG, poss:DE.POS}[det]; const all = []; Object.values(t).forEach(c=>Object.values(c).forEach(x=>all.push(x))); return DE.uniq(all); }

/* ---------- generators ---------- */
const GEN = {};

GEN.conj = (L, d) => {
  const spec = DE.makeSpec({level:L, kind:'decl', cx:1, adv:false, tense:'pres', randomNeg:0.15});
  if(!spec) return null;
  const v = spec.p.v, sl = spec.subj.slot, segs = DE.layoutDE(spec);
  const fi = segs.findIndex(s=>s.r==='finite'), correct = segs[fi].t[0];
  const wrongs = DE.SLOTS.map(x => DE.fin(v, x)).filter(f => f!==correct);
  if(v.pres && !DE.T[v.inf]){
    const base = v.sep ? v.inf.slice(v.pre.length) : v.inf;
    const reg = DE.regularPresent(base.replace(/e?n$/, ''), sl);
    if(reg!==correct) wrongs.push(reg, reg);   // regularised (typical learner error) is a strong distractor
  }
  if(d==='easy' && !v.sep) wrongs.push(v.inf);
  const hint = v.inf;
  const ex = mcq({
    prompt: 'Complete: ' + blankedSentence(spec, segs, fi) + ' (' + hint + ')',
    promptHTML: 'Complete the sentence:<br><b>' + esc(blankedSentence(spec, segs, fi)) + '</b> <span class="mini-muted">(' + esc(hint) + ')</span><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
    explanation: sentOf(spec, segs) + ' — ' + (DE.T[v.inf] ? v.inf + ' is irregular; learn the full paradigm.' : (v.pres ? 'Stem change: the du/er forms of ' + v.inf + ' are irregular.' : 'Regular verb: ' + ({ich:'-e',du:'-st',er:'-t',wir:'-en',ihr:'-t',sie:'-en'})[sl] + ' ending for this subject.')),
    sourceId: 'g-conj-' + v.inf + '-' + sl
  }, correct, wrongs, nOpts(d));
  return ex && mk('conj', 'Verb conjugation', L, d, ex);
};

GEN['art-case'] = (L, d) => {
  const useManner = chance(0.2);
  let spec, grp;
  if(useManner){
    const n = pick(DE.nounsBy(['vehicle'], L)); const det = pick(['def','indef']);
    const g = DE.mannerGroup(n, {det});
    spec = DE.makeSpec({level:L, kind:'decl', cx:1, adv:false, tense:'pres', verb:'fahren'});
    if(!spec) return null;
    spec.p.groups = spec.p.groups.map(x => x.k==='manner' ? g : x); grp = g;
  } else {
    spec = DE.makeSpec({level:L, kind:'decl', cx:1, adv:false, tense:'pres', randomNeg:0.25, filter:v=>v.kind==='obj'});
    if(!spec) return null;
    grp = spec.p.groups.find(g=>g.k==='obj' && g.np && g.np.artIdx>=0 && !g.np.pl);
  }
  if(!grp || !grp.np || grp.np.artIdx<0) return null;
  const segs = DE.layoutDE(spec);
  const si = segs.findIndex(s=>s.r==='group' && s.g===grp);
  const offset = grp.k==='manner' ? 1 : 0;
  const tokIdx = offset + grp.np.artIdx;
  const correct = segs[si].t[tokIdx];
  const c = cloneSegs(segs); c[si].t[tokIdx] = '___';
  const wrongs = articleFamily(grp.np.det).filter(x => x!==correct);
  const n = grp.np.noun, caseName = CASE_NAME[grp.np.case];
  const ex = mcq({
    prompt: 'Choose the article: ' + sentOf(spec, c),
    promptHTML: 'Choose the correct article:<br><b>' + esc(sentOf(spec, c)) + '</b>' + (d==='easy' ? '<br><span class="mini-muted">' + caseName + '</span>' : '') + '<br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
    explanation: n.art + ' ' + n.de + ' is ' + GENDER_NAME[DE.gOf(n)] + '; ' + caseName + ' → ' + correct + '. ' + sentOf(spec, segs),
    sourceId: 'g-art-' + n.de + '-' + grp.np.case + '-' + grp.np.det
  }, correct, wrongs, nOpts(d));
  return ex && mk('art-case', 'Articles & cases', L, d, ex);
};

GEN['prep-case'] = (L, d) => {
  const pool = DE.NOUNS.filter(n => n.lvl<=L && n.dir && ['in','auf'].includes(n.dir.p) && n.art!=='das');
  const n = pick(pool); if(!n) return null;
  const goes = chance(0.5);
  const subj = DE.randomSubject();
  const v = DE.VL[goes ? 'gehen' : (chance(0.5) ? 'sein' : 'arbeiten')];
  const okWork = n.t.includes('work');
  const vv = (!goes && v.inf==='arbeiten' && !okWork) ? DE.VL.sein : v;
  const grp = goes ? DE.dirPlaceGroup(n) : DE.locPlaceGroup(n);
  const spec = {kind:'decl', subj, p:{v:vv, groups:[grp]}, tense:'pres', modal:null, neg:false, adv:null, front:null};
  const segs = DE.layoutDE(spec);
  const si = segs.findIndex(s=>s.r==='group');
  const prep = grp.pp.prep, g = DE.gOf(n);
  const correct = prep + ' ' + grp.pp.art;
  const forms = ['der','die','das','den','dem'].map(a => prep + ' ' + a);
  const c = cloneSegs(segs); c[si].t = ['___', n.de];
  const q = goes ? 'Wohin?' : 'Wo?';
  const ex = mcq({
    prompt: q + ' ' + sentOf(spec, c),
    promptHTML: '<b>' + q + '</b> ' + esc(sentOf(spec, c)) + '<br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
    explanation: goes ? 'Wohin? (movement to a place) → Akkusativ: ' + correct + ' ' + n.de + '.' : 'Wo? (position) → Dativ: ' + correct + ' ' + n.de + '.',
    sourceId: 'g-prep-' + n.de + (goes ? '-dir' : '-loc')
  }, correct, forms.filter(f => f!==correct), nOpts(d));
  return ex && mk('prep-case', 'Wo or wohin? (in/auf + case)', L, d, ex);
};

GEN.modal = (L, d) => {
  const past = L>=2 && chance(0.3);
  const spec = DE.makeSpec({level:L, kind:'decl', cx:1, adv:past, tense:past?'pret':'pres', modal:null, randomModal:1, randomNeg:0.15});
  if(!spec || !spec.modal) return null;
  const segs = DE.layoutDE(spec), fi = segs.findIndex(s=>s.r==='finite'), sl = spec.subj.slot;
  const tbl = past ? DE.PRET : DE.T, list = past ? DE.MODALS_PRET : DE.MODALS_PRES;
  const correct = tbl[spec.modal][sl];
  const wrongs = list.filter(m => m!==spec.modal).map(m => tbl[m][sl]);
  const ex = mcq({
    prompt: 'Choose the modal verb: ' + blankedSentence(spec, segs, fi) + ' (' + DE.buildEN(spec) + ')',
    promptHTML: 'Choose the modal verb that matches the meaning:<br><b>' + esc(blankedSentence(spec, segs, fi)) + '</b><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
    explanation: sentOf(spec, segs) + ' — modal verb in position 2, infinitive at the end.',
    sourceId: 'g-modal-' + spec.modal + (past ? '-pret' : '') + '-' + sl
  }, correct, wrongs, nOpts(d));
  return ex && mk('modal', 'Modal verbs', L, d, ex);
};

/* ---- sentence-level "which is correct" built from corruptions ---- */
function declCorruptions(spec, segs){
  const out = [];
  const idx = r => segs.findIndex(s=>s.r===r);
  const fi = idx('finite'), si = idx('subj');
  const push = (tag, c, why) => out.push({tag, segs:c, why});
  // verb at the end
  { const c = cloneSegs(segs); const f = c.splice(fi, 1)[0]; c.push(f); push('v2', c, 'The conjugated verb is always in position 2 in a main clause.'); }
  // fronted element: subject before verb
  if(segs[0] && (segs[0].r==='adv' || segs[0].r==='front')){ const c = cloneSegs(segs); [c[1], c[2]] = [c[2], c[1]]; push('v2', c, 'After a fronted element the verb stays in position 2 and the subject follows it (inversion).'); }
  // verb in third position without fronting
  if(!(segs[0].r==='adv' || segs[0].r==='front') && segs.length>3){ const c = cloneSegs(segs); const f = c.splice(fi,1)[0]; c.splice(fi+1, 0, f); push('v2', c, 'The conjugated verb is always in position 2.'); }
  // wrong person ending
  otherFinite(spec, segs).forEach(f => { const c = cloneSegs(segs); c[fi].t = [f]; push('conj', c, 'The verb ending must match the subject.'); });
  // wrong article
  segs.forEach((s, i) => {
    if(s.r!=='group' || !s.g.np || s.g.np.artIdx<0) return;
    const np = s.g.np, off = s.g.k==='manner' ? 1 : 0, ti = off + np.artIdx, good = s.t[ti];
    articleFamily(np.det).filter(a => a!==good).slice(0, 3).forEach(a => { const c = cloneSegs(segs); c[i].t[ti] = a; push('art-case', c, np.noun.art + ' ' + np.noun.de + ' (' + GENDER_NAME[DE.gOf(np.noun)] + ', ' + CASE_NAME[np.case] + ') → ' + good + '.'); });
  });
  // tail too early (modal / perfect)
  const ti = idx('tail');
  if(ti>=0 && (spec.modal || spec.tense==='perf')){ const c = cloneSegs(segs); const t = c.splice(ti,1)[0]; c.splice(fi+1 + (c[0].r==='adv'||c[0].r==='front'?0:0), 0, t); push('v2', c, 'With a modal verb or the Perfekt, the infinitive / participle goes to the END of the sentence.'); }
  // wrong auxiliary / participle
  if(spec.tense==='perf' && !spec.modal){
    const v = spec.p.v, other = v.aux==='sein' ? 'haben' : 'sein';
    { const c = cloneSegs(segs); c[fi].t = [DE.T[other][spec.subj.slot]]; push('perfekt', c, v.inf + ' forms the Perfekt with ' + v.aux + ': ' + DE.T[v.aux][spec.subj.slot] + ' … ' + v.pp + '.'); }
    ppErrors(v).forEach(e => { const c = cloneSegs(segs); c[ti].t = [e]; push('perfekt', c, 'Participle of ' + v.inf + ': ' + v.pp + '.'); });
  }
  // separable verb errors
  if(spec.p.v.sep && !spec.modal && spec.tense==='pres'){
    const v = spec.p.v, sl = spec.subj.slot;
    { const c = cloneSegs(segs); c[fi].t = [v.pre + DE.fin(v, sl)]; c.splice(ti, 1); push('sep', c, 'Separable verbs split: the prefix (' + v.pre + ') goes to the END of the main clause.'); }
    { const c = cloneSegs(segs); const f = c.splice(fi,1)[0]; f.t = [v.pre + DE.fin(v, sl)]; c.splice(ti>fi?ti-1:ti, 1); c.push(f); push('sep', c, 'In a main clause the verb is in position 2 and the prefix is at the end.'); }
    { const c = cloneSegs(segs); const t = c.splice(ti,1)[0]; c.splice(fi+1, 0, {r:'x', t:['auf'===v.pre?'auf':v.pre]}); /* prefix directly behind verb + still at end? no */ c.pop; push('sep', c.filter((s,i)=>true), 'The prefix belongs at the end, not right behind the verb.'); }
  }
  // negation placement
  const ni = idx('neg');
  if(ni>=0){
    { const c = cloneSegs(segs); const n = c.splice(ni,1)[0]; const f2 = c.findIndex(s=>s.r==='finite'); c.splice(f2, 0, n); push('neg', c, '"nicht" stands before the part that is negated and never directly before the conjugated verb in a simple statement.'); }
    const t2 = idx('tail');
    if(t2>=0){ const c = cloneSegs(segs); const n = c.splice(ni,1)[0]; c.push(n); push('neg', c, '"nicht" comes BEFORE the participle / infinitive at the end.'); }
  }
  return out;
}
function uniqueWrong(spec, segs, tags, correctStr){
  const all = declCorruptions(spec, segs).filter(c => !tags || tags.includes(c.tag));
  const seen = new Set([correctStr]), res = [];
  shuffle(all).forEach(c => { const s = sentOf(spec, c.segs); if(!seen.has(s)){ seen.add(s); res.push({text:s, why:c.why, tag:c.tag}); } });
  return res;
}
function correctnessExercise(tag, topic, L, d, specOpts, wantTags, sourcePrefix){
  const spec = DE.makeSpec(Object.assign({level:L, kind:'decl', cx:cxOf(d)}, specOpts));
  if(!spec) return null;
  const segs = DE.layoutDE(spec), correct = sentOf(spec, segs);
  const wr = uniqueWrong(spec, segs, wantTags, correct);
  const validAlt = [correct];
  if(spec.adv && !spec.adv.mid && spec.kind==='decl'){ const alt = Object.assign({}, spec, {front: spec.front==='adv' ? null : 'adv'}); validAlt.push(sentOf(alt, DE.layoutDE(alt))); }
  const ex = mcq({
    prompt: 'Which sentence is correct? (' + DE.buildEN(spec) + ')',
    promptHTML: 'Which sentence is correct?<br><em class="mini-muted">' + esc(DE.buildEN(spec)) + '</em>',
    explanation: correct + (wr[0] ? ' — ' + wr[0].why : ''),
    sourceId: sourcePrefix + '-' + correct, valid: validAlt
  }, correct, wr.map(x=>x.text), nOpts(d), 3);
  return ex && mk(tag, topic, L, d, ex);
}
GEN.v2 = (L, d) => correctnessExercise('v2', 'Word order (verb position)', L, d, {tense:L>=2&&chance(0.4)?'perf':'pres', randomModal:0.3, randomNeg:0.1}, ['v2'], 'g-v2');
GEN.sep = (L, d) => correctnessExercise('sep', 'Separable verbs', L, d, {tense:'pres', filter:v=>!!v.sep, adv:chance(0.3)}, ['sep','v2'], 'g-sep');
GEN.perfekt = (L, d) => {
  if(L<2) return null;
  const spec = DE.makeSpec({level:L, kind:'decl', cx:2, adv:true, tense:'perf', filter:v=>!v.noPerf && v.kind!=='be'});
  if(!spec) return null;
  const v = spec.p.v, sl = spec.subj.slot, segs = DE.layoutDE(spec);
  const fi = segs.findIndex(s=>s.r==='finite'), ti = segs.findIndex(s=>s.r==='tail');
  const mode = chance(0.5) ? 'pp' : 'aux';
  let ex;
  if(mode==='pp'){
    const hint = v.inf;
    ex = mcq({
      prompt: 'Complete the Perfekt: ' + blankedSentence(spec, segs, ti) + ' (' + hint + ')',
      promptHTML: 'Complete the Perfekt:<br><b>' + esc(blankedSentence(spec, segs, ti)) + '</b> <span class="mini-muted">(' + esc(hint) + ')</span><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
      explanation: sentOf(spec, segs) + ' — participle of ' + v.inf + ' = ' + v.pp + '.',
      sourceId: 'g-perf-pp-' + v.inf
    }, v.pp, ppErrors(v), nOpts(d));
  } else {
    const other = v.aux==='sein' ? 'haben' : 'sein';
    const wrongs = [DE.T[other][sl]].concat(DE.SLOTS.filter(x=>x!==sl).map(x => DE.T[v.aux][x]), DE.SLOTS.filter(x=>x!==sl).map(x => DE.T[other][x]));
    const correct = DE.T[v.aux][sl];
    ex = mcq({
      prompt: 'Choose the auxiliary: ' + blankedSentence(spec, segs, fi) + ' (' + v.inf + ')',
      promptHTML: 'Choose the auxiliary verb:<br><b>' + esc(blankedSentence(spec, segs, fi)) + '</b> <span class="mini-muted">(' + esc(v.inf) + ')</span><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
      explanation: sentOf(spec, segs) + ' — ' + v.inf + ' takes ' + v.aux + (v.aux==='sein' ? ' (movement / change of state).' : ' in the Perfekt.'),
      sourceId: 'g-perf-aux-' + v.inf
    }, correct, wrongs, nOpts(d));
  }
  return ex && mk('perfekt', 'Perfekt (haben / sein + participle)', L, d, ex);
};
GEN.preterite = (L, d) => {
  if(L<2) return null;
  const spec = DE.makeSpec({level:L, kind:'decl', cx:2, adv:true, tense:'pret', randomModal:0.45});
  if(!spec) return null;
  const segs = DE.layoutDE(spec), fi = segs.findIndex(s=>s.r==='finite'), sl = spec.subj.slot, v = spec.p.v;
  const key = spec.modal || v.inf, correct = DE.PRET[key][sl];
  const wrongs = DE.SLOTS.filter(x=>x!==sl).map(x => DE.PRET[key][x]);
  wrongs.push(spec.modal ? DE.T[spec.modal][sl] : DE.T[v.inf][sl]);
  const ex = mcq({
    prompt: 'Choose the past form: ' + blankedSentence(spec, segs, fi) + ' (' + DE.buildEN(spec) + ')',
    promptHTML: 'Choose the correct past form:<br><b>' + esc(blankedSentence(spec, segs, fi)) + '</b><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
    explanation: sentOf(spec, segs) + ' — Präteritum of ' + key + ': ' + DE.SLOTS.map(x=>DE.PRET[key][x]).join(', ') + '.',
    sourceId: 'g-pret-' + key + '-' + sl
  }, correct, wrongs, nOpts(d));
  return ex && mk('preterite', 'Präteritum (war, hatte, musste…)', L, d, ex);
};
GEN.neg = (L, d) => {
  const spec = DE.makeSpec({level:L, kind:'decl', cx:1, adv:false, tense:chance(0.25)&&L>=2?'perf':'pres', neg:true, randomModal:0.25});
  if(!spec || !spec.neg) return null;
  const segs = DE.layoutDE(spec), correct = sentOf(spec, segs);
  const aff = Object.assign({}, spec, {neg:false, p:{v:spec.p.v, groups:spec.p.groups.map(g=>g.negd ? Object.assign({}, g, {negd:false, np:DE.np(g.noun,{det:g.noun.mass||g.np.pl?'none':'indef', case:g.np.case, pl:g.np.pl, adj:g.np.adj}), de:null}) : g)}});
  aff.p.groups = aff.p.groups.map(g => g.de===null ? Object.assign({}, g, {de:g.np.de, en:g.np.en}) : g);
  const wrongs = uniqueWrong(spec, segs, ['neg'], correct).map(x=>x.text);
  // kein vs nicht + indefinite
  const ng = segs.findIndex(s=>s.r==='group' && s.g.negd);
  if(ng>=0){
    const g = segs[ng].g, c = cloneSegs(segs);
    const indef = DE.np(g.noun, {det:(g.noun.mass||g.np.pl)?'none':'indef', case:g.np.case, pl:g.np.pl, adj:g.np.adj});
    c[ng].t = ['nicht'].concat(indef.de); wrongs.push(sentOf(spec, c));
    const bad = c.slice(); const c2 = cloneSegs(segs); const wrongKein = articleFamily('neg').filter(a=>a!==g.np.de[g.np.artIdx]); c2[ng].t = c2[ng].t.slice(); c2[ng].t[g.np.artIdx] = pick(wrongKein); wrongs.push(sentOf(spec, c2));
  }
  const ex = mcq({
    prompt: 'Which is the correct negative sentence? (' + DE.buildEN(spec) + ')',
    promptHTML: 'Which is the correct negative sentence?<br><em class="mini-muted">' + esc(DE.buildEN(spec)) + '</em>',
    explanation: correct + ' — ' + (ng>=0 ? 'kein- replaces ein-/no article; nicht negates everything else.' : '"nicht" goes after the object and before the infinitive / participle / complement.'),
    sourceId: 'g-neg-' + correct
  }, correct, wrongs, nOpts(d), 3);
  return ex && mk('neg', 'Negation (nicht / kein)', L, d, ex);
};

GEN.question = (L, d) => {
  const spec = DE.makeSpec({level:L, kind:'decl', cx:1, adv:false, tense:'pres', filter:v=>v.kind!=='be' && v.kind!=='lang' && v.kind!=='game'});
  if(!spec) return null;
  const cand = spec.p.groups.filter(g => g.ask && g.k!=='adj');
  if(cand.length!==1 && !(cand.length===2 && chance(0.7))) { if(!cand.length) return null; }
  const g = pick(cand);
  const segs = DE.layoutDE(spec), si = segs.findIndex(s=>s.r==='group' && s.g===g);
  const c = cloneSegs(segs); const t = c[si].t.slice(); t[0] = '[' + t[0]; t[t.length-1] += ']'; c[si].t = t;
  const pool = ['Wo','Wohin','Woher','Wann','Wie','Was','Wen','Wem','Wer'];
  const correct = g.ask;
  const mean = {Wo:'place (position)', Wohin:'direction (to where)', Woher:'origin (from where)', Wann:'time', Wie:'manner / means', Was:'a thing', Wen:'a person (accusative)', Wem:'a person (dative)', Wer:'the subject (who does it)'};
  const ex = mcq({
    prompt: 'Which question word asks for the marked part? ' + sentOf(spec, c),
    promptHTML: 'Which question word asks for the <b>marked</b> part?<br><b>' + esc(sentOf(spec, c)) + '</b>',
    explanation: correct + ' asks for ' + mean[correct] + '. ' + sentOf(spec, segs),
    sourceId: 'g-q-' + correct + '-' + sentOf(spec, segs)
  }, correct, pool.filter(x=>x!==correct), nOpts(d));
  return ex && mk('question', 'Question words (W-Fragen)', L, d, ex);
};

GEN['sub-clause'] = (L, d) => {
  if(L<2 && chance(0.5)) return null;
  const c = DE.complexSentence(Math.max(L,1));
  if(!c) return null;
  const correct = c.de;
  const wrongs = [];
  const bad = (toks) => { const t = toks.slice(); t[0] = cap(t[0]); return t.join(' ') + '.'; };
  // 1) verb not at the end of the subordinate clause
  if(c.sub && c.sub.spec){
    const sp = c.sub.spec, segs = DE.layoutDE(sp);
    const fi = segs.findIndex(s=>s.r==='finite');
    const cc = cloneSegs(segs); const f = cc.splice(fi,1)[0]; cc.splice(2, 0, f);          // conn, subj, FINITE ...
    const subBad = flat(cc);
    let toks;
    if(c.order==='main-first') toks = c.mainTokens.concat(subBad);
    else if(c.order==='sub-first'){ const t = subBad.slice(); t[t.length-1] += ','; toks = DE.layoutDE(Object.assign({}, c.mainSpec, {front:'sub', subText:t})).reduce((a,s)=>a.concat(s.t), []); }
    else toks = c.mainTokens.concat(subBad);
    if(c.kind==='dass'){ toks = c.mainTokens.concat(subBad); }
    wrongs.push(bad(toks));
  }
  // 2) no inversion after a sub-clause in first position
  if(c.order==='sub-first'){
    const st = c.subTokens.slice(); st[st.length-1] += ',';
    const m = DE.layoutDE(Object.assign({}, c.mainSpec, {front:null}));
    wrongs.push(bad(st.concat(flat(m))));
  }
  // 3) verb at the end of the main clause too
  if(c.order==='main-first' && c.mainSpec){
    const segs = DE.layoutDE(c.mainSpec), fi = segs.findIndex(s=>s.r==='finite'); const cc = cloneSegs(segs); const f = cc.splice(fi,1)[0]; cc.push(f);
    const mt = flat(cc); mt[0] = mt[0]; const m2 = mt.slice(); m2[m2.length-1] += ',';
    wrongs.push(bad(m2.concat(c.subTokens)));
  }
  const ex = mcq({
    prompt: 'Which sentence is correct? (' + c.en + ')',
    promptHTML: 'Which sentence is correct?<br><em class="mini-muted">' + esc(c.en) + '</em>',
    explanation: correct + ' — after ' + c.conn + ' the conjugated verb goes to the END of its clause' + (c.order==='sub-first' ? '; the main clause then starts with the verb (inversion).' : '.'),
    sourceId: 'g-sub-' + correct
  }, correct, wrongs.filter(w => w!==correct), nOpts(d), 3);
  return ex && mk('sub-clause', 'Subordinate clauses (weil / dass / wenn / obwohl)', Math.max(L,2), d, ex);
};

GEN['adj-end'] = (L, d) => {
  if(L<3 && !chance(0.15)) return null;
  const frame = pick(['akk','akk','nom','dat']);
  let tokens, en, np, kind;
  if(frame==='akk'){
    const v = DE.VL[pick(['kaufen','brauchen','suchen','finden','haben','nehmen','lesen','tragen','bestellen'])];
    const pool = DE.nounsBy(v.obj.split(' '), 3, n => !n.t.includes('people') && !n.t.includes('abs'));
    const n = pick(pool); if(!n) return null;
    const adj = pick(DE.adjFor(n));
    const det = pick(['def','indef','none']);
    const pl = (det==='none' && n.pl && !n.mass) ? true : false;
    if(det==='none' && !n.mass && !pl) return null;
    const g = DE.objGroup(v, 3, {noun:n, adj, det, pl});
    const spec = {kind:'decl', subj:DE.randomSubject(), p:{v, groups:[g]}, tense:'pres', modal:null, neg:false, adv:null, front:null};
    const segs = DE.layoutDE(spec); np = g.np;
    const si = segs.findIndex(s=>s.r==='group');
    const c = cloneSegs(segs); const t = c[si].t.slice(); const aIdx = np.adjIdx; const form = t[aIdx];
    const stem = DE.ADJ[adj].decl || adj; t[aIdx] = stem + '___'; c[si].t = t;
    tokens = {prompt:sentOf(spec, c), full:sentOf(spec, segs), en:DE.buildEN(spec)}; kind = 'Akkusativ';
  } else if(frame==='nom'){
    const n = pick(DE.NOUNS.filter(x => x.lvl<=3 && !x.t.includes('abs') && !x.t.includes('people') && !x.mass)); const adj = pick(DE.adjFor(n));
    const det = pick(['def','indef']);
    const p = DE.np(n, {det, case:'nom', adj});
    const stem = DE.ADJ[adj].decl || adj; const t = p.de.slice(); t[p.adjIdx] = stem + '___'; np = p;
    tokens = {prompt:sentence(['das','ist'].concat(t)), full:sentence(['das','ist'].concat(p.de)), en:'This is ' + p.en + '.'}; kind = 'Nominativ';
  } else {
    const n = pick(DE.nounsBy(['vehicle'], 3)); const adj = pick(DE.adjFor(n)); const det = pick(['def','indef']);
    const g = DE.mannerGroup(n, {adj, det});
    const spec = DE.makeSpec({level:3, kind:'decl', cx:1, adv:false, tense:'pres', verb:'fahren'}); if(!spec) return null;
    spec.p.groups = spec.p.groups.map(x => x.k==='manner' ? g : x); np = g.np;
    const segs = DE.layoutDE(spec), si = segs.findIndex(s=>s.r==='group' && s.g===g);
    const c = cloneSegs(segs); const t = c[si].t.slice(); const stem = DE.ADJ[adj].decl || adj; t[1 + np.adjIdx] = stem + '___'; c[si].t = t;
    tokens = {prompt:sentOf(spec, c), full:sentOf(spec, segs), en:DE.buildEN(spec)}; kind = 'Dativ';
  }
  const correct = DE.adjEndingOf(np.adj, np.det, np.case, np.g);
  const ex = mcq({
    prompt: 'Choose the adjective ending: ' + tokens.prompt,
    promptHTML: 'Choose the adjective ending:<br><b>' + esc(tokens.prompt) + '</b><br><span class="mini-muted">' + esc(tokens.en) + '</span>',
    explanation: tokens.full + ' — ' + (np.det==='def' ? 'after der/die/das' : np.det==='none' ? 'no article (strong endings)' : 'after ein-/kein-') + ', ' + GENDER_NAME[np.g] + ', ' + kind + ' → -' + correct + '.',
    sourceId: 'g-adj-' + tokens.full
  }, correct, ['e','en','er','es','em'].filter(x=>x!==correct), nOpts(d));
  return ex && mk('adj-end', 'Adjective endings', 3, d, ex);
};

GEN.konj2 = (L, d) => {
  const c = DE.konjunktivSentence(3); if(!c) return null;
  const sl = c.subjSlot;
  const blankCond = chance(0.55);
  let toks = c.tokens.slice(), correct, wrongs, note;
  const condKey = c.cond.key, last = c.cond.de[c.cond.de.length-1];
  if(blankCond){
    const idx = toks.findIndex(t => t===last + ',');
    if(idx<0) return null;
    correct = DE.K2[condKey][sl];
    const pres = condKey==='wäre' ? DE.T.sein[sl] : DE.T.haben[sl];
    const pret = condKey==='wäre' ? DE.PRET.sein[sl] : DE.PRET.haben[sl];
    wrongs = [pres, pret].concat(DE.SLOTS.filter(x=>x!==sl).map(x=>DE.K2[condKey][x]));
    toks[idx] = '___,';
    note = 'Unreal condition (Konjunktiv II): ' + condKey + ' — not ' + pret + ' (past) or ' + pres + ' (present).';
  } else {
    const idx = toks.findIndex(t => /^(würde|würdest|würden|würdet)$/.test(t));
    if(idx<0) return null;
    correct = DE.K2.würde[sl];
    wrongs = [DE.T.werden[sl], 'wurde', DE.K2.würde[sl==='ich'?'du':'ich'], DE.T.werden[sl==='ich'?'du':'ich']];
    toks[idx] = '___';
    note = 'Unreal result: würde + infinitive (not werde = future, not wurde = past).';
  }
  const prompt = sentence(toks);
  const ex = mcq({
    prompt: 'Complete: ' + prompt + ' (' + c.en + ')',
    promptHTML: 'Complete the unreal sentence:<br><b>' + esc(prompt) + '</b><br><span class="mini-muted">' + esc(c.en) + '</span>',
    explanation: c.de + ' — ' + note,
    sourceId: 'g-k2-' + c.de
  }, correct, wrongs, nOpts(d));
  return ex && mk('konj2', 'Konjunktiv II (wenn … hätte / wäre, würde …)', 3, d, ex);
};

GEN.relative = (L, d) => {
  const c = DE.relativeSentence(3); if(!c) return null;
  const correct = c.rel;
  const idx = c.tokens.findIndex((t, i) => i>=4 && t===correct);
  if(idx<0) return null;
  const toks = c.tokens.slice(); toks[idx] = '___';
  const prompt = sentence(toks);
  const ex = mcq({
    prompt: 'Complete: ' + prompt,
    promptHTML: 'Choose the relative pronoun:<br><b>' + esc(prompt) + '</b><br><span class="mini-muted">' + esc(c.en) + '</span>',
    explanation: c.de + ' — the relative pronoun takes the gender of ' + c.head.art + ' ' + c.head.de + ' and the case of its role in the clause (object → Akkusativ: ' + correct + ').',
    sourceId: 'g-rel-' + c.de
  }, correct, ['der','die','das','den','dem'].filter(x=>x!==correct), nOpts(d));
  return ex && mk('relative', 'Relative clauses', 3, d, ex);
};

GEN.passive = (L, d) => {
  const c = DE.passiveSentence(3); if(!c) return null;
  const fi = c.tokens.findIndex(t => t==='wird' || t==='werden'); if(fi<0) return null;
  const correct = c.tokens[fi];
  const toks = c.tokens.slice(); toks[fi] = '___';
  const prompt = sentence(toks);
  const wrongs = [c.pl ? 'wird' : 'werden', 'werde', 'wirst', 'hat'];
  const ex = mcq({
    prompt: 'Complete the passive: ' + prompt,
    promptHTML: 'Complete the passive sentence:<br><b>' + esc(prompt) + '</b><br><span class="mini-muted">' + esc(c.en) + '</span>',
    explanation: c.de + ' — Passiv Präsens: werden (agrees with the subject) + Partizip II.',
    sourceId: 'g-pass-' + c.de
  }, correct, wrongs, nOpts(d));
  return ex && mk('passive', 'Passive (werden + participle)', 3, d, ex);
};

/* ---- translation with MEANING-based distractors ---- */
function variants(spec, want){
  const out = [], seen = new Set();
  const base = DE.render(spec);
  seen.add(base.de); seen.add(base.en);
  const attempts = [];
  const clone = () => Object.assign({}, spec, {p:{v:spec.p.v, groups:spec.p.groups.slice()}});
  // subject
  attempts.push(() => { const s = clone(); const p = pick(DE.PRON); s.subj = DE.mkSubj(p); return s; });
  // negation
  attempts.push(() => { const s = clone(); if(s.p.v.noNeg) return null; s.neg = !s.neg; if(s.neg) s.p.groups = s.p.groups.map(g => g.k==='obj' && g.np && (g.np.det==='indef'||g.np.det==='none') ? DE.toNeg(g) : g); else { s.p.groups = s.p.groups.map(g => g.negd ? Object.assign({}, g, {negd:false, np:DE.np(g.noun,{det:(g.noun.mass||g.np.pl)?'none':'indef',case:g.np.case,pl:g.np.pl,adj:g.np.adj})}) : g).map(g => g.np && !g.negd && g.de!==g.np.de ? Object.assign({}, g, {de:g.np.de, en:g.np.en}) : g); } return s; });
  // object / place noun
  attempts.push(() => {
    const s = clone(); const gi = s.p.groups.findIndex(g=>g.k==='obj' && g.noun);
    if(gi>=0){ const g = s.p.groups[gi]; const pool = DE.nounsBy(s.p.v.obj.split(' '), 3, n => n!==g.noun && (!g.np.pl || n.pl) && n.art===g.noun.art === false || true).filter(n => n!==g.noun && (!g.np.pl || n.pl));
      if(!pool.length) return null; const n = pick(pool); s.p.groups[gi] = DE.objGroup(s.p.v, 3, {noun:n, det:g.np.det==='neg'?'indef':g.np.det, pl:g.np.pl}); if(g.negd) s.p.groups[gi] = DE.toNeg(s.p.groups[gi]); return s; }
    const pi = s.p.groups.findIndex(g=>g.k==='dir' && g.noun || g.k==='loc' && g.noun);
    if(pi>=0){ const g = s.p.groups[pi]; const n = pick(DE.NOUNS.filter(x=>x.dir && x!==g.noun && x.t.includes(s.p.v.kind==='work'?'work':'go'))); if(!n) return null; s.p.groups[pi] = g.k==='dir' ? DE.dirPlaceGroup(n) : DE.locPlaceGroup(n); return s; }
    const ci = s.p.groups.findIndex(g=>g.city);
    if(ci>=0){ const g = s.p.groups[ci]; const c = pick(DE.CITIES.filter(x=>x!==g.city)); s.p.groups[ci] = Object.assign({}, g, {city:c, de:[g.de[0], c], en:g.en.replace(g.city, c)}); return s; }
    return null;
  });
  // time adverb
  attempts.push(() => { if(!spec.adv) return null; const s = clone(); const pool = (spec.tense==='perf'||spec.tense==='pret' ? DE.PAST_TIME : DE.PRES_TIME).filter(a => a.en!==spec.adv.en && !!a.mid===!!spec.adv.mid && (!s.neg || !a.mid) && !(s.p.v.inf==='wohnen')); if(!pool.length) return null; s.adv = pick(pool); return s; });
  // modal
  attempts.push(() => { if(!spec.modal) return null; const s = clone(); const list = spec.tense==='pret' ? DE.MODALS_PRET : DE.MODALS_PRES; s.modal = pick(list.filter(m=>m!==spec.modal)); return s; });
  // tense
  attempts.push(() => { if(spec.modal || spec.adv || spec.p.v.noPerf || spec.p.v.kind==='be') return null; const s = clone(); s.tense = spec.tense==='perf' ? 'pres' : (spec.tense==='pres' ? 'perf' : null); return s.tense ? s : null; });
  for(let i=0; i<60 && out.length<want; i++){
    let s; try { s = pick(attempts)(); } catch(e){ s = null; }
    if(!s) continue;
    let r; try { r = DE.render(s); } catch(e){ continue; }
    if(!r || /undefined|NaN/.test(r.de + r.en)) continue;
    if(seen.has(r.de) || seen.has(r.en)) continue;
    seen.add(r.de); seen.add(r.en); out.push(r);
  }
  return out;
}
function translationSpec(L, d){
  return DE.makeSpec({level:L, kind:pick(['decl','decl','decl','yn']), cx:cxOf(d), randomNeg:0.2, randomModal:0.25, tense:L>=2&&chance(0.3)?'perf':'pres'});
}
GEN['translate-en'] = (L, d) => {
  const spec = translationSpec(L, d); if(!spec) return null;
  const r = DE.render(spec); const vs = variants(spec, 6);
  const ex = mcq({
    prompt: 'Translate into German: ' + r.en,
    promptHTML: 'Translate into German:<br><b>' + esc(r.en) + '</b>',
    explanation: r.de, sourceId: 'g-t-en-' + r.de
  }, r.de, vs.map(x=>x.de), nOpts(d), 3);
  return ex && mk('translate-en', 'Translation (English → German)', L, d, ex);
};
GEN['translate-de'] = (L, d) => {
  const spec = translationSpec(L, d); if(!spec) return null;
  const r = DE.render(spec); const vs = variants(spec, 6);
  const ex = mcq({
    prompt: 'What does this mean? ' + r.de,
    promptHTML: 'What does this sentence mean?<br><b>' + esc(r.de) + '</b>',
    explanation: r.de + ' = ' + r.en, sourceId: 'g-t-de-' + r.de
  }, r.en, vs.map(x=>x.en), nOpts(d), 3);
  return ex && mk('translate-de', 'Reading sentences (German → English)', L, d, ex);
};

GEN.cloze = (L, d) => {
  const spec = DE.makeSpec({level:L, kind:'decl', cx:cxOf(d), tense:'pres', randomNeg:0.1, randomModal:0.2});
  if(!spec) return null;
  const segs = DE.layoutDE(spec);
  const og = segs.findIndex(s => s.r==='group' && s.g.k==='obj' && s.g.np && !s.g.np.pl);
  let ex;
  if(og>=0 && chance(0.7)){
    const g = segs[og].g, n = g.np.noun, ni = g.np.nounIdx;
    const same = DE.NOUNS.filter(x => x!==n && x.art===n.art && x.lvl<=3 && x.t.some(t => n.t.includes(t)) && (n.mass===x.mass));
    const anyG = DE.NOUNS.filter(x => x!==n && x.art===n.art && x.lvl<=3 && !x.t.includes('abs'));
    const wrongs = same.map(x=>x.de).concat(anyG.map(x=>x.de));
    const c = cloneSegs(segs); c[og].t[ni] = '___';
    ex = mcq({
      prompt: 'Complete: ' + sentOf(spec, c) + ' (' + DE.buildEN(spec) + ')',
      promptHTML: 'Complete the sentence:<br><b>' + esc(sentOf(spec, c)) + '</b><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
      explanation: sentOf(spec, segs) + ' = ' + DE.buildEN(spec), sourceId: 'g-cloze-n-' + sentOf(spec, segs)
    }, n.de, wrongs, nOpts(d));
  } else {
    const fi = segs.findIndex(s=>s.r==='finite'); if(spec.modal || spec.p.v.kind==='be') return null;
    const v = spec.p.v, correct = segs[fi].t[0], sl = spec.subj.slot;
    const wrongs = Object.values(DE.VL).filter(x => x!==v && x.kind!=='be' && x.lvl<=L && x.kind===v.kind && !!x.sep===!!v.sep).map(x => DE.fin(x, sl));
    const c = cloneSegs(segs); c[fi].t = ['___'];
    ex = mcq({
      prompt: 'Complete: ' + sentOf(spec, c) + ' (' + DE.buildEN(spec) + ')',
      promptHTML: 'Choose the verb that fits the meaning:<br><b>' + esc(sentOf(spec, c)) + '</b><br><span class="mini-muted">' + esc(DE.buildEN(spec)) + '</span>',
      explanation: sentOf(spec, segs) + ' = ' + DE.buildEN(spec), sourceId: 'g-cloze-v-' + sentOf(spec, segs)
    }, correct, wrongs.filter(w => w!==correct), nOpts(d));
  }
  return ex && mk('cloze', 'Fill in the missing word', L, d, ex);
};

const UML = {a:'ä', o:'ö', u:'ü'};
function umlaut(w){ const m = w.match(/^(.*?)([aou])([^aou]*)$/i); return m ? m[1] + UML[m[2].toLowerCase()] + m[3] : w; }
GEN.plural = (L, d) => {
  const n = pick(DE.NOUNS.filter(x => x.pl && x.lvl<=Math.max(L,1) && !x.t.includes('abs')));
  if(!n) return null;
  const um = umlaut(n.de);
  const cands = [n.de+'e', n.de+'en', n.de+'n', n.de+'s', n.de+'er', um+'e', um+'er', um, n.de].filter(x => x!==n.pl);
  const ex = mcq({
    prompt: 'Plural of "' + n.art + ' ' + n.de + '"?',
    promptHTML: 'What is the plural of <b>' + esc(n.art + ' ' + n.de) + '</b> <span class="mini-muted">(' + esc(n.en) + ')</span>?',
    explanation: n.art + ' ' + n.de + ' → die ' + n.pl, sourceId: 'g-pl-' + n.de
  }, n.pl, cands, nOpts(d));
  return ex && mk('plural', 'Noun plurals', L, d, ex);
};

/* ---------- registry, levels, adaptive picking ---------- */
const TAGS_BY_LEVEL = {
  1:['conj','art-case','v2','sep','neg','question','modal','translate-en','translate-de','cloze','plural'],
  2:['conj','art-case','v2','sep','neg','question','modal','translate-en','translate-de','cloze','plural','perfekt','prep-case','sub-clause','preterite'],
  3:['conj','art-case','v2','sep','neg','modal','translate-en','translate-de','cloze','perfekt','prep-case','sub-clause','preterite','adj-end','konj2','relative','passive']
};
const LABELS = {conj:'Verb conjugation','art-case':'Articles & cases',v2:'Word order',sep:'Separable verbs',neg:'Negation',question:'Question words',modal:'Modal verbs','translate-en':'Translation EN→DE','translate-de':'Translation DE→EN',cloze:'Fill in the word',plural:'Noun plurals',perfekt:'Perfekt','prep-case':'Wo / wohin','sub-clause':'Subordinate clauses',preterite:'Präteritum','adj-end':'Adjective endings',konj2:'Konjunktiv II',relative:'Relative clauses',passive:'Passive'};
let recentTags = [];
function stats(){ try { return (typeof S!=='undefined' && S) ? (S.gstats = S.gstats || {}) : {}; } catch(e){ return {}; } }
function weightOf(tag){
  const st = stats()[tag]; let w = 1;
  if(!st || st.n < 3) w = 1.6;                           // explore unseen skills
  else { const acc = st.ok / st.n; w = 0.6 + 2.4 * (1 - acc); }   // practise weak skills more
  const r = recentTags.lastIndexOf(tag);
  if(r>=0) w *= (recentTags.length - r) > 3 ? 0.7 : 0.25;      // avoid immediate repeats
  return Math.max(w, 0.05);
}
function pickTag(L, allowed){
  const pool = (allowed && allowed.length ? allowed : TAGS_BY_LEVEL[L]).filter(t => TAGS_BY_LEVEL[L].includes(t) || (allowed && allowed.includes(t)));
  const ws = pool.map(weightOf), total = ws.reduce((a,b)=>a+b, 0);
  let r = DE.rnd() * total;
  for(let i=0;i<pool.length;i++){ r -= ws[i]; if(r<=0) return pool[i]; }
  return pool[pool.length-1];
}
function make(tag, level, difficulty){
  const L = lvlNum(level);
  for(let i=0;i<60;i++){
    let ex = null;
    try { ex = GEN[tag](L, difficulty); } catch(e){ ex = null; }
    if(ex && ex.options && ex.options.length>=3 && ex.options.includes(ex.correct) && !/undefined|NaN|\[object/.test(ex.prompt + ex.correct + ex.options.join('|'))) return ex;
  }
  return null;
}
function next(cfg){
  cfg = cfg || {};
  const L = lvlNum(cfg.level);
  for(let i=0;i<20;i++){
    const tag = cfg.tag || pickTag(L, cfg.tags);
    const ex = make(tag, L, cfg.difficulty);
    if(ex){ recentTags.push(tag); if(recentTags.length>8) recentTags.shift(); return ex; }
  }
  return make('conj', 1, cfg.difficulty) || make('plural', 1, cfg.difficulty);
}
function record(ex, ok){
  if(!ex || !ex.tag) return;
  const st = stats(); const s = st[ex.tag] || (st[ex.tag] = {n:0, ok:0, last:0});
  s.n++; if(ok) s.ok++; s.last = Date.now();
}

/* sentence-builder item: tiles + every acceptable order */
function builderItem(level){
  const L = lvlNum(level);
  for(let i=0;i<40;i++){
    let tokens, en, accept = [];
    if(L>=2 && chance(0.35)){
      const c = DE.complexSentence(L); if(!c) continue;
      tokens = c.tokens.slice(); en = c.en;
    } else {
      const spec = DE.makeSpec({level:L, kind:'decl', cx:L+1, randomNeg:0.15, randomModal:0.25, tense:L>=2&&chance(0.35)?'perf':'pres', adv:chance(0.6)});
      if(!spec) continue;
      const r = DE.render(spec); tokens = r.tokens; en = r.en;
      if(spec.adv && !spec.adv.mid){
        const alt = Object.assign({}, spec, {front: spec.front==='adv' ? null : 'adv'});
        const t2 = DE.render(alt).tokens; accept.push(t2.join(' ') + '.');
      }
    }
    if(tokens.length<3 || tokens.length>12) continue;
    const answer = tokens.join(' ') + '.';
    return {level:LN[L], answer, accept, en, tokens:shuffle(tokens)};
  }
  return null;
}

const EX = {GEN, make, next, record, builderItem, TAGS_BY_LEVEL, LABELS, variants, declCorruptions, ppErrors, lvlNum, resetRecent(){ recentTags = []; }};
root.EX = EX;
if(typeof module!=='undefined' && module.exports) module.exports = EX;
})(typeof window!=='undefined' ? window : globalThis);
