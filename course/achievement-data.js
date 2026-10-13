/* Source module: achievement-data.js
 * Achievement definitions.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
const ACHIEVEMENTS = [
  {id:'first_session', icon:'🎬', name:'First Steps', desc:'Complete your first session', check:s => (s.sessionHistory||[]).length >= 1},
  {id:'words_100', icon:'💯', name:'100 Words', desc:'Master 100 words', check:s => Object.keys(s.mastery||{}).filter(k => s.mastery[k].status==='MASTERED').length >= 100},
  {id:'streak_7', icon:'🔥', name:'Week Warrior', desc:'7-day streak', check:s => (s.streak?.current||0) >= 7 || (s.streak?.longest||0) >= 7},
  {id:'quiz_100', icon:'🎯', name:'Quiz Ace', desc:'100 quiz questions', check:s => Object.values(s.quizStats||{}).reduce((a,q) => a + (q.done||0), 0) >= 100},
  {id:'mistake_master', icon:'🧹', name:'Mistake Cleaner', desc:'Clear 20 mistakes', check:s => (s.mistakesCleared||0) >= 20},
  {id:'connector_ace', icon:'🔗', name:'Connector Ace', desc:'20 connector exercises', check:s => (s.connectorsDone||0) >= 20},
  {id:'colloc_20', icon:'🧱', name:'Collocation Pro', desc:'20 collocation exercises', check:s => (s.collocationsDone||0) >= 20},
  {id:'reader_5', icon:'📕', name:'Reader', desc:'Read 5 generated passages', check:s => (s.readingsGenerated||0) >= 5},
  {id:'listener_5', icon:'🎧', name:'Listener', desc:'Complete 5 listening tasks', check:s => (s.listeningsDone||0) >= 5},
  {id:'writer_3', icon:'✍️', name:'Writer', desc:'Complete 3 writing tasks', check:s => (s.writingsDone||0) >= 3}
];

/* ============================================================
   SPEECH
   ============================================================ */
