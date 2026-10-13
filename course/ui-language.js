/* Source module: ui-language.js
 * UI text, translations, and common text helpers.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
/* ============================================================
   TRANSLATIONS (compact)
   ============================================================ */
const UI = {
  en: {
    nav_home:'🏠 Today', nav_session:'⚡ Session', nav_review:'🧠 Review', nav_vocab:'📚 Vocab',
    nav_grammar:'📖 Grammar', nav_quiz:'🎯 Quiz', nav_flash:'🧠 Cards', nav_verbs:'🔥 Verbs',
    nav_connectors:'🔗 Connectors', nav_collocations:'🧱 Collocations', nav_compare:'⚖️ Compare',
    nav_mistakes:'❌ Mistakes', nav_sentence:'🧩 Sentences', nav_spelling:'✏️ Spelling',
    nav_dictation:'📝 Dictation', nav_families:'🌳 Families', nav_articles:'📖 Articles',
    nav_pronounce:'🔤 Pron', nav_synonyms:'↔️ Opposites', nav_patterns:'🗣️ Patterns',
    nav_listen:'🎧 Listen', nav_speak:'🎤 Speak', nav_read:'📕 Read', nav_write:'✍️ Write',
    nav_exam:'🎓 Exam', nav_resources:'🔗 Resources', nav_progress:'📊 Progress', nav_settings:'⚙️ Settings',
    home_title:'🇩🇪 German A1 → B1 · v5.4',
    home_desc:'Infinite practice engine · SRS · mistake tracking · guided sessions',
    study_modules:'Modules', stat_words:'Words', stat_known:'Mastered', stat_due:'Due', stat_streak:'Streak',
    vocab_search:'🔎 Search German, English, Gujarati…', all_topics:'All topics', all_articles:'All articles', all_levels:'All levels',
    no_words:'No matches.', quiz_title:'🎯 Quiz', quiz_sub:'Auto-generated infinitely.',
    quiz_article:'Article', quiz_de_en:'DE → EN', quiz_en_de:'EN → DE',
    round_complete:'Round complete!', question_of:(i,t) => `Q <b>${i}</b> / ${t}`, score_label:s => `Score <b>${s}</b>`,
    correct:'✅ Correct!', correct_answer:a => `❌ Correct: <b>${a}</b>.`, play_again:'Play again',
    verbs_title:'🔥 Verbs', patterns_title:'🗣️ Patterns', grammar_title:'📖 Grammar',
    listen_title:'🎧 Listening', speak_title:'🎤 Speaking', read_title:'📕 Reading', write_title:'✍️ Writing',
    res_title:'🔗 Resources', prog_title:'📊 Progress',
    session_title:'⚡ Daily Session', session_start:'▶ Start', session_complete:'🎉 Session complete',
    review_title:'🧠 Smart Review', review_start:'▶ Start review', mistakes_title:'❌ Mistakes',
    mistakes_empty:'No mistakes yet.', families_title:'🌳 Word Families', sentence_title:'🧩 Sentence Builder',
    spelling_title:'✏️ Spelling', dictation_title:'📝 Dictation', exam_title:'🎓 Exam',
    connectors_title:'🔗 Connectors', collocations_title:'🧱 Collocations', compare_title:'⚖️ Verb Compare',
    settings_title:'⚙️ Settings', settings_sub:'Preferences saved on this device.',
    setup_count:'Questions', setup_difficulty:'Difficulty',
    diff_easy:'🟢 Easy', diff_normal:'🟡 Normal', diff_hard:'🟠 Hard', diff_expert:'🔴 Expert', diff_mixed:'🎲 Mixed',
    generate_more:'⚡ Generate more', practice_inf:'⚡ Practice ∞', new_item:'🔄 New',
    save_ok:'✓ Saved', all:'All'
  },
  gu: {
    nav_home:'🏠 આજ', nav_session:'⚡ સેશન', nav_review:'🧠 રિવ્યુ', nav_vocab:'📚 શબ્દો',
    nav_grammar:'📖 વ્યાકરણ', nav_quiz:'🎯 ક્વિઝ', nav_flash:'🧠 કાર્ડ', nav_verbs:'🔥 ક્રિયાપદો',
    nav_connectors:'🔗 જોડકણાં', nav_collocations:'🧱 Collocations', nav_compare:'⚖️ સરખામણી',
    nav_mistakes:'❌ ભૂલો', nav_sentence:'🧩 વાક્ય', nav_spelling:'✏️ જોડણી',
    nav_dictation:'📝 ડિક્ટેશન', nav_families:'🌳 પરિવાર', nav_articles:'📖 આર્ટિકલ',
    nav_pronounce:'🔤 ઉચ્ચાર', nav_synonyms:'↔️ વિરુદ્ધ', nav_patterns:'🗣️ પેટર્ન',
    nav_listen:'🎧 સાંભળો', nav_speak:'🎤 બોલો', nav_read:'📕 વાંચો', nav_write:'✍️ લખો',
    nav_exam:'🎓 પરીક્ષા', nav_resources:'🔗 સંસાધનો', nav_progress:'📊 પ્રગતિ', nav_settings:'⚙️ સેટિંગ્સ',
    home_title:'🇩🇪 જર્મન A1 → B1 · v5.4',
    home_desc:'અનંત અભ્યાસ એન્જિન · SRS · ભૂલ ટ્રેકિંગ',
    study_modules:'મોડ્યુલો', stat_words:'શબ્દો', stat_known:'માસ્ટર', stat_due:'બાકી', stat_streak:'સ્ટ્રીક',
    vocab_search:'🔎 શોધો…', all_topics:'બધા વિષયો', all_articles:'બધા આર્ટિકલ', all_levels:'બધા સ્તરો',
    no_words:'મેળ ખાતું નથી.', quiz_title:'🎯 ક્વિઝ', quiz_sub:'અનંત સ્વયં-જનિત.',
    quiz_article:'આર્ટિકલ', quiz_de_en:'DE → EN', quiz_en_de:'EN → DE',
    round_complete:'રાઉન્ડ પૂર્ણ!', question_of:(i,t) => `પ્રશ્ન <b>${i}</b> / ${t}`, score_label:s => `સ્કોર <b>${s}</b>`,
    correct:'✅ સાચું!', correct_answer:a => `❌ સાચો: <b>${a}</b>.`, play_again:'ફરી',
    verbs_title:'🔥 ક્રિયાપદો', patterns_title:'🗣️ પેટર્ન', grammar_title:'📖 વ્યાકરણ',
    listen_title:'🎧 સાંભળવું', speak_title:'🎤 બોલવું', read_title:'📕 વાંચન', write_title:'✍️ લેખન',
    res_title:'🔗 સંસાધનો', prog_title:'📊 પ્રગતિ',
    session_title:'⚡ દૈનિક સેશન', session_start:'▶ શરૂ', session_complete:'🎉 પૂર્ણ',
    review_title:'🧠 સ્માર્ટ રિવ્યુ', review_start:'▶ શરૂ', mistakes_title:'❌ ભૂલો',
    mistakes_empty:'હજી કોઈ ભૂલ નથી.', families_title:'🌳 શબ્દ પરિવાર', sentence_title:'🧩 વાક્ય બનાવો',
    spelling_title:'✏️ જોડણી', dictation_title:'📝 ડિક્ટેશન', exam_title:'🎓 પરીક્ષા',
    connectors_title:'🔗 જોડકણાં', collocations_title:'🧱 Collocations', compare_title:'⚖️ સરખામણી',
    settings_title:'⚙️ સેટિંગ્સ', settings_sub:'પસંદગીઓ આ ઉપકરણ પર.',
    setup_count:'પ્રશ્નો', setup_difficulty:'સ્તર',
    diff_easy:'🟢 સહેલું', diff_normal:'🟡 સામાન્ય', diff_hard:'🟠 અઘરું', diff_expert:'🔴 નિષ્ણાત', diff_mixed:'🎲 મિશ્ર',
    generate_more:'⚡ વધુ જનરેટ', practice_inf:'⚡ અભ્યાસ ∞', new_item:'🔄 નવું',
    save_ok:'✓ સાચવ્યું', all:'બધું'
  }
};
function t(key, ...args){
  const dict = UI[S.settings.lang] || UI.en;
  const v = (dict[key] !== undefined) ? dict[key] : UI.en[key];
  if(v === undefined) return key;
  return (typeof v === 'function') ? v(...args) : v;
}

/* ============================================================
   GUJARATI DICTIONARY (compact)
   ============================================================ */
const GU = {
  'ich':'હું','du':'તું','er':'તે','sie':'તે','es':'તે','wir':'અમે','mein':'મારું','dein':'તારું',
  'heute':'આજે','morgen':'આવતીકાલ','gestern':'ગઈકાલ','immer':'હંમેશા','nie':'ક્યારેય નહીં',
  'Mutter':'માતા','Vater':'પિતા','Kind':'બાળક','Bruder':'ભાઈ','Schwester':'બહેન','Frau':'સ્ત્રી','Mann':'પુરુષ',
  'Freund':'મિત્ર','Mensch':'માણસ','Lehrer':'શિક્ષક','haben':'હોવું','werden':'બનવું','können':'કરી શકવું',
  'müssen':'કરવું પડવું','machen':'કરવું','gehen':'જવું','kommen':'આવવું','sehen':'જોવું','sprechen':'બોલવું',
  'arbeiten':'કામ કરવું','kaufen':'ખરીદવું','essen':'ખાવું','trinken':'પીવું','schlafen':'સૂવું',
  'lesen':'વાંચવું','schreiben':'લખવું','lernen':'શીખવું','schön':'સુંદર','gut':'સારું','schlecht':'ખરાબ',
  'groß':'મોટું','klein':'નાનું','neu':'નવું','alt':'જૂનું','schnell':'ઝડપી','langsam':'ધીમું',
  'wichtig':'મહત્વપૂર્ણ','richtig':'સાચું','falsch':'ખોટું','Haus':'ઘર','Wasser':'પાણી','Brot':'રોટલી',
  'Kaffee':'કૉફી','Tee':'ચા','Zug':'ટ્રેન','Auto':'ગાડી','Stadt':'શહેર','Reise':'પ્રવાસ','Wetter':'હવામાન'
};
function guOf(de){ return GU[de] || ''; }
function meaningFull(w){
  if(S.settings.lang === 'gu'){ const g = guOf(w.de); if(g) return `${g} · ${w.en}`; }
  return w.en;
}

/* ============================================================
   VOCABULARY
   ⚠️ REPLACE THIS BLOCK with your full 3008-word TOPICS array from v4/v5.
   The structure is: [topicName, level, "n|art|de|en\n..."]
   ============================================================ */
