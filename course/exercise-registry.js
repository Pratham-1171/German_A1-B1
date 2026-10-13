/* Source module: exercise-registry.js
 * Exercise registry and dispatcher.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
/* ---------- Universal registry + dispatcher ---------- */
function diffN(d){ return d === 'easy' ? 1 : d === 'hard' ? 3 : d === 'expert' ? 4 : 2; }

const EXERCISE_REGISTRY = {
  vocab:       (c) => generateVocabExercise(c.type || 'de-en', null, diffN(c.difficulty), c.level),
  article:     (c) => generateVocabExercise('article', null, diffN(c.difficulty), c.level),
  de_en:       (c) => generateVocabExercise('de-en', null, diffN(c.difficulty), c.level),
  en_de:       (c) => generateVocabExercise('en-de', null, diffN(c.difficulty), c.level),
  listenVocab: (c) => generateVocabExercise('listen', null, diffN(c.difficulty), c.level),
  opposite:    (c) => generateVocabExercise('opposite', null, diffN(c.difficulty), c.level),
  synonym:     (c) => generateVocabExercise('synonym', null, diffN(c.difficulty), c.level),
  grammar:     (c) => generateGrammarExerciseLadder(c.level, c.difficulty),
  listening:   (c) => {
    const d = generateDialogueTask(c.level || 'A2');
    const q = rPick(d.questions);
    return {
      skill:'listening', topic:'dialogue', level:d.level,
      promptHTML:`🔊 <button class="btn small" onclick="playDialogue('${esc(d.lines.map(l=>l.de).join('|||')).replace(/'/g,"\'")}')">Play dialogue</button><br><br>${esc(q.q)}`,
      prompt: q.q, options: q.options, correct: q.correct,
      explanation: `Answer: ${q.correct}`, sourceId: 'd-' + d.title, dialogue: d
    };
  },
  connector:   (c) => generateConnectorExercise(rPick(CONNECTORS)),
  collocation: (c) => generateCollocationExercise(rPick(COLLOCATIONS)),
  compare:     (c) => generateComparisonExercise(rPick(VERB_COMPARISONS)),
  verbusage:   (c) => generateVerbUsageExercise(),
  sentence:    (c) => {
    const ex = generateSentenceBuilderExercise(c.level || 'A2');
    const wrongs = [];
    for(let i = 0; i < 3; i++){
      const sh = shuffle([...ex.tokens]).join(' ');
      if(sh !== ex.answer && !wrongs.includes(sh)) wrongs.push(sh);
    }
    while(wrongs.length < 2){
      const alt = generateSentenceBuilderExercise(c.level || 'A2');
      if(alt.answer !== ex.answer && !wrongs.includes(alt.answer)) wrongs.push(alt.answer);
    }
    return {skill:'word-order', topic:'Sentence order', level:ex.level,
      promptHTML:`Which is correct?<br><em class="mini-muted">${esc(ex.en)}</em>`,
      prompt:`Which is correct? "${ex.en}"`,
      options: shuffle([ex.answer, ...wrongs.slice(0,3)]),
      correct: ex.answer, explanation: ex.answer + ' — ' + ex.en};
  },
  mixed:       (c) => {
    const keys = ['vocab','article','de_en','en_de','opposite','synonym','grammar','listening','connector','collocation','compare','verbusage','sentence'];
    return EXERCISE_REGISTRY[rPick(keys)](c);
  }
};

function generateExercise(config){
  config = config || {skill:'vocab', level:'A2', difficulty:'mixed'};
  const gen = EXERCISE_REGISTRY[config.skill] || EXERCISE_REGISTRY.vocab;
  let ex, attempts = 0;
  do {
    try { ex = gen(config); } catch(e){ ex = generateVocabExercise('de-en'); }
    attempts++;
    if(ex && ex.prompt && ex.correct){
      const fp = exerciseFingerprint(ex.prompt + '|' + ex.correct);
      if(!isDuplicate(fp)){ rememberFingerprint(fp); break; }
    }
  } while(attempts < 5);
  return ex || generateVocabExercise('de-en');
}

function generateExerciseBatch({count, skill, level, difficulty, mode}){
  const out = [];
  for(let i = 0; i < count; i++){
    const s = mode === 'mixed' ? 'mixed' : (skill || 'vocab');
    out.push(generateExercise({skill:s, level:level || 'A2', difficulty: difficulty || 'mixed'}));
  }
  return out;
}

function selectAdaptiveSkill(){
  const weak = {};
  Object.values(S.mistakes).forEach(m => {
    const k = (m.type || m.topic || 'misc').split('_')[0];
    weak[k] = (weak[k] || 0) + m.count;
  });
  const entries = Object.entries(weak).sort((a,b) => b[1] - a[1]);
  const roll = rnd();
  if(roll < 0.45 && entries.length) return entries[0][0];
  if(roll < 0.75) return rPick(['vocab','grammar','listening','connector','collocation','compare','verbusage']);
  return 'vocab';
}
function generateAdaptiveExercise(level){
  return generateExercise({skill: selectAdaptiveSkill(), level: level || 'A2', difficulty: 'mixed'});
}

function playDialogue(joined){
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const v = getGermanVoice();
  joined.split('|||').forEach(line => {
    const u = new SpeechSynthesisUtterance(line);
    u.lang = 'de-DE'; u.rate = S.settings.speechRate || 0.9;
    if(v) u.voice = v;
    speechSynthesis.speak(u);
  });
  trackAudioPlay();
}

/* ============================================================
   ROUTER
   ============================================================ */
const NAV = [
  ['home','nav_home'],['session','nav_session'],['review','nav_review'],
  ['vocab','nav_vocab'],['grammar','nav_grammar'],['quiz','nav_quiz'],
  ['flash','nav_flash'],['verbs','nav_verbs'],
  ['connectors','nav_connectors'],['collocations','nav_collocations'],['compare','nav_compare'],
  ['mistakes','nav_mistakes'],['sentence','nav_sentence'],['spelling','nav_spelling'],
  ['dictation','nav_dictation'],['families','nav_families'],['articles','nav_articles'],
  ['pronounce','nav_pronounce'],['synonyms','nav_synonyms'],['patterns','nav_patterns'],
  ['listen','nav_listen'],['speak','nav_speak'],['read','nav_read'],['write','nav_write'],
  ['exam','nav_exam'],['resources','nav_resources'],['progress','nav_progress'],['settings','nav_settings']
];

