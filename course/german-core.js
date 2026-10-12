/*
 * Sprachtreppe — German grammar core (v8)
 * Pure logic, no DOM. Morphology + curated lexicon + clause builder (German AND English gloss).
 * Everything generated here is built from grammatical rules and semantic tags, never from random word swaps.
 */
(function (root) {
'use strict';

/* ---------- random helpers (seedable for tests) ---------- */
let _rng = Math.random;
function mulberry(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const seed = s => { _rng = (s==null) ? Math.random : mulberry(s>>>0); };
const rnd = () => _rng();
const pick = a => a[Math.floor(rnd()*a.length)];
const shuffle = a => { const x=a.slice(); for(let i=x.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [x[i],x[j]]=[x[j],x[i]]; } return x; };
const sample = (a,n) => shuffle(a).slice(0,n);
const chance = p => rnd() < p;
const cap = s => s ? s.charAt(0).toUpperCase()+s.slice(1) : s;
const uniq = a => [...new Set(a)];

/* ---------- persons ---------- */
const PRON = [
  {de:'ich', en:'I',    slot:'ich', e3:false},
  {de:'du',  en:'you',  slot:'du',  e3:false},
  {de:'er',  en:'he',   slot:'er',  e3:true},
  {de:'sie', en:'she',  slot:'er',  e3:true},
  {de:'wir', en:'we',   slot:'wir', e3:false},
  {de:'ihr', en:'you all', slot:'ihr', e3:false},
  {de:'sie', en:'they', slot:'sie', e3:false}
];
const NAMES = ['Anna','Ben','Clara','David','Lena','Jonas','Mia','Paul','Sara','Tim','Priya','Rahul'];
const SLOTS = ['ich','du','er','wir','ihr','sie'];
function mkSubj(p){ return {de:p.de, en:p.en, slot:p.slot, e3:p.e3, name:false}; }
function randomSubject(opts){
  opts = opts || {};
  if(chance(opts.names===false ? 0 : 0.25)){ const n = pick(NAMES); return {de:n, en:n, slot:'er', e3:true, name:true}; }
  return mkSubj(pick(PRON));
}

/* ---------- verb tables ---------- */
const T = {
  sein:{ich:'bin',du:'bist',er:'ist',wir:'sind',ihr:'seid',sie:'sind'},
  haben:{ich:'habe',du:'hast',er:'hat',wir:'haben',ihr:'habt',sie:'haben'},
  werden:{ich:'werde',du:'wirst',er:'wird',wir:'werden',ihr:'werdet',sie:'werden'},
  können:{ich:'kann',du:'kannst',er:'kann',wir:'können',ihr:'könnt',sie:'können'},
  müssen:{ich:'muss',du:'musst',er:'muss',wir:'müssen',ihr:'müsst',sie:'müssen'},
  wollen:{ich:'will',du:'willst',er:'will',wir:'wollen',ihr:'wollt',sie:'wollen'},
  dürfen:{ich:'darf',du:'darfst',er:'darf',wir:'dürfen',ihr:'dürft',sie:'dürfen'},
  sollen:{ich:'soll',du:'sollst',er:'soll',wir:'sollen',ihr:'sollt',sie:'sollen'},
  möchten:{ich:'möchte',du:'möchtest',er:'möchte',wir:'möchten',ihr:'möchtet',sie:'möchten'}
};
const wasForms = (st) => ({ich:st,du:st+'st',er:st,wir:st+'n',ihr:st+'t',sie:st+'n'});
const PRET = {
  sein:{ich:'war',du:'warst',er:'war',wir:'waren',ihr:'wart',sie:'waren'},
  haben:wasForms('hatte'), können:wasForms('konnte'), müssen:wasForms('musste'),
  wollen:wasForms('wollte'), dürfen:wasForms('durfte')
};
const K2 = {
  würde:wasForms('würde'), hätte:wasForms('hätte'), könnte:wasForms('könnte'),
  wäre:{ich:'wäre',du:'wärst',er:'wäre',wir:'wären',ihr:'wärt',sie:'wären'}
};
const MODALS_PRES = ['können','müssen','wollen','möchten','dürfen','sollen'];
const MODALS_PRET = ['können','müssen','wollen','dürfen'];
const MODAL_EN = {
  können:{aux:'can', pastAux:'could'},
  müssen:{lex:{b:'have to', s:'has to', p:'had to'}},
  wollen:{lex:{b:'want to', s:'wants to', p:'wanted to'}},
  möchten:{aux:'would', pre:'like to'},
  dürfen:{be:true},
  sollen:{aux:'should'}
};

function needsE(st){ return /[dt]$/.test(st) || /(?:[^aeiouäöüyhlrmn]|ch)[mn]$/i.test(st); }
function regularPresent(stem, slot){
  const E = {ich:'e', du:'st', er:'t', wir:'en', ihr:'t', sie:'en'};
  let e = E[slot];
  if(slot==='du' && /[sßxz]$/.test(stem)) e = 't';
  else if(['du','er','ihr'].includes(slot) && needsE(stem)) e = 'e' + e;
  return stem + e;
}
/* finite present form of a lexicon verb for a slot (handles stem changes + separable verbs) */
function fin(v, slot){
  if(T[v.inf]) return T[v.inf][slot];
  const base = v.sep ? v.inf.slice(v.pre.length) : v.inf;
  if(v.pres && v.pres[slot]) return v.pres[slot];
  const stem = base.endsWith('en') ? base.slice(0,-2) : base.slice(0,-1);
  return regularPresent(stem, slot);
}

/* ---------- English helpers ---------- */
function en3(b){
  const w=b.split(' '); let h=w[0];
  if(h==='have') h='has'; else if(/(s|x|z|ch|sh|o)$/.test(h)) h+='es'; else if(/[^aeiou]y$/.test(h)) h=h.slice(0,-1)+'ies'; else h+='s';
  w[0]=h; return w.join(' ');
}
const EV = (b,p,ing,pp,s) => ({b,p,ing,pp:pp||p,s:s||en3(b)});
const artEn = w => /^[aeiou]/i.test(w) ? 'an' : 'a';

/* ---------- lexicon: nouns ---------- */
const N = (art,de,pl,en,enPl,t,lvl,x) => Object.assign({art,de,pl,en,enPl,t:t.split(' '),lvl,mass:false},x||{});
const NOUNS = [
  // food & drink
  N('das','Brot',null,'bread',null,'food',1,{mass:true}),
  N('der','Apfel','Äpfel','apple','apples','food',1),
  N('der','Käse',null,'cheese',null,'food',1,{mass:true}),
  N('der','Reis',null,'rice',null,'food cook',1,{mass:true}),
  N('der','Fisch',null,'fish',null,'food cook',1,{mass:true}),
  N('der','Kuchen','Kuchen','cake','cakes','food pay',1),
  N('der','Salat','Salate','salad','salads','food',1),
  N('das','Ei','Eier','egg','eggs','food cook',1),
  N('die','Suppe','Suppen','soup','soups','food cook',1),
  N('die','Banane','Bananen','banana','bananas','food',1),
  N('die','Tomate','Tomaten','tomato','tomatoes','food',1),
  N('die','Kartoffel','Kartoffeln','potato','potatoes','food cook',1),
  N('die','Schokolade',null,'chocolate',null,'food',2,{mass:true}),
  N('die','Butter',null,'butter',null,'food',2,{mass:true}),
  N('das','Wasser',null,'water',null,'drink',1,{mass:true}),
  N('der','Tee',null,'tea',null,'drink cook',1,{mass:true}),
  N('der','Kaffee',null,'coffee',null,'drink cook pay',1,{mass:true}),
  N('der','Saft','Säfte','juice','juices','drink pay',1),
  N('die','Milch',null,'milk',null,'drink',1,{mass:true}),
  N('die','Limonade','Limonaden','lemonade','lemonades','drink',2),
  // reading / writing
  N('das','Buch','Bücher','book','books','read book',1),
  N('die','Zeitung','Zeitungen','newspaper','newspapers','read book',1),
  N('der','Brief','Briefe','letter','letters','read write',1),
  N('die','E-Mail','E-Mails','email','emails','read write',1),
  N('der','Text','Texte','text','texts','read write',1),
  N('die','Zeitschrift','Zeitschriften','magazine','magazines','read book',2),
  // clothes
  N('die','Jacke','Jacken','jacket','jackets','wear wash',1),
  N('das','Hemd','Hemden','shirt','shirts','wear wash',1),
  N('die','Mütze','Mützen','cap','caps','wear',2),
  N('der','Mantel','Mäntel','coat','coats','wear wash',1),
  N('das','Kleid','Kleider','dress','dresses','wear wash',1),
  // devices
  N('das','Handy','Handys','mobile phone','mobile phones','dev fix',1),
  N('der','Computer','Computer','computer','computers','dev fix',1),
  N('der','Laptop','Laptops','laptop','laptops','dev fix',1),
  N('der','Fernseher','Fernseher','television','televisions','dev fix',1),
  N('die','Kamera','Kameras','camera','cameras','dev',2),
  N('das','Radio','Radios','radio','radios','dev fix',1),
  // everyday things
  N('die','Tasche','Taschen','bag','bags','stuff wear',1),
  N('der','Schlüssel','Schlüssel','key','keys','stuff',1),
  N('die','Fahrkarte','Fahrkarten','ticket','tickets','stuff pay',1),
  N('der','Tisch','Tische','table','tables','stuff fix',1),
  N('der','Stuhl','Stühle','chair','chairs','stuff fix',1),
  N('die','Lampe','Lampen','lamp','lamps','stuff fix',1),
  N('die','Uhr','Uhren','clock','clocks','stuff fix',1),
  N('der','Koffer','Koffer','suitcase','suitcases','stuff open',1),
  N('der','Regenschirm','Regenschirme','umbrella','umbrellas','stuff',2),
  N('die','Tür','Türen','door','doors','open close',1),
  N('das','Fenster','Fenster','window','windows','open close',1),
  // vehicles
  N('der','Zug','Züge','train','trains','vehicle',1,{enBy:'train'}),
  N('der','Bus','Busse','bus','buses','vehicle',1,{enBy:'bus'}),
  N('das','Auto','Autos','car','cars','vehicle wash fix',1,{enBy:'car'}),
  N('das','Fahrrad','Fahrräder','bike','bikes','vehicle wash fix',1,{enBy:'bike'}),
  N('die','U-Bahn','U-Bahnen','subway','subways','vehicle',1,{enBy:'subway'}),
  N('das','Flugzeug','Flugzeuge','plane','planes','vehicle',2,{enBy:'plane'}),
  N('das','Taxi','Taxis','taxi','taxis','vehicle',1,{enBy:'taxi'}),
  N('die','Straßenbahn','Straßenbahnen','tram','trams','vehicle',2,{enBy:'tram'}),
  // places: loc / dir = {p: preposition, c: case}
  N('die','Schule','Schulen','school','schools','place go work far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'at school',enDir:'to school'}),
  N('der','Supermarkt','Supermärkte','supermarket','supermarkets','place go work shop far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'at the supermarket',enDir:'to the supermarket'}),
  N('der','Bahnhof','Bahnhöfe','station','stations','place go far',1,{loc:{p:'an',c:'dat'},dir:{p:'zu',c:'dat'},enLoc:'at the station',enDir:'to the station'}),
  N('die','Bibliothek','Bibliotheken','library','libraries','place go work visit far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the library',enDir:'to the library'}),
  N('der','Park','Parks','park','parks','place go visit far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the park',enDir:'to the park'}),
  N('das','Kino','Kinos','cinema','cinemas','place go visit far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'at the cinema',enDir:'to the cinema'}),
  N('das','Restaurant','Restaurants','restaurant','restaurants','place go work visit far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the restaurant',enDir:'to the restaurant'}),
  N('das','Café','Cafés','café','cafés','place go work visit',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the café',enDir:'to the café'}),
  N('die','Bäckerei','Bäckereien','bakery','bakeries','place go work shop',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'at the bakery',enDir:'to the bakery'}),
  N('die','Apotheke','Apotheken','pharmacy','pharmacies','place go work shop',2,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'at the pharmacy',enDir:'to the pharmacy'}),
  N('die','Bank','Banken','bank','banks','place go work',2,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'at the bank',enDir:'to the bank'}),
  N('das','Krankenhaus','Krankenhäuser','hospital','hospitals','place go work far',2,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the hospital',enDir:'to the hospital'}),
  N('der','Flughafen','Flughäfen','airport','airports','place go far',2,{loc:{p:'an',c:'dat'},dir:{p:'zu',c:'dat'},enLoc:'at the airport',enDir:'to the airport'}),
  N('das','Museum','Museen','museum','museums','place go work visit far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the museum',enDir:'to the museum'}),
  N('der','Garten','Gärten','garden','gardens','place go room',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the garden',enDir:'to the garden'}),
  N('das','Büro','Büros','office','offices','place go work room far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the office',enDir:'to the office'}),
  N('das','Hotel','Hotels','hotel','hotels','place go work far',2,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the hotel',enDir:'to the hotel'}),
  N('die','Universität','Universitäten','university','universities','place go work far',2,{loc:{p:'an',c:'dat'},dir:{p:'zu',c:'dat'},enLoc:'at university',enDir:'to university'}),
  N('die','Küche','Küchen','kitchen','kitchens','place go room',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the kitchen',enDir:'to the kitchen'}),
  N('die','Stadt','Städte','city','cities','place go far',1,{loc:{p:'in',c:'dat'},dir:{p:'in',c:'akk'},enLoc:'in the city',enDir:'to the city'}),
  N('der','Markt','Märkte','market','markets','place go shop far',2,{loc:{p:'auf',c:'dat'},dir:{p:'auf',c:'akk'},enLoc:'at the market',enDir:'to the market'}),
  N('das','Zimmer','Zimmer','room','rooms','room',1),
  N('die','Wohnung','Wohnungen','flat','flats','room',1),
  // people
  N('der','Freund','Freunde','friend','friends','people',1),
  N('die','Freundin','Freundinnen','female friend','female friends','people',1),
  N('der','Lehrer','Lehrer','teacher','teachers','people',1),
  N('die','Lehrerin','Lehrerinnen','teacher','teachers','people',1),
  N('der','Arzt','Ärzte','doctor','doctors','people',1),
  N('die','Ärztin','Ärztinnen','doctor','doctors','people',1),
  N('die','Kollegin','Kolleginnen','colleague','colleagues','people',2),
  N('der','Chef','Chefs','boss','bosses','people',2),
  N('die','Chefin','Chefinnen','boss','bosses','people',2),
  N('der','Bruder','Brüder','brother','brothers','family people',1),
  N('die','Schwester','Schwestern','sister','sisters','family people',1),
  N('die','Mutter','Mütter','mother','mothers','family people',1),
  N('der','Vater','Väter','father','fathers','family people',1),
  N('die','Tochter','Töchter','daughter','daughters','family people',2),
  N('der','Onkel','Onkel','uncle','uncles','family people',2),
  N('die','Tante','Tanten','aunt','aunts','family people',2),
  // animals
  N('der','Hund','Hunde','dog','dogs','animal',1),
  N('die','Katze','Katzen','cat','cats','animal',1),
  N('der','Vogel','Vögel','bird','birds','animal',1),
  N('das','Pferd','Pferde','horse','horses','animal',2),
  N('die','Zeit',null,'time',null,'abs',1,{mass:true}),
  N('das','Geld',null,'money',null,'abs',1,{mass:true})
];
const GEN = {der:'m', die:'f', das:'n'};
const gOf = n => GEN[n.art];
const nounsBy = (tags, lvl, extra) => NOUNS.filter(n => n.lvl<=lvl && n.t.some(t=>tags.includes(t)) && (!extra || extra(n)));

const CITIES = ['Berlin','Hamburg','München','Köln','Wien','Zürich','Dresden','Bremen','Leipzig','Ahmedabad','Mumbai','Delhi','Pune','Jaipur'];
const LANGS = [{de:'Deutsch',en:'German'},{de:'Englisch',en:'English'},{de:'Spanisch',en:'Spanish'},{de:'Französisch',en:'French'}];
const GAMES = [{de:'Fußball',en:'football'},{de:'Tennis',en:'tennis'},{de:'Schach',en:'chess'},{de:'Gitarre',en:'the guitar'},{de:'Klavier',en:'the piano'}];

/* ---------- adjectives ---------- */
const ADJ = {
  neu:{en:'new'}, alt:{en:'old'}, groß:{en:'big'}, klein:{en:'small'}, gut:{en:'good'}, schön:{en:'nice'},
  teuer:{en:'expensive',decl:'teur'}, billig:{en:'cheap'}, modern:{en:'modern'}, bequem:{en:'comfortable'},
  warm:{en:'warm'}, kalt:{en:'cold'}, heiß:{en:'hot'}, interessant:{en:'interesting'}, lang:{en:'long'},
  frisch:{en:'fresh'}, lecker:{en:'tasty'}, gesund:{en:'healthy'}, nett:{en:'nice'}, freundlich:{en:'friendly'}, jung:{en:'young'}
};
const GENERAL_ADJ = ['neu','alt','groß','klein','gut','schön','teuer','billig','modern'];
const ADJ_FOR = {
  stuff:GENERAL_ADJ, dev:GENERAL_ADJ, vehicle:GENERAL_ADJ, wear:GENERAL_ADJ.concat(['bequem','warm']),
  read:['interessant','lang','gut','neu','alt','schön'], food:['frisch','lecker','gesund','gut','teuer','billig'],
  drink:['kalt','heiß','warm','frisch','gut','lecker'], place:['groß','klein','alt','neu','schön','modern'],
  animal:['groß','klein','alt','schön'], people:['nett','freundlich','jung','alt'], family:['nett','freundlich','jung','alt'],
  room:['groß','klein','neu','alt','schön','modern'], open:['groß','klein','alt','neu'], close:['groß','klein','alt','neu']
};
const ADJ_END = {
  weak:{nom:{m:'e',f:'e',n:'e',p:'en'},akk:{m:'en',f:'e',n:'e',p:'en'},dat:{m:'en',f:'en',n:'en',p:'en'}},
  mixed:{nom:{m:'er',f:'e',n:'es',p:'en'},akk:{m:'en',f:'e',n:'es',p:'en'},dat:{m:'en',f:'en',n:'en',p:'en'}},
  strong:{nom:{m:'er',f:'e',n:'es',p:'e'},akk:{m:'en',f:'e',n:'es',p:'e'},dat:{m:'em',f:'er',n:'em',p:'en'}}
};
function adjFor(n){ for(const t of n.t){ if(ADJ_FOR[t]) return ADJ_FOR[t]; } return GENERAL_ADJ; }
function adjForm(adjKey, det, c, g){
  const type = det==='def' ? 'weak' : det==='none' ? 'strong' : 'mixed';
  return (ADJ[adjKey].decl || adjKey) + ADJ_END[type][c][g];
}
function adjEndingOf(adjKey, det, c, g){ return ADJ_END[det==='def'?'weak':det==='none'?'strong':'mixed'][c][g]; }

/* ---------- determiners & noun phrases ---------- */
const DEF = {nom:{m:'der',f:'die',n:'das',p:'die'},akk:{m:'den',f:'die',n:'das',p:'die'},dat:{m:'dem',f:'der',n:'dem',p:'den'}};
const IND = {nom:{m:'ein',f:'eine',n:'ein'},akk:{m:'einen',f:'eine',n:'ein'},dat:{m:'einem',f:'einer',n:'einem'}};
const NEG = {nom:{m:'kein',f:'keine',n:'kein',p:'keine'},akk:{m:'keinen',f:'keine',n:'kein',p:'keine'},dat:{m:'keinem',f:'keiner',n:'keinem',p:'keinen'}};
const POS = {nom:{m:'mein',f:'meine',n:'mein',p:'meine'},akk:{m:'meinen',f:'meine',n:'mein',p:'meine'},dat:{m:'meinem',f:'meiner',n:'meinem',p:'meinen'}};
const datPl = pl => /[ns]$/.test(pl) ? pl : pl+'n';
const CONTR = {'in|dat|dem':'im','in|akk|das':'ins','an|dat|dem':'am','zu|dat|dem':'zum','zu|dat|der':'zur'};

function np(n, o){
  o = o || {};
  const c = o.case || 'nom', pl = !!o.pl && !!n.pl;
  const g = pl ? 'p' : gOf(n);
  let d = o.det || 'def';
  if(d==='indef' && (n.mass || pl)) d = 'none';
  if(d==='neg' && false) d = 'neg';
  const noun = pl ? (c==='dat' ? datPl(n.pl) : n.pl) : n.de;
  let dTok = null;
  if(d==='def') dTok = DEF[c][g]; else if(d==='indef') dTok = IND[c][g];
  else if(d==='neg') dTok = NEG[c][g]; else if(d==='poss') dTok = POS[c][g];
  const adjTok = o.adj ? adjForm(o.adj, d, c, g) : null;
  const de = [].concat(dTok?[dTok]:[], adjTok?[adjTok]:[], [noun]);
  const nEn = pl ? (n.enPl || n.en+'s') : n.en;
  const core = (o.adj ? ADJ[o.adj].en+' ' : '') + nEn;
  let en;
  if(d==='def') en = 'the '+core;
  else if(d==='indef') en = artEn(core)+' '+core;
  else if(d==='poss') en = 'my '+core;
  else if(d==='neg') en = (n.mass||pl) ? 'any '+core : artEn(core)+' '+core;
  else en = core;
  return {de, en, det:d, case:c, g, pl, noun:n, adj:o.adj||null, artIdx:dTok?0:-1, adjIdx:adjTok?(dTok?1:0):-1, nounIdx:de.length-1};
}
function pPhrase(n, kind){
  const s = n[kind], g = gOf(n), art = DEF[s.c][g];
  const k = s.p+'|'+s.c+'|'+art;
  if(CONTR[k]) return {de:[CONTR[k], n.de], prep:s.p, case:s.c, art, contracted:true, noun:n};
  return {de:[s.p, art, n.de], prep:s.p, case:s.c, art, contracted:false, noun:n};
}

/* ---------- lexicon: verbs ---------- */
const VL = {};
function V(o){ VL[o.inf]=o; return o; }
const L1=1,L2=2,L3=3;
V({inf:'sein', en:EV('be','was','being','been'), lvl:1, kind:'be', stative:true});
V({inf:'haben', pp:'gehabt', en:EV('have','had','having','had','has'), lvl:1, kind:'obj', obj:'animal dev stuff read wear vehicle family abs', dets:['indef','neg','def'], stative:true, noPerf:true, noModal:true});
V({inf:'kaufen', pp:'gekauft', aux:'haben', en:EV('buy','bought','buying'), lvl:1, kind:'obj', obj:'food drink wear dev book stuff', plOK:true});
V({inf:'brauchen', pp:'gebraucht', aux:'haben', en:EV('need','needed','needing'), lvl:1, kind:'obj', obj:'food drink wear dev book stuff vehicle', plOK:true, stative:true, noModal:true});
V({inf:'suchen', pp:'gesucht', aux:'haben', en:EV('look for','looked for','looking for'), lvl:1, kind:'obj', obj:'wear dev read stuff place people', dets:['def','indef']});
V({inf:'finden', pp:'gefunden', aux:'haben', en:EV('find','found','finding'), lvl:1, kind:'obj', obj:'wear dev read stuff', dets:['def','indef']});
V({inf:'sehen', pp:'gesehen', aux:'haben', pres:{du:'siehst',er:'sieht'}, en:EV('see','saw','seeing','seen'), lvl:1, kind:'obj', obj:'people animal place vehicle', dets:['def','indef'], stative:true});
V({inf:'lesen', pp:'gelesen', aux:'haben', pres:{du:'liest',er:'liest'}, en:EV('read','read','reading','read'), lvl:1, kind:'obj', obj:'read', plOK:true});
V({inf:'schreiben', pp:'geschrieben', aux:'haben', en:EV('write','wrote','writing','written'), lvl:1, kind:'obj', obj:'write', plOK:true});
V({inf:'essen', pp:'gegessen', aux:'haben', pres:{du:'isst',er:'isst'}, en:EV('eat','ate','eating','eaten'), lvl:1, kind:'obj', obj:'food', plOK:true});
V({inf:'trinken', pp:'getrunken', aux:'haben', en:EV('drink','drank','drinking','drunk'), lvl:1, kind:'obj', obj:'drink', plOK:true});
V({inf:'mögen', pp:'gemocht', aux:'haben', en:EV('like','liked','liking'), lvl:1, kind:'obj', obj:'food drink animal family', plOK:true, stative:true, noPerf:true, noModal:true, pres:{ich:'mag',du:'magst',er:'mag',wir:'mögen',ihr:'mögt',sie:'mögen'}});
V({inf:'nehmen', pp:'genommen', aux:'haben', pres:{du:'nimmst',er:'nimmt'}, en:EV('take','took','taking','taken'), lvl:1, kind:'obj', obj:'vehicle food drink', dets:['def','indef']});
V({inf:'tragen', pp:'getragen', aux:'haben', pres:{du:'trägst',er:'trägt'}, en:EV('wear','wore','wearing','worn'), lvl:1, kind:'obj', obj:'wear', dets:['def','indef']});
V({inf:'bleiben', pp:'geblieben', aux:'sein', en:EV('stay','stayed','staying'), lvl:1, kind:'stay'});
V({inf:'kochen', pp:'gekocht', aux:'haben', en:EV('cook','cooked','cooking'), lvl:1, kind:'obj', obj:'cook', dets:['def','indef'], plOK:true});
V({inf:'besuchen', pp:'besucht', aux:'haben', en:EV('visit','visited','visiting'), lvl:1, kind:'obj', obj:'people visit', dets:['def','indef','poss']});
V({inf:'lernen', pp:'gelernt', aux:'haben', en:EV('learn','learned','learning'), lvl:1, kind:'lang', noNeg:true});
V({inf:'spielen', pp:'gespielt', aux:'haben', en:EV('play','played','playing'), lvl:1, kind:'game', noNeg:true});
V({inf:'gehen', pp:'gegangen', aux:'sein', en:EV('go','went','going','gone'), lvl:1, kind:'dir'});
V({inf:'fahren', pp:'gefahren', aux:'sein', pres:{du:'fährst',er:'fährt'}, en:EV('go','went','going','gone'), lvl:1, kind:'drive'});
V({inf:'kommen', pp:'gekommen', aux:'sein', en:EV('come','came','coming','come'), lvl:1, kind:'origin'});
V({inf:'wohnen', pp:'gewohnt', aux:'haben', en:EV('live','lived','living'), lvl:1, kind:'live', stative:true});
V({inf:'arbeiten', pp:'gearbeitet', aux:'haben', en:EV('work','worked','working'), lvl:1, kind:'work'});
V({inf:'schlafen', pp:'geschlafen', aux:'haben', pres:{du:'schläfst',er:'schläft'}, en:EV('sleep','slept','sleeping'), lvl:1, kind:'sleep'});
// separable
V({inf:'aufstehen', sep:true, pre:'auf', pp:'aufgestanden', aux:'sein', en:EV('get up','got up','getting up'), lvl:1, kind:'timeum'});
V({inf:'einkaufen', sep:true, pre:'ein', pp:'eingekauft', aux:'haben', en:EV('go shopping','went shopping','going shopping'), lvl:1, kind:'shop'});
V({inf:'anrufen', sep:true, pre:'an', pp:'angerufen', aux:'haben', en:EV('call','called','calling'), lvl:1, kind:'obj', obj:'people', dets:['def','indef','poss']});
V({inf:'abholen', sep:true, pre:'ab', pp:'abgeholt', aux:'haben', en:EV('pick up','picked up','picking up'), lvl:1, kind:'obj', obj:'people', dets:['def','poss']});
V({inf:'einladen', sep:true, pre:'ein', pp:'eingeladen', aux:'haben', pres:{du:'lädst',er:'lädt'}, en:EV('invite','invited','inviting'), lvl:2, kind:'obj', obj:'people', dets:['def','poss']});
V({inf:'aufräumen', sep:true, pre:'auf', pp:'aufgeräumt', aux:'haben', en:EV('tidy up','tidied up','tidying up'), lvl:1, kind:'obj', obj:'room', dets:['def']});
V({inf:'fernsehen', sep:true, pre:'fern', pp:'ferngesehen', aux:'haben', pres:{du:'siehst',er:'sieht'}, en:EV('watch TV','watched TV','watching TV'), lvl:1, kind:'none'});
V({inf:'mitkommen', sep:true, pre:'mit', pp:'mitgekommen', aux:'sein', en:EV('come along','came along','coming along'), lvl:1, kind:'none'});
// A2 / B1
V({inf:'bestellen', pp:'bestellt', aux:'haben', en:EV('order','ordered','ordering'), lvl:2, kind:'obj', obj:'food drink', plOK:true});
V({inf:'öffnen', pp:'geöffnet', aux:'haben', en:EV('open','opened','opening'), lvl:2, kind:'obj', obj:'open', dets:['def']});
V({inf:'schließen', pp:'geschlossen', aux:'haben', en:EV('close','closed','closing'), lvl:2, kind:'obj', obj:'close', dets:['def']});
V({inf:'waschen', pp:'gewaschen', aux:'haben', pres:{du:'wäschst',er:'wäscht'}, en:EV('wash','washed','washing'), lvl:2, kind:'obj', obj:'wash', dets:['def','poss']});
V({inf:'reparieren', pp:'repariert', aux:'haben', en:EV('repair','repaired','repairing'), lvl:2, kind:'obj', obj:'fix', dets:['def','indef']});
V({inf:'bezahlen', pp:'bezahlt', aux:'haben', en:EV('pay for','paid for','paying for'), lvl:2, kind:'obj', obj:'pay', dets:['def']});
V({inf:'verkaufen', pp:'verkauft', aux:'haben', en:EV('sell','sold','selling'), lvl:2, kind:'obj', obj:'dev wear vehicle stuff', dets:['def','indef']});
V({inf:'treffen', pp:'getroffen', aux:'haben', pres:{du:'triffst',er:'trifft'}, en:EV('meet','met','meeting'), lvl:2, kind:'obj', obj:'people', dets:['def','indef','poss']});
V({inf:'helfen', pp:'geholfen', aux:'haben', pres:{du:'hilfst',er:'hilft'}, en:EV('help','helped','helping'), lvl:2, kind:'obj', obj:'people', dets:['def','poss'], objCase:'dat'});
V({inf:'antworten', pp:'geantwortet', aux:'haben', en:EV('answer','answered','answering'), lvl:2, kind:'obj', obj:'people', dets:['def','poss'], objCase:'dat'});
V({inf:'vergessen', pp:'vergessen', aux:'haben', pres:{du:'vergisst',er:'vergisst'}, en:EV('forget','forgot','forgetting','forgotten'), lvl:3, kind:'obj', obj:'stuff dev read wear', dets:['def']});
V({inf:'verlieren', pp:'verloren', aux:'haben', en:EV('lose','lost','losing'), lvl:3, kind:'obj', obj:'stuff dev wear', dets:['def','indef']});
V({inf:'bekommen', pp:'bekommen', aux:'haben', en:EV('get','got','getting'), lvl:3, kind:'obj', obj:'read stuff', dets:['indef','def']});

const PRES_TIME = [
  {de:['heute'],en:'today',k:'now'}, {de:['morgen'],en:'tomorrow',k:'fut'}, {de:['jetzt'],en:'now',k:'now'},
  {de:['am','Montag'],en:'on Monday',k:'fut'}, {de:['am','Samstag'],en:'on Saturday',k:'fut'},
  {de:['jeden','Tag'],en:'every day',k:'habit'}, {de:['am','Wochenende'],en:'at the weekend',k:'habit'},
  {de:['abends'],en:'in the evening',k:'habit'}, {de:['oft'],en:'often',k:'habit',mid:true}
];
const PAST_TIME = [
  {de:['gestern'],en:'yesterday',k:'past'}, {de:['gestern','Abend'],en:'yesterday evening',k:'past'},
  {de:['letzte','Woche'],en:'last week',k:'past'}, {de:['letztes','Wochenende'],en:'last weekend',k:'past'},
  {de:['vor','zwei','Tagen'],en:'two days ago',k:'past'}
];
const HOURS = [['sechs','six'],['sieben','seven'],['acht','eight'],['neun','nine']];
const ADJ_STATE = [
  ['müde','tired',1],['hungrig','hungry',1],['krank','sick',1],['glücklich','happy',1],['fertig','ready',1],
  ['freundlich','friendly',2],['pünktlich','on time',2],['zufrieden','satisfied',2],['nervös','nervous',2],
  ['beschäftigt','busy',3],['erschöpft','exhausted',3],['enttäuscht','disappointed',3]
];

/* ---------- predicates (verb + arguments) ---------- */
function objGroup(v, lvl, o){
  o = o || {};
  const tags = v.obj.split(' ');
  const pool = nounsBy(tags, lvl, n => v.inf!=='mögen' || true);
  if(!pool.length) return null;
  const n = o.noun || pick(pool);
  const allowed = v.dets || ['def','indef','neg','poss','none'];
  let det;
  const isAbs = n.t.includes('abs');
  const isFam = n.t.includes('family');
  if(o.det) det = o.det;
  else if(isAbs) det = 'none';
  else {
    const opts = [];
    if(allowed.includes('def')) opts.push('def','def');
    if(allowed.includes('indef') && !n.mass) opts.push('indef');
    if(allowed.includes('poss') && (isFam || n.t.includes('people'))) { if(isFam) opts.push('poss','poss'); }
    if(!v.dets && n.mass) opts.push('none');
    if(!opts.length) opts.push('def');
    det = pick(opts);
    if(isFam && v.inf!=='haben' && (det==='indef' || det==='none') && allowed.includes('def')) det = pick(['poss','def']);
  }
  let pl = false;
  if(o.pl!==undefined){ pl = !!o.pl && !!n.pl; if(pl) det = 'none'; }
  else if(!o.noPlural && v.plOK && n.pl && !isFam && chance(0.18)){ pl = true; det = 'none'; }
  if(v.inf==='mögen' && !n.mass && !pl && det==='indef') det = 'def';
  const nph = np(n, {det, case:v.objCase||'akk', pl, adj:o.adj});
  const people = n.t.includes('people');
  return {k:'obj', de:nph.de, en:nph.en, rank:1, np:nph, noun:n,
          ask: v.objCase==='dat' ? 'Wem' : (people ? 'Wen' : 'Was'), askEn: people ? 'Who' : 'What'};
}
function toNeg(g){            // re-render an object group with kein- (only indefinite / bare nouns)
  if(g.k!=='obj' || !g.np) return g;
  if(g.np.det==='indef' || g.np.det==='none'){
    const nph = np(g.noun, {det:'neg', case:g.np.case, pl:g.np.pl, adj:g.np.adj});
    return Object.assign({}, g, {de:nph.de, en:nph.en, np:nph, negd:true});
  }
  return g;
}
function dirPlaceGroup(n){ const pp = pPhrase(n,'dir'); return {k:'dir', de:pp.de, en:n.enDir, rank:2, pp, noun:n, ask:'Wohin', askEn:'Where'}; }
function locPlaceGroup(n){ const pp = pPhrase(n,'loc'); return {k:'loc', de:pp.de, en:n.enLoc, rank:2, pp, noun:n, ask:'Wo', askEn:'Where'}; }
const homeDir = () => ({k:'dir', de:['nach','Hause'], en:'home', rank:2, ask:'Wohin', askEn:'Where', fixed:true});
const homeLoc = () => ({k:'loc', de:['zu','Hause'], en:'at home', rank:2, ask:'Wo', askEn:'Where', fixed:true});
const cityDir = c => ({k:'dir', de:['nach',c], en:'to '+c, rank:2, ask:'Wohin', askEn:'Where', city:c});
const cityLoc = c => ({k:'loc', de:['in',c], en:'in '+c, rank:2, ask:'Wo', askEn:'Where', city:c});
const cityFrom = c => ({k:'origin', de:['aus',c], en:'from '+c, rank:2, ask:'Woher', askEn:'Where', askEnTail:'from', city:c});
function mannerGroup(n, o){ o=o||{}; const nph = np(n,{det:o.det||'def',case:'dat',adj:o.adj}); return {k:'manner', de:['mit'].concat(nph.de), en:'by '+(o.adj?ADJ[o.adj].en+' ':'')+n.enBy, rank:3, np:nph, noun:n, ask:'Wie', askEn:'How'}; }

function makePred(lvl, o){
  o = o || {};
  const cands = Object.values(VL).filter(v => v.lvl<=lvl && (!o.filter || o.filter(v)));
  for(let tries=0; tries<30; tries++){
    const v = o.verb ? VL[o.verb] : pick(cands);
    if(!v) return null;
    const p = predFor(v, lvl, o);
    if(p) return p;
    if(o.verb) return null;
  }
  return null;
}
function predFor(v, lvl, o){
  const groups = [];
  switch(v.kind){
    case 'be': {
      if(chance(0.6) && !o.noAdj){ const a = pick(ADJ_STATE.filter(x=>x[2]<=lvl)); groups.push({k:'adj', de:[a[0]], en:a[1], rank:1, ask:null, adj:a[0]}); }
      else {
        const r = rnd();
        if(r<0.35) groups.push(homeLoc());
        else if(r<0.6) groups.push(cityLoc(pick(CITIES)));
        else groups.push(locPlaceGroup(pick(nounsBy(['go'], lvl))));
      }
      break;
    }
    case 'obj': { const g = objGroup(v, lvl, o); if(!g) return null; groups.push(g); break; }
    case 'lang': { const l = pick(LANGS); groups.push({k:'obj', de:[l.de], en:l.en, rank:1, bare:true, ask:'Was', askEn:'What'}); break; }
    case 'game': { const l = pick(GAMES); groups.push({k:'obj', de:[l.de], en:l.en, rank:1, bare:true, ask:'Was', askEn:'What'}); break; }
    case 'dir': { if(o.noun) groups.push(dirPlaceGroup(o.noun)); else if(chance(0.25)) groups.push(homeDir()); else groups.push(dirPlaceGroup(pick(nounsBy(['go'], lvl)))); break; }
    case 'drive': {
      groups.push(mannerGroup(pick(nounsBy(['vehicle'], lvl))));
      if(chance(0.55)) groups.push(cityDir(pick(CITIES))); else groups.push(dirPlaceGroup(pick(nounsBy(['far'], lvl))));
      break;
    }
    case 'origin': groups.push(cityFrom(pick(CITIES))); break;
    case 'live': { if(chance(0.85)) groups.push(cityLoc(pick(CITIES))); else groups.push(locPlaceGroup(NOUNS.find(n=>n.de==='Stadt'))); break; }
    case 'work': { if(chance(0.25)) groups.push(cityLoc(pick(CITIES))); else groups.push(locPlaceGroup(pick(nounsBy(['work'], lvl)))); break; }
    case 'sleep': if(chance(0.6)) groups.push(homeLoc()); break;
    case 'stay': groups.push(homeLoc()); break;
    case 'timeum': { const h = pick(HOURS); groups.push({k:'timeum', de:['um',h[0],'Uhr'], en:'at '+h[1]+" o'clock", rank:4, ask:'Wann', askEn:'When'}); break; }
    case 'shop': groups.push(locPlaceGroup(pick(nounsBy(['shop'], lvl)))); break;
    case 'none': break;
    default: return null;
  }
  return {v, groups};
}

/* ---------- clause builder ---------- */
/*
 spec: {kind:'decl'|'yn'|'wh'|'sub', subj, p, tense:'pres'|'perf'|'pret'|'k2'|'pass', modal, neg, adv, front, ask, conn}
*/
function verbPieces(spec, sub){
  const sl = spec.subj.slot, v = spec.p.v, m = spec.modal, t = spec.tense;
  if(t==='pass') return {finite:T.werden[sl], tail:[v.pp]};
  if(m){
    if(t==='pret') return {finite:PRET[m][sl], tail:[v.inf]};
    return {finite:T[m][sl], tail:[v.inf]};
  }
  if(t==='perf') return {finite:T[v.aux][sl], tail:[v.pp]};
  if(t==='pret') return {finite:PRET[v.inf][sl], tail:[]};
  if(t==='k2'){
    if(v.inf==='sein') return {finite:K2.wäre[sl], tail:[]};
    if(v.inf==='haben') return {finite:K2.hätte[sl], tail:[]};
    return {finite:K2.würde[sl], tail:[v.inf]};
  }
  if(v.sep){ return sub ? {finite:v.pre+fin(v,sl), tail:[]} : {finite:fin(v,sl), tail:[v.pre]}; }
  return {finite:fin(v,sl), tail:[]};
}
function midTokens(spec, opts){
  opts = opts || {};
  const parts = [];
  const groups = spec.p.groups.filter(g => g !== spec.ask);
  if(spec.adv && spec.front!=='adv' && !opts.noAdv) parts.push({k:'time', de:spec.adv.de});
  groups.forEach(g => parts.push(g));
  if(spec.neg && !groups.some(g=>g.negd)){
    const idx = parts.findIndex(x => ['dir','loc','manner','adj','origin','timeum'].includes(x.k));
    const nt = {k:'neg', de:['nicht']};
    if(idx<0) parts.push(nt); else parts.splice(idx,0,nt);
  }
  return parts;
}
function flat(parts){ return parts.reduce((a,x)=>a.concat(x.de), []); }
function endPunct(spec){ return spec.kind==='yn' || spec.kind==='wh' ? '?' : '.'; }

function layoutDE(spec){
  const subj = spec.subj, vp = verbPieces(spec, spec.kind==='sub');
  const midP = midTokens(spec);
  const mid = midP.map(x => ({r: x.k==='time' ? 'adv' : x.k==='neg' ? 'neg' : 'group', g:x, t:x.de.slice()}));
  const tail = vp.tail.map(x => ({r:'tail', t:[x]}));
  const F = {r:'finite', t:[vp.finite]}, SU = {r:'subj', t:[subj.de]};
  let segs;
  if(spec.kind==='sub'){
    const lead = spec.relPron ? {r:'rel', t:[spec.relPron]} : {r:'conn', t:[spec.conn]};
    segs = [lead, SU].concat(mid, tail, [F]);
  } else if(spec.kind==='yn'){
    segs = [F, SU].concat(mid, tail);
  } else if(spec.kind==='wh'){
    segs = spec.askType==='Wer' ? [{r:'wh', t:['Wer']}, F].concat(mid, tail) : [{r:'wh', t:[spec.ask.ask]}, F, SU].concat(mid, tail);
  } else if(spec.front==='adv' && spec.adv){
    segs = [{r:'adv', t:spec.adv.de.slice(), fronted:true}, F, SU].concat(mid, tail);
  } else if(spec.front==='sub' && spec.subText){
    segs = [{r:'front', t:spec.subText.slice()}, F, SU].concat(mid, tail);
  } else {
    segs = [SU, F].concat(mid, tail);
  }
  return segs;
}
function buildDE(spec){ return layoutDE(spec).reduce((a,s)=>a.concat(s.t), []); }

/* ---- English ---- */
function enParts(spec){
  const S = spec.subj, v = spec.p.v, m = spec.modal, t = spec.tense;
  const I = S.en==='I', e3 = S.e3;
  const beNow = I ? 'am' : (e3 ? 'is' : 'are'), bePast = (I||e3) ? 'was' : 'were';
  const past = (t==='perf' || t==='pret');
  let aux=null, L=null, tail=[];
  const ev = v.en;
  if(t==='pass'){ aux = spec.passPl ? 'are' : 'is'; tail=[ev.pp]; return {aux,L,tail}; }
  if(v.inf==='sein' && !m){ aux = past ? bePast : (t==='k2' ? 'were' : beNow); return {aux,L,tail}; }
  if(m){
    const M = MODAL_EN[m];
    if(past){
      if(m==='können') aux = 'could';
      else if(m==='dürfen'){ aux = bePast; tail=['allowed to', ev.b]; return {aux,L,tail}; }
      else L = {b:M.lex.b, s:M.lex.s, p:M.lex.p};
    } else if(M.be){ aux = beNow; tail.push('allowed to'); }
    else if(M.aux){ aux = M.aux; if(M.pre) tail.push(M.pre); }
    else L = {b:M.lex.b, s:M.lex.s, p:M.lex.p};
    tail.push(ev.b);
    return {aux,L,tail};
  }
  if(t==='k2'){
    if(v.inf==='haben'){ L = {b:'have', s:'has', p:'had'}; spec = Object.assign({}, spec, {tense:'pret'}); return {aux:null, L, tail, forcePast:true}; }
    aux = 'would'; tail=[ev.b]; return {aux,L,tail};
  }
  if(past){ L = {b:ev.b, s:ev.s, p:ev.p}; return {aux:null, L, tail, forcePast:true}; }
  const adv = spec.adv;
  if(!v.stative && adv && (adv.k==='now'||adv.k==='fut') && !spec.neg===!spec.neg && spec.kind!=='sub'){
    aux = beNow; tail=[ev.ing]; return {aux,L,tail};
  }
  L = {b:ev.b, s:ev.s, p:ev.p};
  return {aux:null, L, tail};
}
function buildEN(spec){
  const S = spec.subj, e3 = S.e3;
  const doNow = e3 ? 'does' : 'do';
  const ep = enParts(spec);
  const t = spec.tense;
  const past = ep.forcePast || t==='perf' || t==='pret';
  const groups = spec.p.groups.filter(g=>g!==spec.ask).slice().sort((a,b)=>(a.rank||9)-(b.rank||9));
  const rest = groups.map(g=>g.en);
  const adv = spec.adv && spec.kind==='decl' ? spec.adv : null;
  const advMid = adv && adv.mid;
  const advEnd = adv && !adv.mid ? [adv.en] : [];
  const neg = !!spec.neg;
  let subjEn = spec.subjEn || S.en;
  const q = spec.kind==='yn' || spec.kind==='wh';
  const out = [];
  const lexFinite = ep.L ? (past ? ep.L.p : (e3 ? ep.L.s : ep.L.b)) : null;
  const doAux = past ? 'did' : doNow;
  if(spec.kind==='wh'){
    const w = spec.ask.askEn;
    if(spec.askType==='Wer'){
      // subject question: "Who buys the apple?"
      const e = Object.assign({}, spec, {subj:{en:'who', e3:true, slot:'er'}, kind:'decl', neg:false, adv:null});
      const body = buildEN(e).replace(/\.$/,'').replace(/^Who /,'');
      return 'Who ' + body + '?';
    }
    const tailW = spec.ask.askEnTail ? [spec.ask.askEnTail] : [];
    if(ep.aux) out.push(w, ep.aux, subjEn, ...ep.tail, ...rest, ...tailW);
    else out.push(w, doAux, subjEn, ep.L.b, ...ep.tail, ...rest, ...tailW);
    return cap(out.join(' ')) + '?';
  }
  if(spec.kind==='yn'){
    if(ep.aux) out.push(ep.aux, subjEn, ...ep.tail, ...rest);
    else out.push(doAux, subjEn, ep.L.b, ...ep.tail, ...rest);
    return cap(out.join(' ')) + '?';
  }
  // decl / sub
  const pre = [];
  if(spec.kind==='sub'){ pre.push(spec.connEn); }
  if(spec.relPron){ pre.push(spec.relEn || 'that'); }
  if(spec.relPron && !spec.relSubjIsHead){ /* head noun already placed by caller */ }
  const A = advMid ? [adv.en] : [];
  if(ep.aux){
    const auxTxt = neg ? (ep.aux==='can' ? 'cannot' : ep.aux+' not') : ep.aux;
    out.push(subjEn, auxTxt, ...A, ...ep.tail, ...rest, ...advEnd);
    return finishEN(spec, pre, out.join(' '));
  }
  if(neg) out.push(subjEn, doAux, 'not', ep.L.b, ...ep.tail, ...rest, ...advEnd);
  else out.push(subjEn, ...A, lexFinite, ...ep.tail, ...rest, ...advEnd);
  return finishEN(spec, pre, out.join(' '));
}
function finishEN(spec, pre, s){
  s = s.replace(/\s+/g,' ').trim();
  pre = pre.filter(Boolean);
  if(spec.kind==='sub' || spec.relPron) return (pre.length? pre.join(' ')+' ' : '') + s;
  return cap(s) + '.';
}

/* ---------- render ---------- */
function fixCase(tokens){
  // sentence-initial capital; keep nouns/names/Sie as they are
  const t = tokens.slice(); t[0] = cap(t[0]); return t;
}
function render(spec){
  const toks = fixCase(buildDE(spec));
  const punct = endPunct(spec);
  const de = toks.join(' ') + punct;
  let en = buildEN(spec);
  return {de, en, tokens:toks, spec, punct};
}

/* ---------- spec factory ---------- */
function allowedTenses(level, kind){
  const t = ['pres'];
  if(level>=2) t.push('perf','pret');
  return t;
}
function makeSpec(o){
  o = o || {};
  const lvl = o.level || 1;
  for(let attempt=0; attempt<60; attempt++){
    const kind = o.kind || 'decl';
    const subj = o.subj || randomSubject();
    let tense = o.tense || 'pres';
    let modal = o.modal===undefined ? null : o.modal;
    if(tense==='perf' || tense==='k2') modal = null;
    if(o.randomModal && (tense==='pres'||tense==='pret') && chance(o.randomModal)) modal = pick(tense==='pret' ? MODALS_PRET : MODALS_PRES.filter(x=>lvl>=2 || ['können','müssen','wollen','möchten'].includes(x)));
    const filter = v => {
      if(o.filter && !o.filter(v)) return false;
      if(modal && (v.kind==='be' || v.inf==='haben' || v.noModal)) return false;
      if(!modal && tense==='perf' && (v.noPerf || v.kind==='be')) return false;
      if(!modal && tense==='pret' && !(v.inf==='sein' || v.inf==='haben')) return false;
      if(tense==='k2' && modal) return false;
      return true;
    };
    const p = makePred(lvl, {filter, verb:o.verb, noAdj:o.noAdj, noun:o.noun});
    if(!p) continue;
    let neg = !!o.neg;
    if(o.randomNeg && chance(o.randomNeg)) neg = true;
    if(neg && p.v.noNeg) neg = false;
    if(tense==='pret' && modal && !MODALS_PRET.includes(modal)) continue;
    // negation: kein- for indefinite objects
    if(neg){
      p.groups = p.groups.map(g => g.k==='obj' && (g.np && (g.np.det==='indef'||g.np.det==='none') ) ? toNeg(g) : g);
      if(p.groups.some(g=>g.k==='obj' && g.np && g.np.det==='none' && !g.negd && g.np.pl===false && g.noun.mass===false)) continue;
    }
    let adv = null, front = null;
    if(kind==='decl' && o.adv!==false && tense!=='k2' && tense!=='pass'){
      const want = o.adv===true || (o.cx>=2 && chance(0.55));
      if(want){
        const pool = (tense==='perf' || tense==='pret') ? PAST_TIME : PRES_TIME.filter(a => !(neg && a.mid) && !(p.v.inf==='wohnen' && a.de[0]!=='jetzt') && !(p.v.stative && a.k==='fut'));
        adv = pick(pool);
        if(!adv.mid && chance(0.4)) front = 'adv';
      }
    }
    const spec = {kind, subj, p, tense, modal, neg, adv, front};
    return spec;
  }
  return null;
}

/* ---------- complex sentences ---------- */
const WEATHER = [
  {de:['es','regnet'], en:'it rains', mains:[{verb:'bleiben'},{verb:'nehmen',noun:'Regenschirm'}]},
  {de:['es','schneit'], en:'it snows', mains:[{verb:'bleiben'},{verb:'tragen',noun:'Mantel'}]},
  {de:['die','Sonne','scheint'], en:'the sun shines', mains:[{verb:'gehen',noun:'Park'},{verb:'trinken',noun:'Saft'}]},
  {de:['es','kalt','ist'], en:'it is cold', mains:[{verb:'tragen',noun:'Jacke'},{verb:'trinken',noun:'Tee'},{verb:'bleiben'}]},
  {de:['es','heiß','ist'], en:'it is hot', mains:[{verb:'trinken',noun:'Wasser'},{verb:'gehen',noun:'Park'}]}
];
const REASON_VERBS = ['arbeiten','lernen','einkaufen','aufstehen','kochen','aufräumen'];
const nounByDe = de => NOUNS.find(n => n.de===de);
function reasonClause(lvl, conn, subj){
  const connEn = {weil:'because', wenn:'when', obwohl:'although'}[conn];
  for(let i=0;i<40;i++){
    const r = rnd();
    const spec = {kind:'sub', conn, connEn, subj, tense:'pres', modal:null, neg:false, adv:null, front:null};
    if(r<0.35){ const p = makePred(lvl,{verb:'sein'}); if(!p) continue; spec.p=p; spec.neg = chance(0.2); }
    else if(r<0.65){ spec.modal='müssen'; const p = makePred(lvl,{verb:pick(REASON_VERBS)}); if(!p) continue; spec.p=p; }
    else if(r<0.85){ const p = makePred(lvl,{verb:'haben', noun:nounByDe(pick(['Zeit','Geld']))}); if(!p) continue; spec.p=p; spec.neg = chance(0.5); }
    else if(lvl>=2){ spec.tense='perf'; const p = makePred(lvl,{verb:pick(['arbeiten','lernen'])}); if(!p) continue; spec.p=p; }
    else continue;
    if(spec.neg){ spec.p.groups = spec.p.groups.map(g=>g.k==='obj' && g.np && (g.np.det==='indef'||g.np.det==='none') ? toNeg(g) : g); if(spec.p.v.noNeg) spec.neg=false; }
    return {tokens:buildDE(spec), en:buildEN(spec), spec};
  }
  return null;
}
function subClause(lvl, conn, o){
  o = o || {};
  const connEn = {weil:'because', dass:'that', wenn:'when', obwohl:'although'}[conn];
  if(o.subj && conn!=='dass') return reasonClause(lvl, conn, o.subj);
  for(let i=0;i<40;i++){
    const r = rnd();
    const subj = o.subj || randomSubject();
    const spec = {kind:'sub', conn, connEn, subj, tense:'pres', modal:null, neg:chance(0.2), adv:null, front:null};
    if(r<0.3){ const p=makePred(lvl,{verb:'sein'}); if(!p) continue; spec.p=p; }
    else if(r<0.55){ spec.modal = pick(['können','müssen','wollen']); const p=makePred(lvl,{filter:v=>v.kind!=='be' && !v.noModal}); if(!p) continue; spec.p=p; }
    else if(lvl>=2 && r<0.8){ spec.tense='perf'; spec.neg=false; const p=makePred(lvl,{filter:v=>!v.noPerf && v.kind!=='be'}); if(!p) continue; spec.p=p; }
    else { const p=makePred(lvl,{filter:v=>v.kind!=='be'}); if(!p) continue; spec.p=p; }
    if(spec.neg){ spec.p.groups = spec.p.groups.map(g=>g.k==='obj' && g.np && (g.np.det==='indef'||g.np.det==='none') ? toNeg(g) : g); if(spec.p.v.noNeg) spec.neg=false; }
    return {tokens:buildDE(spec), en:buildEN(spec), spec};
  }
  return null;
}
function weatherMain(lvl){
  for(let i=0;i<20;i++){
    const w = pick(WEATHER), m = pick(w.mains);
    const o = {level:lvl, kind:'decl', cx:1, adv:false, tense:'pres', verb:m.verb, subj:mkSubj(PRON[0])};
    if(m.noun) o.noun = nounByDe(m.noun);
    const spec = makeSpec(o);
    if(spec) return {w, spec};
  }
  return null;
}
function complexSentence(lvl, o){
  o = o || {};
  const conns = o.conn ? [o.conn] : (lvl>=3 ? ['weil','dass','wenn','obwohl'] : ['weil','dass','wenn']);
  const conn = pick(conns);
  for(let i=0;i<60;i++){
    let mainSpec, sub;
    if(conn==='dass'){
      sub = subClause(lvl, 'dass', {});
      if(!sub) continue;
      const verbs = [['denke','think'],['glaube','believe'],['weiß','know'],['sage','say']];
      const vb = pick(verbs);
      const tokens = ['Ich', vb[0]+','].concat(sub.tokens);
      return {de:tokens.join(' ')+'.', en:'I '+vb[1]+' '+sub.en+'.', conn, kind:'dass', order:'main-first', tokens, mainTokens:['Ich',vb[0]+','], subTokens:sub.tokens, sub};
    }
    if(chance(0.4)){
      const wm = weatherMain(lvl); if(!wm) continue;
      mainSpec = wm.spec; sub = {tokens:[conn].concat(wm.w.de), en:({weil:'because',wenn:'when',obwohl:'although'})[conn]+' '+wm.w.en, weather:true};
    } else {
      mainSpec = makeSpec({level:lvl, kind:'decl', cx:1, adv:false, tense:'pres', subj:mkSubj(pick(PRON))});
      if(!mainSpec) continue;
      sub = subClause(lvl, conn, {subj:mainSpec.subj});
      if(!sub) continue;
    }
    const subFirst = conn!=='weil' ? chance(0.55) : chance(0.4);
    const mainEn = buildEN(mainSpec).replace(/\.$/,'');
    if(subFirst){
      const st = sub.tokens.slice(); st[st.length-1] += ',';
      const spec = Object.assign({}, mainSpec, {front:'sub', subText:st});
      const toks = fixCase(buildDE(spec));
      return {de:toks.join(' ')+'.', en:cap(sub.en)+', '+lcFirstEn(mainEn)+'.', conn, tokens:toks, subTokens:sub.tokens, kind:'sub-first', order:'sub-first', mainSpec, sub};
    }
    const mainToks = fixCase(buildDE(mainSpec));
    mainToks[mainToks.length-1] += ',';
    const tokens = mainToks.concat(sub.tokens);
    return {de:tokens.join(' ')+'.', en:mainEn+' '+sub.en+'.', conn, tokens, mainTokens:mainToks, subTokens:sub.tokens, kind:'main-first', order:'main-first', mainSpec, sub};
  }
  return null;
}
function lcFirstEn(s){ return /^I(\s|$)/.test(s) ? s : s.charAt(0).toLowerCase()+s.slice(1); }

/* ---------- B1 structures ---------- */
const CONDITIONS = [
  {de:['ich','mehr','Zeit','hätte'], en:'I had more time', key:'hätte', subjSlot:'ich'},
  {de:['ich','Geld','hätte'], en:'I had money', key:'hätte', subjSlot:'ich'},
  {de:['ich','nicht','so','müde','wäre'], en:'I were not so tired', key:'wäre', subjSlot:'ich'},
  {de:['ich','frei','hätte'], en:'I had a day off', key:'hätte', subjSlot:'ich'},
  {de:['das','Wetter','schön','wäre'], en:'the weather were nice', key:'wäre', subjSlot:'er'},
  {de:['wir','mehr','Zeit','hätten'], en:'we had more time', key:'hätte', subjSlot:'wir'}
];
function konjunktivSentence(lvl){
  for(let i=0;i<30;i++){
    const c = pick(CONDITIONS);
    const subj = mkSubj(c.subjSlot==='wir' ? PRON[4] : PRON[0]);
    const spec = makeSpec({level:lvl, kind:'decl', tense:'k2', subj, adv:false, filter:v=>['kaufen','besuchen','fahren','gehen','lernen','kochen','helfen','mitkommen','einladen','einkaufen','bestellen','spielen','schlafen','lesen'].includes(v.inf)});
    if(!spec) continue;
    spec.front = 'sub';
    spec.subText = ['Wenn'].concat(c.de.slice(0,-1)).concat([c.de[c.de.length-1]+',']);
    const toks = fixCase(buildDE(spec));
    const de = toks.join(' ')+'.';
    const mainEn = buildEN(Object.assign({}, spec, {front:null})).replace(/\.$/,'');
    const en = 'If '+c.en+', '+lcFirstEn(mainEn)+'.';
    return {de, en, cond:c, spec, tokens:toks, subjSlot:c.subjSlot};
  }
  return null;
}
function relativeSentence(lvl){
  for(let i=0;i<60;i++){
    const spec = makeSpec({level:lvl, kind:'sub', tense:pick(['pres','perf']), adv:false, filter:v=>v.kind==='obj' && !v.objCase && v.inf!=='haben' && v.inf!=='mögen', subj:mkSubj(PRON[0])});
    if(!spec) continue;
    const og = spec.p.groups.find(g=>g.k==='obj' && g.np && !g.np.pl && g.noun.t.every(t=>t!=='people' || true));
    if(!og) continue;
    const n = og.noun;
    if(n.mass) continue;
    const g = gOf(n);
    const rel = DEF.akk[g];
    const relSpec = Object.assign({}, spec, {kind:'sub', relPron:rel, relEn:'that', p:{v:spec.p.v, groups:spec.p.groups.filter(x=>x!==og)}});
    const clauseToks = buildDE(relSpec);
    const clauseEn = buildEN(Object.assign({}, relSpec, {kind:'sub', connEn:'', relPron:true, relEn:'that'})).replace(/^that /,'that ');
    const head = np(n, {det:'def', case:'nom'});
    const de = 'Das ist '+(n.art==='der'?'der ':n.art==='die'?'die ':'das ')+n.de+', '+clauseToks.join(' ')+'.';
    const enText = 'This is the '+n.en+' '+clauseEn+'.';
    return {de, en:enText, head:n, rel, gender:g, relSpec, clauseTokens:clauseToks, tokens:['Das','ist',head.de[0],n.de+',',...clauseToks]};
  }
  return null;
}
function passiveSentence(lvl){
  for(let i=0;i<60;i++){
    const v = pick(['kaufen','essen','trinken','lesen','schreiben','kochen','bestellen','öffnen','schließen','waschen','reparieren','bezahlen','verkaufen'].map(k=>VL[k]).filter(x=>x.lvl<=lvl));
    if(!v) continue;
    const pool = nounsBy(v.obj.split(' '), lvl, n=>!n.mass);
    if(!pool.length) continue;
    const n = pick(pool);
    const pl = n.pl && chance(0.4);
    const sub = np(n, {det:'def', case:'nom', pl});
    const slot = pl ? 'sie' : 'er';
    const spec = {kind:'decl', subj:{de:sub.de.join(' '), en:sub.en, slot, e3:!pl, name:false}, p:{v, groups:[]}, tense:'pass', modal:null, neg:false, adv:null, front:null, passPl:pl, subjEn:sub.en};
    const toks = fixCase(buildDE(spec));
    const en = buildEN(spec);
    return {de:toks.join(' ')+'.', en, tokens:toks, spec, verb:v, noun:n, pl, subjNp:sub};
  }
  return null;
}

/* ---------- exported API ---------- */
const DE = {
  seed, rnd, pick, shuffle, sample, chance, cap, uniq,
  T, PRET, K2, SLOTS, PRON, NAMES, NOUNS, VL, ADJ, CITIES, ADJ_STATE, PRES_TIME, PAST_TIME, WEATHER, CONDITIONS,
  MODALS_PRES, MODALS_PRET, MODAL_EN, DEF, IND, NEG, POS, ADJ_END,
  fin, regularPresent, needsE, datPl, np, pPhrase, adjForm, adjEndingOf, adjFor, gOf, nounsBy,
  makePred, makeSpec, buildDE, layoutDE, buildEN, render, complexSentence, konjunktivSentence, relativeSentence, passiveSentence,
  subClause, verbPieces, randomSubject, mkSubj, toNeg, objGroup, mannerGroup, dirPlaceGroup, locPlaceGroup, weatherMain, nounByDe, REASON_VERBS
};
root.DE = DE;
if(typeof module!=='undefined' && module.exports) module.exports = DE;
})(typeof window!=='undefined' ? window : globalThis);
