/*
 * Sprachtreppe — reading + writing generators (v8)
 * Every story is built from a small FACT object; the text, the questions and the answers all come from the
 * same facts, so a question can never contradict its text. Writing models are built from the same fields as
 * the task, and every model is checked against its own rubric in the test-suite.
 */
(function (root) {
'use strict';
const DE = root.DE || require('./german-core.js');
const {pick, shuffle, sample, chance, cap} = DE;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LV = {A1:1, A2:2, B1:3}, LN = ['', 'A1', 'A2', 'B1'];
const lvlNum = l => typeof l==='number' ? l : (LV[l] || pick([1,2,3]));
const FEMALE = new Set(['Anna','Clara','Lena','Mia','Sara','Priya']);
const person = n => FEMALE.has(n)
  ? {name:n, f:true,  pr:'sie', Pr:'Sie', dat:'ihr',  poss:'ihrem',  enPr:'she', enPos:'her'}
  : {name:n, f:false, pr:'er',  Pr:'Er',  dat:'ihm',  poss:'seinem', enPr:'he',  enPos:'his'};
const HOUR = {1:['eins','one'], 2:['zwei','two'], 3:['drei','three'], 4:['vier','four'], 12:['zwölf','twelve'], 5:['fünf','five'], 6:['sechs','six'], 7:['sieben','seven'], 8:['acht','eight'], 9:['neun','nine'], 10:['zehn','ten'], 11:['elf','eleven']};
const hDe = h => HOUR[h][0], hEn = h => HOUR[h][1] + " o'clock";
const DAYS = [['Montag','Monday'],['Dienstag','Tuesday'],['Mittwoch','Wednesday'],['Donnerstag','Thursday'],['Freitag','Friday'],['Samstag','Saturday'],['Sonntag','Sunday']];

function options(correct, pool, n){
  const ws = [], seen = new Set([correct]);
  shuffle(pool).forEach(p => { if(!seen.has(p)){ seen.add(p); ws.push(p); } });
  return shuffle([correct].concat(ws.slice(0, (n||4)-1)));
}
function mcq(q, correct, pool, n){ return {type:'mcq', q, correct, options: options(correct, pool, n)}; }
function tf(deTrue, deFalse, makeTrue){ return makeTrue ? {type:'tf', de:deTrue, correct:'Richtig'} : {type:'tf', de:deFalse, correct:'Falsch'}; }
const locPhrase = n => DE.pPhrase(n, 'loc').de.join(' ');
const dirPhrase = n => DE.pPhrase(n, 'dir').de.join(' ');
const nounDe = de => DE.nounByDe(de);

/* ---------------- reading stories ---------------- */
const HOBBIES = [
  {de:'spiele ich Fußball', en:'play football'}, {de:'spiele ich Tennis', en:'play tennis'}, {de:'lese ich ein Buch', en:'read a book'},
  {de:'gehe ich in den Park', en:'go to the park'}, {de:'koche ich mit Freunden', en:'cook with friends'}, {de:'sehe ich fern', en:'watch TV'}
];
const EVENING = [
  {de:'sieht {pr} fern', en:'watches TV'}, {de:'liest {pr} ein Buch', en:'reads a book'}, {de:'kocht {pr} Suppe', en:'cooks soup'}, {de:'lernt {pr} Deutsch', en:'learns German'}
];
const ACTS = [
  {de:'ein Museum besucht', en:'visited a museum'}, {de:'einen Freund getroffen', en:'met a friend'}, {de:'Pizza gegessen', en:'ate pizza'},
  {de:'Fotos gemacht', en:'took photos'}, {de:'ein Buch gekauft', en:'bought a book'}, {de:'Kaffee getrunken', en:'drank coffee'}
];
const FEELINGS = [['müde','tired'],['glücklich','happy'],['zufrieden','satisfied'],['hungrig','hungry']];
const DRINKS = [['Tee','tea'],['Kaffee','coffee'],['Milch','milk'],['Saft','juice'],['Wasser','water']];
const FOODS = [['Brot','bread'],['Käse','cheese']];
const VEH = [['dem Bus','by bus'],['dem Zug','by train'],['der U-Bahn','by subway'],['dem Fahrrad','by bike'],['dem Auto','by car']];
const PLACES_VISIT = ['Kino','Museum','Park','Café','Restaurant','Bibliothek'];

const STORIES = {
  1: [
    function profile(){
      const p = person(pick(DE.NAMES)), from = pick(DE.CITIES), live = pick(DE.CITIES.filter(c=>c!==from));
      const age = 19 + Math.floor(DE.rnd()*26), wp = pick(DE.nounsBy(['work'], 1)), hob = pick(HOBBIES);
      const text = 'Hallo! Ich heiße ' + p.name + '. Ich komme aus ' + from + ', aber ich wohne in ' + live + '. Ich bin ' + age + ' Jahre alt. Ich arbeite ' + locPhrase(wp) + '. Am Wochenende ' + hob.de + '.';
      const wps = DE.nounsBy(['work'], 1);
      const items = [
        mcq('Where does ' + p.name + ' come from?', from, DE.CITIES),
        mcq('Where does ' + p.name + ' live now?', live, DE.CITIES),
        mcq('How old is ' + p.name + '?', age + ' years', [1,2,3,4,5,6].map(k => (age + k*(k%2?1:-1)) + ' years')),
        mcq('Where does ' + p.name + ' work?', wp.enLoc, wps.map(n=>n.enLoc)),
        mcq('What does ' + p.name + ' do at the weekend?', hob.en, HOBBIES.map(h=>h.en))
      ];
      const tfs = [
        tf(p.name + ' kommt aus ' + from + '.', p.name + ' kommt aus ' + pick(DE.CITIES.filter(c=>c!==from)) + '.', chance(0.5)),
        tf(p.name + ' wohnt in ' + live + '.', p.name + ' wohnt in ' + from + '.', chance(0.5))
      ];
      return {topic:'introduction', title:'Wer bin ich?', text, items, tfs, facts:{name:p.name, from, live, age}};
    },
    function dailyRoutine(){
      const p = person(pick(DE.NAMES)), wake = 5 + Math.floor(DE.rnd()*3), start = 8 + Math.floor(DE.rnd()*2), leave = start - 1;
      const dr = pick(DRINKS), fd = pick(FOODS), v = pick(VEH), ev = pick(EVENING);
      const evDe = ev.de.replace('{pr}', p.pr);
      const text = p.name + ' steht jeden Tag um ' + hDe(wake) + ' Uhr auf. Zum Frühstück trinkt ' + p.pr + ' ' + dr[0] + ' und isst ' + fd[0] + '. Um ' + hDe(leave) + ' Uhr fährt ' + p.pr + ' mit ' + v[0] + ' zur Arbeit. Die Arbeit beginnt um ' + hDe(start) + ' Uhr. Am Abend ' + evDe + '.';
      const items = [
        mcq('When does ' + p.name + ' get up?', hEn(wake), [5,6,7,8,9,10].map(hEn)),
        mcq('What does ' + p.name + ' drink for breakfast?', dr[1], DRINKS.map(x=>x[1])),
        mcq('How does ' + p.name + ' get to work?', v[1], VEH.map(x=>x[1])),
        mcq('When does the work start?', hEn(start), [6,7,8,9,10,11].map(hEn)),
        mcq('What does ' + p.name + ' do in the evening?', ev.en, EVENING.map(x=>x.en))
      ];
      const tfs = [
        tf(p.name + ' trinkt ' + dr[0] + '.', p.name + ' trinkt ' + pick(DRINKS.filter(x=>x[0]!==dr[0]))[0] + '.', chance(0.5)),
        tf(p.name + ' steht um ' + hDe(wake) + ' Uhr auf.', p.name + ' steht um ' + hDe(wake===9?5:wake+1) + ' Uhr auf.', chance(0.5))
      ];
      return {topic:'daily life', title:'Ein normaler Tag', text, items, tfs, facts:{name:p.name, wake, start, drink:dr[0], vehicle:v[1]}};
    }
  ],
  2: [
    function weekend(){
      const p = person(pick(DE.NAMES)), city = pick(DE.CITIES), v = pick(VEH), acts = sample(ACTS, 2), fe = pick(FEELINGS), day = pick(['Am Samstag','Am Sonntag','Letztes Wochenende']);
      const text = day + ' ist ' + p.name + ' mit ' + v[0] + ' nach ' + city + ' gefahren. Dort hat ' + p.pr + ' ' + acts[0].de + ' und ' + acts[1].de + '. Am Abend ist ' + p.pr + ' zurückgefahren. ' + p.Pr + ' war ' + fe[0] + '.';
      const rest = ACTS.filter(a => !acts.includes(a));
      const items = [
        mcq('Where did ' + p.name + ' go?', city, DE.CITIES),
        mcq('How did ' + p.name + ' travel?', v[1], VEH.map(x=>x[1])),
        mcq('Which of these did ' + p.name + ' do there?', acts[0].en, rest.map(a=>a.en)),
        mcq('How was ' + p.name + ' in the evening?', fe[1], FEELINGS.map(x=>x[1])),
        mcq('What did ' + p.name + ' do in the evening?', 'travelled back', ['stayed in the city','went to the cinema','cooked dinner','went to work'])
      ];
      const tfs = [
        tf(p.name + ' ist nach ' + city + ' gefahren.', p.name + ' ist nach ' + pick(DE.CITIES.filter(c=>c!==city)) + ' gefahren.', chance(0.5)),
        tf(p.name + ' hat ' + acts[1].de + '.', p.name + ' hat ' + rest[0].de + '.', chance(0.5))
      ];
      return {topic:'travel', title:'Ein Ausflug', text, items, tfs, facts:{name:p.name, city, vehicle:v[1], acts:acts.map(a=>a.en), feeling:fe[1]}};
    },
    function invitation(){
      const from = person(pick(DE.NAMES)), to = person(pick(DE.NAMES.filter(n=>n!==from.name)));
      const place = nounDe(pick(PLACES_VISIT)), day = pick(DAYS.slice(0,6)), h = 6 + Math.floor(DE.rnd()*4) + 12 - 12, hh = 17 + Math.floor(DE.rnd()*4);
      const v = pick(VEH), after = pick([{de:'Kaffee trinken', en:'drink coffee'},{de:'Pizza essen', en:'eat pizza'},{de:'spazieren gehen', en:'go for a walk'}]);
      const reply = pick(DAYS.filter(d => d[0]!==day[0]).slice(0,6));
      const salut = to.f ? 'Liebe ' : 'Lieber ';
      const text = salut + to.name + ', am ' + day[0] + ' gehe ich um ' + hDe(hh-12) + ' Uhr ' + dirPhrase(place) + '. Hast du Zeit? Du kannst mit ' + v[0] + ' kommen. Danach möchte ich ' + after.de + '. Bitte schreib mir bis ' + reply[0] + '. Viele Grüße, ' + from.name;
      const places = PLACES_VISIT.map(x=>nounDe(x).enDir);
      const items = [
        mcq('On which day does ' + from.name + ' go out?', day[1], DAYS.map(d=>d[1])),
        mcq('Where does ' + from.name + ' go?', place.enDir, places),
        mcq('At what time?', hEn(hh-12), [3,4,5,6,7,8,9].map(hEn)),
        mcq('How can ' + to.name + ' come?', v[1], VEH.map(x=>x[1])),
        mcq('What does ' + from.name + ' want to do afterwards?', after.en, ['drink coffee','eat pizza','go for a walk','go shopping'])
      ];
      const tfs = [
        tf(from.name + ' lädt ' + to.name + ' ein.', to.name + ' lädt ' + from.name + ' ein.', true),
        tf(to.name + ' soll bis ' + reply[0] + ' antworten.', to.name + ' soll bis ' + pick(DAYS.filter(d=>d[0]!==reply[0]))[0] + ' antworten.', chance(0.5))
      ];
      const tfFix = tfs.map((t, i) => i===0 && chance(0.5) ? {type:'tf', de:to.name + ' lädt ' + from.name + ' ein.', correct:'Falsch'} : t);
      return {topic:'communication', title:'Eine Einladung', text, items, tfs:tfFix, facts:{from:from.name, to:to.name, day:day[1], hour:hh-12, vehicle:v[1], place:place.enDir}};
    }
  ],
  3: [
    function flatSearch(){
      const p = person(pick(DE.NAMES)), city = pick(DE.CITIES), near = pick([nounDe('Bahnhof'), nounDe('Universität'), nounDe('Supermarkt'), nounDe('Park')]);
      const price = 450 + 50*Math.floor(DE.rnd()*8), why = pick([['klein','too small'],['laut','too loud'],['dunkel','too dark']]);
      const von = DE.gOf(near)==='f' ? 'von der ' : 'vom ';
      const text = p.name + ' sucht eine neue Wohnung, weil die alte Wohnung zu ' + why[0] + ' ist. Die neue Wohnung soll in der Nähe ' + von + near.de + ' sein, damit ' + p.pr + ' nicht so lange fahren muss. Obwohl die Wohnungen in ' + city + ' teuer sind, hat ' + p.pr + ' eine schöne Wohnung gefunden. Sie kostet ' + price + ' Euro im Monat. ' + p.name + ' ist sehr zufrieden und möchte nächsten Monat umziehen.';
      const nears = ['Bahnhof','Universität','Supermarkt','Park'].map(x=>nounDe(x).en);
      const items = [
        mcq('Why does ' + p.name + ' look for a new flat?', 'The old flat is ' + why[1] + '.', ['The old flat is too small.','The old flat is too loud.','The old flat is too dark.','The old flat is too expensive.']),
        mcq('What should the new flat be close to?', 'the ' + near.en, nears.map(x=>'the '+x)),
        mcq('Why must it be close to it?', 'so that ' + p.enPr + ' does not have to travel far', ['so that ' + p.enPr + ' does not have to travel far','because ' + p.enPr + ' likes noise','because it is cheaper','because friends live there']),
        mcq('How much is the rent per month?', price + ' euros', [-100,-50,50,100,150].map(d => (price + d) + ' euros')),
        mcq('When does ' + p.name + ' want to move?', 'next month', ['next month','tomorrow','next year','last week'])
      ];
      const tfs = [
        tf('Die Wohnung in ' + city + ' kostet ' + price + ' Euro.', 'Die Wohnung in ' + city + ' kostet ' + (price+100) + ' Euro.', chance(0.5)),
        tf(p.name + ' hat noch keine Wohnung gefunden.', p.name + ' hat eine Wohnung gefunden.', false)
      ];
      tfs[1] = chance(0.5) ? {type:'tf', de:p.name + ' hat eine Wohnung gefunden.', correct:'Richtig'} : {type:'tf', de:p.name + ' hat noch keine Wohnung gefunden.', correct:'Falsch'};
      return {topic:'home', title:'Die Wohnungssuche', text, items, tfs, facts:{name:p.name, city, price, near:near.en, why:why[1]}};
    },
    function workDay(){
      const p = person(pick(DE.NAMES)), wp = pick(DE.nounsBy(['work'], 2)), wake = 5 + Math.floor(DE.rnd()*2);
      const chore = pick([{de:'die Wohnung aufräumen', en:'tidy the flat'},{de:'für die Familie kochen', en:'cook for the family'},{de:'einkaufen gehen', en:'go shopping'}]);
      const text = p.name + ' arbeitet ' + locPhrase(wp) + ' und muss jeden Tag um ' + hDe(wake) + ' Uhr aufstehen. Deshalb geht ' + p.pr + ' abends früh ins Bett. Am Wochenende möchte ' + p.pr + ' sich erholen, aber oft muss ' + p.pr + ' noch ' + chore.de + '. Trotzdem ist ' + p.pr + ' mit ' + p.poss + ' Leben zufrieden, denn die Arbeit macht ' + p.dat + ' Spaß.';
      const wps = DE.nounsBy(['work'], 2);
      const items = [
        mcq('Where does ' + p.name + ' work?', wp.enLoc, wps.map(n=>n.enLoc)),
        mcq('When must ' + p.name + ' get up?', hEn(wake), [5,6,7,8,9,10].map(hEn)),
        mcq('Why does ' + p.name + ' go to bed early?', 'because ' + p.enPr + ' has to get up early', ['because ' + p.enPr + ' has to get up early','because ' + p.enPr + ' is ill','because ' + p.enPr + ' has no TV','because ' + p.enPr + ' works at night']),
        mcq('What often has to be done at the weekend?', chore.en, ['tidy the flat','cook for the family','go shopping','visit the doctor']),
        mcq('Why is ' + p.name + ' satisfied despite everything?', p.enPr + ' enjoys the work', [p.enPr + ' enjoys the work', p.enPr + ' earns a lot', p.enPr + ' has a long holiday', p.enPr + ' works less'])
      ];
      const tfs = [
        tf(p.name + ' muss um ' + hDe(wake) + ' Uhr aufstehen.', p.name + ' muss um ' + hDe(wake+2) + ' Uhr aufstehen.', chance(0.5)),
        chance(0.5) ? {type:'tf', de:'Die Arbeit macht ' + p.name + ' keinen Spaß.', correct:'Falsch'} : {type:'tf', de:p.name + ' ist mit dem Leben zufrieden.', correct:'Richtig'}
      ];
      return {topic:'work', title:'Ein langer Arbeitstag', text, items, tfs, facts:{name:p.name, workplace:wp.enLoc, wake, chore:chore.en}};
    }
  ]
};
function readingTask(level, topic){
  const L = lvlNum(level);
  const pool = STORIES[L];
  const t = topic ? (pool.find(f => f().topic===topic) || pick(pool)) : pick(pool);
  const r = t();
  const items = shuffle(r.items).slice(0, 4);
  const qs = items.map(i => [i.q, i.correct]);
  return {level:LN[L], topic:r.topic, title:r.title, text:r.text, items, tfs:r.tfs, qs, questions:qs.map(([q,a])=>({q, answer:a})), facts:r.facts};
}

/* ---------------- writing tasks ---------------- */
const RX = {
  anrede: /^\s*(hallo|hi|liebe[rs]?|guten (tag|morgen|abend)|sehr geehrte)/i,
  anredeFormal: /^\s*sehr geehrte/i,
  gruss: /(viele|liebe|herzliche|beste|freundliche)n? gr(ü|ue)(ß|ss)e|mit freundlichen gr(ü|ue)(ß|ss)en|tsch(ü|ue)ss|bis (bald|gleich|dann)|bis morgen/i,
  grussFormal: /mit freundlichen gr(ü|ue)(ß|ss)en/i,
  day: /\b(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|wochenende)\b/i,
  time: /(\d{1,2}([:.]\d{2})?\s*uhr)|(um\s+\p{L}+\s+uhr)/iu,
  question: /\?/,
  reason: /\b(weil|denn|deshalb|da|verspätung|krank|müde|wegen)\b/i,
  sorry: /(entschuldigung|es tut mir leid|tut mir leid|sorry|entschuldige)/i,
  answer: /(antwort|schreib mir|schreibe mir|melde dich|rückmeldung|sag mir|sagen sie mir|teilen sie mir)/i,
  confirm: /(bestätig|rückmeldung|antwort|schreib|melde)/i,
  suggest: /(vorschlag|vorschlagen|wie wäre es|können wir|wollen wir|lass uns|ich schlage|passt)/i,
  opinion: /(meiner meinung nach|ich finde|ich denke|ich glaube|ich meine)/i,
  pro: /(vorteil|einerseits|positiv|ein gutes argument|gut ist)/i,
  con: /(nachteil|andererseits|negativ|leider|problem ist|schwierig)/i,
  perfect: /\b(habe|hast|hat|haben|bin|bist|ist|sind|seid)\b[^.!?]*\b(ge\w+|\w+iert)\b/i,
  travel: /\bmit (dem|der|einem|einer)\s+\p{L}+/iu,
  nach: /\b(nach|in)\s+\p{Lu}\p{L}+/u,
  formalQuestion: /\?/g
};
function wordCount(t){ return t.trim() ? t.trim().split(/\s+/).length : 0; }

const WRITING = {
  1: [
    function invite(){
      const to = person(pick(DE.NAMES)), me = pick(DE.NAMES.filter(n=>n!==to.name)), place = nounDe(pick(PLACES_VISIT)), day = pick(DAYS.slice(0,6)), hh = 5 + Math.floor(DE.rnd()*4);
      const subj = pick(['Kino','Museum','Park']);
      const salut = to.f ? 'Liebe ' : 'Lieber ';
      const model = salut + to.name + ',\n\nhast du am ' + day[0] + ' Zeit? Ich gehe um ' + hDe(hh+12-12) + ' Uhr ' + dirPhrase(place) + '. Danach möchte ich noch Kaffee trinken. Möchtest du mitkommen? Schreib mir bitte bald, ob du Zeit hast.\n\nViele Grüße\n' + me;
      return {type:'Nachricht', title:'Schreiben: Einladung', prompt:'Schreibe ' + to.name + ' eine kurze Nachricht. Lade ' + (to.f?'sie':'ihn') + ' ein, etwas zusammen zu machen. (Write a short invitation.)',
        required:[['Anrede (z. B. Hallo / Liebe …)','anrede'],['Einladung: Wohin gehst du?','nach'],['Tag und Uhrzeit nennen','daytime'],['Eine Frage stellen','question'],['Bitte um Antwort','answer'],['Grußformel','gruss']], model, minWords:30};
    },
    function introduce(){
      const name = pick(DE.NAMES), from = pick(DE.CITIES), live = pick(DE.CITIES.filter(c=>c!==from)), age = 20 + Math.floor(DE.rnd()*20), wp = pick(DE.nounsBy(['work'], 1)), hob = pick(HOBBIES);
      const model = 'Hallo! Ich heiße ' + name + '. Ich komme aus ' + from + ', aber ich wohne jetzt in ' + live + '. Ich bin ' + age + ' Jahre alt und arbeite ' + locPhrase(wp) + '. In meiner Freizeit ' + hob.de + '. Ich lerne Deutsch, weil ich gern reise. Hast du auch ein Hobby?\n\nViele Grüße\n' + name;
      return {type:'Nachricht', title:'Schreiben: Ich stelle mich vor', prompt:'Stelle dich in einer kurzen Nachricht vor. (Introduce yourself.)',
        required:[['Anrede','anrede'],['Name nennen (Ich heiße …)','name'],['Herkunft und Wohnort (aus … / in …)','origin'],['Alter (… Jahre alt)','age'],['Beruf oder Hobby','hobby'],['Grußformel','gruss']], model, minWords:30};
    },
    function late(){
      const to = person(pick(DE.NAMES)), me = pick(DE.NAMES.filter(n=>n!==to.name)), v = pick([['Bus','der Bus'],['Zug','der Zug']]), hh = 6 + Math.floor(DE.rnd()*3);
      const model = 'Hallo ' + to.name + ',\n\nes tut mir leid, aber ich komme heute später. ' + cap(v[1]) + ' hat Verspätung, deshalb bin ich erst um ' + hDe(hh) + ' Uhr da. Kannst du bitte schon anfangen? Danke!\n\nBis gleich\n' + me;
      return {type:'Nachricht', title:'Schreiben: Ich komme später', prompt:'Du kommst zu spät. Schreibe ' + to.name + ' eine Nachricht. (You will be late.)',
        required:[['Anrede','anrede'],['Entschuldigung','sorry'],['Grund nennen','reason'],['Neue Uhrzeit nennen','time'],['Eine Bitte oder Frage','question'],['Grußformel','gruss']], model, minWords:25};
    }
  ],
  2: [
    function moveAppointment(){
      const to = person(pick(DE.NAMES)), me = pick(DE.NAMES.filter(n=>n!==to.name)), d1 = pick(DAYS.slice(0,5)), d2 = pick(DAYS.slice(0,5).filter(d=>d!==d1)), hh = 9 + Math.floor(DE.rnd()*3);
      const salut = to.f ? 'Liebe ' : 'Lieber ';
      const model = salut + to.name + ',\n\nleider kann ich am ' + d1[0] + ' nicht kommen, weil ich krank bin. Das tut mir sehr leid. Ich möchte den Termin gern verschieben. Wie wäre es am ' + d2[0] + ' um ' + hDe(hh) + ' Uhr? Passt dir das? Bitte schreib mir kurz, ob du Zeit hast und bestätige den neuen Termin.\n\nViele Grüße\n' + me;
      return {type:'E-Mail', title:'Schreiben: Termin verschieben', prompt:'Du kannst einen Termin nicht wahrnehmen. Schreibe ' + to.name + ' eine E-Mail. (Move an appointment.)',
        required:[['Anrede','anrede'],['Grund nennen (weil …)','reason'],['Neuen Termin vorschlagen (Tag + Uhrzeit)','daytime'],['Um Bestätigung bitten','confirm'],['Grußformel','gruss']], model, minWords:45};
    },
    function tripReport(){
      const to = person(pick(DE.NAMES)), me = pick(DE.NAMES.filter(n=>n!==to.name)), city = pick(DE.CITIES), v = pick(VEH), acts = sample(ACTS, 2), fe = pick(FEELINGS);
      const salut = to.f ? 'Liebe ' : 'Lieber ';
      const model = salut + to.name + ',\n\nich möchte dir von meinem Wochenende erzählen. Am Samstag bin ich mit ' + v[0] + ' nach ' + city + ' gefahren. Dort habe ich ' + acts[0].de + ' und ' + acts[1].de + '. Am Abend war ich ' + fe[0] + ', aber der Tag war wirklich schön. Was hast du am Wochenende gemacht?\n\nViele Grüße\n' + me;
      return {type:'E-Mail', title:'Schreiben: Mein Wochenende', prompt:'Schreibe ' + to.name + ' eine E-Mail über einen Ausflug. Benutze das Perfekt. (Report a trip in the Perfekt.)',
        required:[['Anrede','anrede'],['Reiseziel nennen (nach …)','nach'],['Transportmittel (mit dem …)','travel'],['Mindestens zwei Sätze im Perfekt','perfect'],['Eine Frage stellen','question'],['Grußformel','gruss']], model, minWords:45};
    },
    function forumOpinion(){
      const T = pick([
        {t:'Sport', op:'Ich finde Sport sehr wichtig.', pro:'Ein Vorteil ist, dass man gesund bleibt.', con:'Ein Nachteil ist, dass Sport manchmal viel Zeit kostet.', fin:'Deshalb mache ich dreimal pro Woche Sport, weil es mir gut tut.'},
        {t:'das Handy', op:'Ich finde das Handy im Alltag sehr praktisch.', pro:'Ein Vorteil ist, dass man schnell Freunde anrufen kann.', con:'Ein Nachteil ist, dass man oft zu viel Zeit damit verbringt.', fin:'Deshalb benutze ich mein Handy nur abends, weil ich tagsüber lernen möchte.'},
        {t:'Reisen', op:'Ich finde Reisen sehr interessant.', pro:'Ein Vorteil ist, dass man neue Menschen kennenlernt.', con:'Ein Nachteil ist, dass Reisen teuer sein kann.', fin:'Deshalb spare ich jeden Monat etwas Geld, weil ich nächstes Jahr reisen möchte.'},
        {t:'Online-Kurse', op:'Ich denke, Online-Kurse sind eine gute Möglichkeit zum Lernen.', pro:'Ein Vorteil ist, dass man überall lernen kann.', con:'Ein Nachteil ist, dass man selten mit anderen spricht.', fin:'Deshalb möchte ich einen Online-Kurs und einen Kurs vor Ort machen, weil beides wichtig ist.'}
      ]);
      const model = 'Hallo zusammen,\n\nzum Thema „' + T.t + '“ habe ich eine klare Meinung. ' + T.op + ' ' + T.pro + ' Andererseits gibt es auch Probleme. ' + T.con + ' ' + T.fin + ' Was denkt ihr?\n\nViele Grüße';
      return {type:'Forumsbeitrag', title:'Schreiben: Forum – ' + T.t, prompt:'Schreibe einen Forumsbeitrag zum Thema „' + T.t + '“. (Write a forum post.)',
        required:[['Anrede','anrede'],['Eigene Meinung (Ich finde … / Ich denke …)','opinion'],['Einen Vorteil nennen','pro'],['Einen Nachteil nennen','con'],['Eine Begründung mit „weil“','weil'],['Grußformel','gruss']], model, minWords:50};
    }
  ],
  3: [
    function inquiry(){
      const course = pick(['Deutschkurs','Yogakurs','Computerkurs','Kochkurs']), start = pick(['im Oktober','im Januar','im März']);
      const model = 'Sehr geehrte Damen und Herren,\n\nich interessiere mich für Ihren ' + course + ', weil ich meine Kenntnisse verbessern möchte. Leider habe ich Ihre Website nur kurz gesehen und konnte nicht alle Informationen finden. Könnten Sie mir bitte mitteilen, wann der Kurs ' + start + ' beginnt? Außerdem möchte ich wissen, wie viel der Kurs kostet und welche Unterlagen ich mitbringen muss. Obwohl ich nur abends Zeit habe, würde ich sehr gern teilnehmen. Für eine kurze Antwort wäre ich Ihnen sehr dankbar.\n\nMit freundlichen Grüßen\nAnna Beispiel';
      return {type:'E-Mail', title:'Schreiben: Anfrage ' + course, prompt:'Schreibe eine formelle E-Mail an eine Sprachschule / Schule. Du möchtest Informationen über den ' + course + '. (Formal inquiry.)',
        required:[['Formelle Anrede (Sehr geehrte …)','anredeFormal'],['Situation erklären (Ich interessiere mich für … weil …)','reason'],['Mindestens zwei konkrete Fragen','twoq'],['Höflich um Antwort bitten','answer'],['Formelle Grußformel','grussFormal']], model, minWords:80};
    },
    function complaint(){
      const it = pick([{n:'die Lieferung', p:'Die Lieferung ist nicht angekommen', f:'ich die Jacke für ein Fest gebraucht habe'},{n:'das Hotelzimmer', p:'Das Hotelzimmer war sehr laut und schmutzig', f:'ich nachts nicht schlafen konnte'},{n:'das Handy', p:'Das Handy funktioniert nach zwei Wochen nicht mehr', f:'ich meine Arbeit nicht richtig machen kann'}]);
      const model = 'Sehr geehrte Damen und Herren,\n\nich möchte mich über ' + it.n + ' beschweren. ' + it.p + '. Das ist ein großes Problem für mich, weil ' + it.f + '. Ich erwarte deshalb eine schnelle Lösung. Bitte schicken Sie mir einen Ersatz oder erstatten Sie mir das Geld. Obwohl ich schon zweimal angerufen habe, hat mir bisher niemand geholfen. Ich bitte Sie um eine Antwort bis Ende der Woche.\n\nMit freundlichen Grüßen\nAnna Beispiel';
      return {type:'E-Mail', title:'Schreiben: Beschwerde', prompt:'Schreibe eine höfliche Beschwerde über ' + it.n + '. (Formal complaint.)',
        required:[['Formelle Anrede','anredeFormal'],['Problem erklären','problem'],['Folgen nennen (weil …)','reason'],['Eine Lösung verlangen','solution'],['Formelle Grußformel','grussFormal']], model, minWords:75};
    },
    function forumArgument(){
      const T = pick([
        {t:'Homeoffice', a:'Homeoffice spart viel Zeit, weil man nicht zur Arbeit fahren muss.', b:'Andererseits fehlt der Kontakt zu den Kollegen, was auf Dauer ein Problem sein kann.', c:'Meiner Meinung nach sollte man zwei Tage zu Hause arbeiten, obwohl das nicht für jeden Beruf möglich ist.'},
        {t:'Fahrrad statt Auto', a:'Das Fahrrad ist gut für die Umwelt und für die Gesundheit.', b:'Andererseits ist es bei schlechtem Wetter unangenehm, und manche Wege sind einfach zu weit.', c:'Ich denke, dass man in der Stadt möglichst oft Fahrrad fahren sollte, obwohl das Auto bequemer ist.'},
        {t:'Lernen mit Apps', a:'Apps machen das Lernen flexibel, weil man überall üben kann.', b:'Andererseits spricht man kaum mit echten Menschen, und das ist ein Nachteil.', c:'Ich glaube, dass Apps eine gute Ergänzung sind, obwohl sie einen Kurs nicht ersetzen.'}
      ]);
      const model = 'Hallo zusammen,\n\nzum Thema „' + T.t + '“ möchte ich meine Meinung schreiben. Einerseits gibt es viele Vorteile: ' + T.a + ' ' + T.b + ' ' + T.c + ' Zusammenfassend kann man sagen, dass es auf die persönliche Situation ankommt. Was meint ihr dazu?\n\nViele Grüße';
      return {type:'Forumsbeitrag', title:'Schreiben: Diskussion – ' + T.t, prompt:'Schreibe einen Forumsbeitrag zum Thema „' + T.t + '“ mit Pro und Contra. (Pro/contra post.)',
        required:[['Anrede','anrede'],['Thema einführen und Position nennen','opinion'],['Ein Argument dafür','pro'],['Ein Gegenargument','con'],['Mindestens ein Nebensatz mit „obwohl“ oder „dass“','nebensatz'],['Grußformel','gruss']], model, minWords:65};
    }
  ]
};
const DETECT = {
  anrede: t => RX.anrede.test(t), anredeFormal: t => RX.anredeFormal.test(t), gruss: t => RX.gruss.test(t), grussFormal: t => RX.grussFormal.test(t),
  daytime: t => RX.day.test(t) && RX.time.test(t), time: t => RX.time.test(t), question: t => RX.question.test(t),
  reason: t => RX.reason.test(t), sorry: t => RX.sorry.test(t), answer: t => RX.answer.test(t), confirm: t => RX.confirm.test(t),
  opinion: t => RX.opinion.test(t), pro: t => RX.pro.test(t), con: t => RX.con.test(t), perfect: t => /\b(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\b/i.test(t) && (t.match(/\b(ge\p{L}+(t|en)|\p{L}+iert|(be|ver|er|ent)\p{L}+t)\b/giu)||[]).length>=2,
  travel: t => RX.travel.test(t), nach: t => RX.nach.test(t) || /\b(ins|im|in den|in die|zum|zur)\s+\p{Lu}\p{L}+/u.test(t),
  name: t => /ich hei(ß|ss)e\s+[A-ZÄÖÜ]/i.test(t), origin: t => /\baus\s+[A-ZÄÖÜ]/.test(t) && /\bin\s+[A-ZÄÖÜ]/.test(t),
  age: t => /\b\d{1,2}\s+jahre\s+alt\b/i.test(t), hobby: t => /(freizeit|hobby|wochenende|arbeite|beruf)/i.test(t),
  weil: t => /\bweil\b/i.test(t), twoq: t => (t.match(/\?/g)||[]).length>=1 && /(wann|wie viel|welche|ob|wie|können sie|könnten sie)/i.test(t) && (t.match(/\b(wann|wie viel|welche|ob|wie)\b/gi)||[]).length>=2,
  problem: t => /(problem|leider|nicht|funktioniert|schmutzig|laut|beschwer)/i.test(t), solution: t => /(lösung|ersatz|erstatten|geld zurück|ich erwarte|bitte schicken|reparieren)/i.test(t),
  nebensatz: t => /,\s*(obwohl|dass)\b/i.test(t) || /\b(obwohl|dass)\s+\w+/i.test(t)
};
function writingTask(level){
  const L = lvlNum(level);
  const t = pick(WRITING[L])();
  const required = t.required.map(([text, id]) => ({text, id}));
  return {level:LN[L], type:t.type, title:t.title, prompt:t.prompt, required:required.map(r=>r.text), requiredIds:required.map(r=>r.id), model:t.model, minWords:t.minWords, topic:t.title.replace(/^Schreiben:\s*/, '')};
}
/* rubric: structure, required content, level-appropriate grammar signals, typical learner mistakes */
function checkWriting(task, text){
  text = String(text||'');
  const words = wordCount(text), res = {words, minWords:task.minWords, items:[], tips:[], good:[]};
  (task.requiredIds || []).forEach((id, i) => {
    const fn = DETECT[id]; const ok = fn ? !!fn(text) : true;
    res.items.push({text:task.required[i], ok});
  });
  const t = text;
  const lvl = lvlNum(task.level);
  if(!/^\s*[A-ZÄÖÜ]/.test(t)) res.tips.push('Start with a capital letter.');
  if(!/[.!?]\s*$/m.test(t.trim().split('\n').slice(-3).join(' ')) && !/Grüße|Gruß|Tschüss|gleich|bald/i.test(t)) res.tips.push('End your sentences with punctuation.');
  if(/\bweil\s+(ich|du|er|sie|es|wir|ihr|man|[A-ZÄÖÜ]\w+)\s+(bin|bist|ist|sind|habe|hast|hat|haben|kann|muss|will|möchte|soll|darf|geht|gehe|fahre|fährt|komme|kommt|arbeite|arbeitet)\b/i.test(t)) res.tips.push('After “weil” the conjugated verb goes to the END of the clause (weil ich krank bin).');
  if(/\b(dass|obwohl)\s+(ich|du|er|sie|es|wir|ihr|man)\s+(bin|bist|ist|sind|habe|hast|hat|haben|kann|muss|will|geht|gehe|fahre|fährt|komme|kommt)\b/i.test(t)) res.tips.push('After “dass” / “obwohl” the conjugated verb goes to the END of the clause.');
  if(/\bich bin\s+\d+\s+jahre(?!\s+alt)/i.test(t)) res.tips.push('Say “Ich bin 25 Jahre alt” (not “Ich bin 25 Jahre”).');
  if(/\bich\s+(habe|bin)\s+[^.!?]*\b(gehen|fahren|kaufen|machen|sehen|essen|lesen)\s*[.!?]/i.test(t)) res.tips.push('In the Perfekt the participle (gegangen, gekauft …) stands at the end — not the infinitive.');
  if(/\b(ich|du|er|sie|wir)\s+(möchte|möchtest|kann|kannst|muss|musst|will|willst)\s+[^.!?]*\b(\w+t)\s*[.!?]/i.test(t) && false) res.tips.push('');
  if(task.requiredIds && task.requiredIds.includes('anredeFormal') && /\b(du|dir|dich|dein|deine)\b/i.test(t)) res.tips.push('In a formal text use “Sie / Ihnen / Ihr”, not “du”.');
  if(task.requiredIds && !task.requiredIds.includes('anredeFormal') && /\b(Ihnen|Ihr |Ihre )/.test(t) && !/Sehr geehrte/i.test(t)) res.tips.push('For friends use “du”; “Sie” is only for formal texts.');
  const sentences = (t.match(/[^.!?]+[.!?]/g) || []).length;
  const connectors = (t.match(/\b(weil|denn|deshalb|aber|und|oder|dass|obwohl|trotzdem|außerdem|danach|dann|einerseits|andererseits)\b/gi) || []).length;
  if(lvl>=2 && connectors<2) res.tips.push('Use more connectors (weil, deshalb, aber, außerdem …) to link your ideas.');
  if(lvl>=3 && !/\b(obwohl|trotzdem|dass|einerseits|andererseits|deshalb)\b/i.test(t)) res.tips.push('B1 level: add “obwohl”, “dass” or “trotzdem” to show more complex sentences.');
  if(words < task.minWords) res.tips.push('Your text has ' + words + ' words; aim for ' + task.minWords + '+.');
  const done = res.items.filter(i=>i.ok).length;
  const content = res.items.length ? done / res.items.length : 1;
  const length = Math.min(1, words / task.minWords);
  const accuracy = Math.max(0, 1 - res.tips.filter(x => !/words|connectors|B1 level/.test(x)).length * 0.2);
  res.score = Math.round(100 * (0.5*content + 0.25*length + 0.25*accuracy));
  if(done===res.items.length && res.items.length) res.good.push('All required content points are covered.');
  if(words >= task.minWords) res.good.push('Good length (' + words + ' words).');
  return res;
}

const RW = {readingTask, writingTask, checkWriting, wordCount, STORIES, WRITING, DETECT};
root.RW = RW;
if(typeof module!=='undefined' && module.exports) module.exports = RW;
})(typeof window!=='undefined' ? window : globalThis);
