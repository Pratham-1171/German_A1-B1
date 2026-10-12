const test = require('node:test'), assert = require('node:assert');
const DE = require('../course/german-core.js');

// ---- hand-verified paradigms (ich, du, er, wir, ihr, sie) — independent of the code under test ----
const ORACLE = {
  kaufen:['kaufe','kaufst','kauft','kaufen','kauft','kaufen'], arbeiten:['arbeite','arbeitest','arbeitet','arbeiten','arbeitet','arbeiten'],
  wohnen:['wohne','wohnst','wohnt','wohnen','wohnt','wohnen'], lernen:['lerne','lernst','lernt','lernen','lernt','lernen'],
  finden:['finde','findest','findet','finden','findet','finden'], essen:['esse','isst','isst','essen','esst','essen'],
  lesen:['lese','liest','liest','lesen','lest','lesen'], sehen:['sehe','siehst','sieht','sehen','seht','sehen'],
  fahren:['fahre','fährst','fährt','fahren','fahrt','fahren'], schlafen:['schlafe','schläfst','schläft','schlafen','schlaft','schlafen'],
  nehmen:['nehme','nimmst','nimmt','nehmen','nehmt','nehmen'], treffen:['treffe','triffst','trifft','treffen','trefft','treffen'],
  helfen:['helfe','hilfst','hilft','helfen','helft','helfen'], waschen:['wasche','wäschst','wäscht','waschen','wascht','waschen'],
  vergessen:['vergesse','vergisst','vergisst','vergessen','vergesst','vergessen'], tragen:['trage','trägst','trägt','tragen','tragt','tragen'],
  schließen:['schließe','schließt','schließt','schließen','schließt','schließen'], öffnen:['öffne','öffnest','öffnet','öffnen','öffnet','öffnen'],
  antworten:['antworte','antwortest','antwortet','antworten','antwortet','antworten'], reparieren:['repariere','reparierst','repariert','reparieren','repariert','reparieren'],
  bezahlen:['bezahle','bezahlst','bezahlt','bezahlen','bezahlt','bezahlen'], bleiben:['bleibe','bleibst','bleibt','bleiben','bleibt','bleiben'],
  kommen:['komme','kommst','kommt','kommen','kommt','kommen'], gehen:['gehe','gehst','geht','gehen','geht','gehen'],
  mögen:['mag','magst','mag','mögen','mögt','mögen'], haben:['habe','hast','hat','haben','habt','haben'], sein:['bin','bist','ist','sind','seid','sind'],
  kochen:['koche','kochst','kocht','kochen','kocht','kochen'], bestellen:['bestelle','bestellst','bestellt','bestellen','bestellt','bestellen'],
  verlieren:['verliere','verlierst','verliert','verlieren','verliert','verlieren'], bekommen:['bekomme','bekommst','bekommt','bekommen','bekommt','bekommen'],
  schreiben:['schreibe','schreibst','schreibt','schreiben','schreibt','schreiben'], trinken:['trinke','trinkst','trinkt','trinken','trinkt','trinken'],
  suchen:['suche','suchst','sucht','suchen','sucht','suchen'], brauchen:['brauche','brauchst','braucht','brauchen','braucht','brauchen'],
  spielen:['spiele','spielst','spielt','spielen','spielt','spielen'], besuchen:['besuche','besuchst','besucht','besuchen','besucht','besuchen'],
  verkaufen:['verkaufe','verkaufst','verkauft','verkaufen','verkauft','verkaufen'],
  // separable verbs: main-clause finite part only
  aufstehen:['stehe','stehst','steht','stehen','steht','stehen'], einkaufen:['kaufe','kaufst','kauft','kaufen','kauft','kaufen'],
  anrufen:['rufe','rufst','ruft','rufen','ruft','rufen'], abholen:['hole','holst','holt','holen','holt','holen'],
  einladen:['lade','lädst','lädt','laden','ladet','laden'], aufräumen:['räume','räumst','räumt','räumen','räumt','räumen'],
  fernsehen:['sehe','siehst','sieht','sehen','seht','sehen'], mitkommen:['komme','kommst','kommt','kommen','kommt','kommen']
};
const PARTICIPLES = {gehen:'gegangen',fahren:'gefahren',kommen:'gekommen',bleiben:'geblieben',kaufen:'gekauft',essen:'gegessen',trinken:'getrunken',lesen:'gelesen',schreiben:'geschrieben',sehen:'gesehen',nehmen:'genommen',finden:'gefunden',tragen:'getragen',treffen:'getroffen',helfen:'geholfen',vergessen:'vergessen',verlieren:'verloren',bekommen:'bekommen',schließen:'geschlossen',waschen:'gewaschen',schlafen:'geschlafen',besuchen:'besucht',bestellen:'bestellt',bezahlen:'bezahlt',reparieren:'repariert',verkaufen:'verkauft',aufstehen:'aufgestanden',einkaufen:'eingekauft',anrufen:'angerufen',abholen:'abgeholt',einladen:'eingeladen',aufräumen:'aufgeräumt',fernsehen:'ferngesehen',mitkommen:'mitgekommen',wohnen:'gewohnt',arbeiten:'gearbeitet',lernen:'gelernt',spielen:'gespielt',kochen:'gekocht',öffnen:'geöffnet',antworten:'geantwortet',suchen:'gesucht',brauchen:'gebraucht'};
const SEIN = new Set(['gehen','fahren','kommen','bleiben','aufstehen','mitkommen']);

test('present tense: every verb matches the hand-verified paradigm', () => {
  for (const [inf, forms] of Object.entries(ORACLE)) {
    const v = DE.VL[inf]; assert.ok(v, 'verb in lexicon: ' + inf);
    assert.deepEqual(DE.SLOTS.map(s => DE.fin(v, s)), forms, inf);
  }
});
test('every lexicon verb has an oracle entry (nothing unchecked)', () => {
  const missing = Object.keys(DE.VL).filter(k => !ORACLE[k]);
  assert.deepEqual(missing, []);
});
test('participles and auxiliaries', () => {
  for (const [inf, pp] of Object.entries(PARTICIPLES)) {
    const v = DE.VL[inf]; assert.equal(v.pp, pp, inf); assert.equal(v.aux, SEIN.has(inf) ? 'sein' : 'haben', inf + ' aux');
  }
});
test('modal verbs, preterite and Konjunktiv II tables', () => {
  assert.deepEqual(DE.SLOTS.map(s => DE.T.können[s]), ['kann','kannst','kann','können','könnt','können']);
  assert.deepEqual(DE.SLOTS.map(s => DE.T.müssen[s]), ['muss','musst','muss','müssen','müsst','müssen']);
  assert.deepEqual(DE.SLOTS.map(s => DE.T.wollen[s]), ['will','willst','will','wollen','wollt','wollen']);
  assert.deepEqual(DE.SLOTS.map(s => DE.T.dürfen[s]), ['darf','darfst','darf','dürfen','dürft','dürfen']);
  assert.deepEqual(DE.SLOTS.map(s => DE.PRET.sein[s]), ['war','warst','war','waren','wart','waren']);
  assert.deepEqual(DE.SLOTS.map(s => DE.PRET.haben[s]), ['hatte','hattest','hatte','hatten','hattet','hatten']);
  assert.deepEqual(DE.SLOTS.map(s => DE.PRET.müssen[s]), ['musste','musstest','musste','mussten','musstet','mussten']);
  assert.deepEqual(DE.SLOTS.map(s => DE.K2.würde[s]), ['würde','würdest','würde','würden','würdet','würden']);
  assert.deepEqual(DE.SLOTS.map(s => DE.K2.hätte[s]), ['hätte','hättest','hätte','hätten','hättet','hätten']);
  assert.deepEqual(DE.SLOTS.map(s => DE.K2.wäre[s]), ['wäre','wärst','wäre','wären','wärt','wären']);
});
test('articles, contractions and adjective endings', () => {
  const n = de => DE.NOUNS.find(x => x.de === de);
  const s = (noun, o) => DE.np(n(noun), o).de.join(' ');
  assert.equal(s('Apfel', {det:'def', case:'akk'}), 'den Apfel');
  assert.equal(s('Apfel', {det:'indef', case:'akk'}), 'einen Apfel');
  assert.equal(s('Suppe', {det:'def', case:'dat'}), 'der Suppe');
  assert.equal(s('Auto', {det:'def', case:'dat'}), 'dem Auto');
  assert.equal(s('Hund', {det:'neg', case:'akk'}), 'keinen Hund');
  assert.equal(s('Bruder', {det:'poss', case:'akk'}), 'meinen Bruder');
  assert.equal(s('Käse', {det:'indef', case:'akk'}), 'Käse');         // mass noun: no article
  assert.equal(s('Apfel', {det:'none', case:'akk', pl:true}), 'Äpfel');
  assert.equal(s('Buch', {det:'def', case:'dat', pl:true}), 'den Büchern');
  assert.equal(s('Auto', {det:'def', case:'dat', pl:true}), 'den Autos');
  assert.equal(s('Computer', {det:'indef', case:'nom', adj:'neu'}), 'ein neuer Computer');
  assert.equal(s('Auto', {det:'indef', case:'nom', adj:'neu'}), 'ein neues Auto');
  assert.equal(s('Computer', {det:'def', case:'akk', adj:'teuer'}), 'den teuren Computer');
  assert.equal(s('Buch', {det:'none', case:'akk', pl:true, adj:'interessant'}), 'interessante Bücher');
  assert.equal(s('Buch', {det:'none', case:'dat', pl:true, adj:'interessant'}), 'interessanten Büchern');
  assert.equal(s('Milch', {det:'none', case:'dat', adj:'kalt'}), 'kalter Milch');
  const pp = (noun, k) => DE.pPhrase(n(noun), k).de.join(' ');
  assert.equal(pp('Kino','dir'), 'ins Kino'); assert.equal(pp('Kino','loc'), 'im Kino');
  assert.equal(pp('Bahnhof','dir'), 'zum Bahnhof'); assert.equal(pp('Bahnhof','loc'), 'am Bahnhof');
  assert.equal(pp('Universität','dir'), 'zur Universität'); assert.equal(pp('Schule','dir'), 'in die Schule');
  assert.equal(pp('Schule','loc'), 'in der Schule'); assert.equal(pp('Park','dir'), 'in den Park'); assert.equal(pp('Markt','loc'), 'auf dem Markt');
});

// ---- golden sentences built from explicit specs ----
const P = (i) => DE.mkSubj(DE.PRON[i]);       // 0 ich,1 du,2 er,3 sie,4 wir,5 ihr,6 sie(pl)
const noun = de => DE.NOUNS.find(x => x.de === de);
function spec(verb, subj, o) {
  o = o || {};
  const p = DE.makePred(3, {verb, noun: o.noun && noun(o.noun)});
  if (o.groups) p.groups = o.groups;
  return Object.assign({kind:'decl', subj, p, tense:'pres', modal:null, neg:false, adv:null, front:null}, o.spec || {});
}
test('golden sentences', () => {
  const R = s => DE.render(s);
  let s = spec('aufstehen', P(0), {groups:[{k:'timeum', de:['um','sieben','Uhr'], en:"at seven o'clock", rank:4}]});
  assert.equal(R(s).de, 'Ich stehe um sieben Uhr auf.');
  assert.equal(R(Object.assign({}, s, {tense:'perf'})).de, 'Ich bin um sieben Uhr aufgestanden.');
  assert.equal(R(Object.assign({}, s, {modal:'müssen'})).de, 'Ich muss um sieben Uhr aufstehen.');
  assert.equal(R(Object.assign({}, s, {neg:true})).de, 'Ich stehe nicht um sieben Uhr auf.');
  assert.equal(R(Object.assign({}, s, {kind:'yn', subj:P(1)})).de, 'Stehst du um sieben Uhr auf?');
  assert.equal(DE.buildDE(Object.assign({}, s, {kind:'sub', conn:'weil', connEn:'because'})).join(' '), 'weil ich um sieben Uhr aufstehe');
  s = spec('kaufen', P(1), {noun:'Apfel', groups:[DE.objGroup(DE.VL.kaufen, 3, {noun:noun('Apfel'), det:'def', pl:false})]});
  assert.equal(R(s).de, 'Du kaufst den Apfel.'); assert.equal(R(s).en, 'You buy the apple.');
  assert.equal(R(Object.assign({}, s, {neg:true})).de, 'Du kaufst den Apfel nicht.');
  assert.equal(R(Object.assign({}, s, {neg:true})).en, 'You do not buy the apple.');
  assert.equal(R(Object.assign({}, s, {tense:'perf'})).de, 'Du hast den Apfel gekauft.');
  assert.equal(R(Object.assign({}, s, {tense:'perf'})).en, 'You bought the apple.');
  assert.equal(R(Object.assign({}, s, {modal:'können'})).de, 'Du kannst den Apfel kaufen.');
  assert.equal(R(Object.assign({}, s, {modal:'können', neg:true})).en, 'You cannot buy the apple.');
  assert.equal(R(Object.assign({}, s, {adv:DE.PRES_TIME[0], front:'adv'})).de, 'Heute kaufst du den Apfel.');
  assert.equal(R(Object.assign({}, s, {adv:DE.PRES_TIME[0], front:'adv'})).en, 'You are buying the apple today.');
  assert.equal(R(Object.assign({}, s, {kind:'yn'})).de, 'Kaufst du den Apfel?'); assert.equal(R(Object.assign({}, s, {kind:'yn'})).en, 'Do you buy the apple?');
  s = spec('gehen', P(4), {groups:[DE.dirPlaceGroup(noun('Kino'))]});
  assert.equal(R(s).de, 'Wir gehen ins Kino.'); assert.equal(R(s).en, 'We go to the cinema.');
  assert.equal(R(Object.assign({}, s, {tense:'perf'})).de, 'Wir sind ins Kino gegangen.');
  s = spec('gehen', P(2), {groups:[DE.dirPlaceGroup(noun('Bahnhof'))]}); assert.equal(R(s).de, 'Er geht zum Bahnhof.');
  s = spec('haben', P(0), {groups:[DE.toNeg(DE.objGroup(DE.VL.haben, 3, {noun:noun('Hund'), det:'indef'}))], spec:{neg:true}});
  assert.equal(R(s).de, 'Ich habe keinen Hund.'); assert.equal(R(s).en, 'I do not have a dog.');
  s = spec('sein', P(0), {groups:[{k:'adj', de:['müde'], en:'tired', rank:1}]});
  assert.equal(R(s).de, 'Ich bin müde.'); assert.equal(R(Object.assign({}, s, {neg:true})).de, 'Ich bin nicht müde.');
  assert.equal(R(Object.assign({}, s, {tense:'pret', adv:DE.PAST_TIME[0], front:'adv'})).de, 'Gestern war ich müde.');
  assert.equal(R(Object.assign({}, s, {tense:'pret', adv:DE.PAST_TIME[0], front:'adv'})).en, 'I was tired yesterday.');
  s = spec('helfen', P(2), {groups:[DE.objGroup(DE.VL.helfen, 3, {noun:noun('Lehrer'), det:'def'})]});
  assert.equal(R(s).de, 'Er hilft dem Lehrer.');
});

// ---- independent structural validators over thousands of generated sentences ----
const FIN = new Set();
Object.values(DE.VL).forEach(v => { DE.SLOTS.forEach(s => { const f = DE.fin(v, s); FIN.add(f); if (v.sep) FIN.add(v.pre + f); }); });
[DE.T, DE.PRET, DE.K2].forEach(t => Object.values(t).forEach(tb => Object.values(tb).forEach(f => FIN.add(f))));
['regnet','schneit','scheint'].forEach(w => FIN.add(w));   // weather verbs used in ready-made weather clauses
const PPS = new Set(Object.values(DE.VL).map(v => v.pp).filter(Boolean));
test('structure: verb position, participle at the end, English sanity (20k sentences)', () => {
  DE.seed(1234);
  let n = 0, subs = 0;
  for (let i = 0; i < 20000; i++) {
    const L = 1 + i % 3, cx = 1 + i % 4;
    const spec = DE.makeSpec({level:L, kind:'decl', cx, randomNeg:0.25, randomModal:0.3, tense:(L>=2 && i%4===0) ? 'perf' : 'pres'});
    if (!spec) continue; n++;
    const r = DE.render(spec);
    assert.ok(!/undefined|NaN|\[object|null/.test(r.de + r.en), r.de + ' | ' + r.en);
    assert.ok(/^[A-ZÄÖÜ]/.test(r.de) && /[.?]$/.test(r.de), r.de);
    assert.ok(/^[A-Z]/.test(r.en) && /[.?]$/.test(r.en), r.en);
    assert.ok(!/\b(\w+) \1\b/i.test(r.en.replace(/had had/i, '')), 'repeated word: ' + r.en);
    assert.ok(!/  |, ,|\s[.,?]/.test(r.de + r.en), 'spacing: ' + r.de + ' | ' + r.en);
    const t = r.tokens, fi = t.findIndex(x => FIN.has(x));
    assert.ok(fi >= 1 && fi <= 3, 'finite verb must be the 2nd constituent: ' + r.de);
    const subjLen = spec.front === 'adv' ? 0 : 1;
    if (spec.front !== 'adv') assert.equal(fi, 1, 'V2: ' + r.de);
    else assert.equal(fi, spec.adv.de.length, 'V2 after fronted adverbial: ' + r.de);
    if (spec.tense === 'perf') assert.ok(PPS.has(t[t.length - 1]), 'participle last: ' + r.de);
    if (spec.modal) { assert.ok(!FIN.has(t[t.length - 1]) || t[t.length-1] === spec.p.v.inf, r.de); }
    if (spec.p.v.sep && spec.tense === 'pres' && !spec.modal) assert.equal(t[t.length - 1], spec.p.v.pre, 'prefix at the end: ' + r.de);
  }
  assert.ok(n > 15000, 'generator rarely fails: ' + n);
  for (let i = 0; i < 6000; i++) {
    const c = DE.complexSentence(1 + i % 3); if (!c) continue; subs++;
    assert.ok(!/undefined|NaN/.test(c.de + c.en), c.de);
    const sub = c.subTokens; assert.ok(FIN.has(sub[sub.length - 1].replace(/[,.]$/, '')), 'verb last in sub-clause: ' + c.de);
    if (c.order === 'sub-first') { const t = c.tokens, ci = t.findIndex(x => x.endsWith(',')); assert.ok(FIN.has(t[ci + 1]), 'inversion after sub-clause: ' + c.de); }
  }
  assert.ok(subs > 4000);
  for (let i = 0; i < 1500; i++) {
    const k = DE.konjunktivSentence(3); if (k) { assert.ok(/^Wenn .+, würd(e|en) (ich|wir) /.test(k.de), k.de); assert.ok(!/undefined/.test(k.en)); }
    const rel = DE.relativeSentence(3); if (rel) assert.ok(/^Das ist (der|die|das) \S+, (den|die|das) ich /.test(rel.de), rel.de);
    const pa = DE.passiveSentence(3); if (pa) assert.ok(/ (wird|werden) \S+\.$/.test(pa.de), pa.de);
  }
});
test('no word forms invented: every noun plural/gender pair is unique and sane', () => {
  const seen = new Set();
  DE.NOUNS.forEach(n => { assert.ok(['der','die','das'].includes(n.art)); assert.ok(!seen.has(n.de), 'duplicate noun ' + n.de); seen.add(n.de); if (n.pl) assert.ok(n.pl.length >= 2 && n.pl !== '' ); assert.ok(n.en); });
});
