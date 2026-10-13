/* Source module: navigation.js
 * Route registry, navigation, and reusable exercise controls.
 * Build: scripts/build-course.py concatenates modules in its declared order.
 */
function buildNav(){
  const nav = $('#nav');
  nav.innerHTML = NAV.map(([k,labelKey]) =>
    `<button data-route="${k}" class="${S.lastView===k?'active':''}">${t(labelKey)}</button>`
  ).join('');
  nav.querySelectorAll('button').forEach(b => b.onclick = () => { location.hash = '#/' + b.dataset.route; });
}
function setActiveNav(route){
  $$('#nav button').forEach(b => b.classList.toggle('active', b.dataset.route === route));
  const a = $('#nav button.active');
  if(a && a.scrollIntoView) a.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
}
function currentStaffRole(){
  const state = window.SP_AUTH && typeof window.SP_AUTH._state === 'function' ? window.SP_AUTH._state() : null;
  const profile = state && state.auth && state.auth.profile;
  return profile && (profile.role === 'admin' || profile.role === 'teacher') ? profile.role : '';
}
const STAFF_ALLOWED_ROUTES = {
  admin: new Set(['admin','classroom','assignments','announcements','audit','teachers']),
  teacher: new Set(['classroom','assignments','announcements'])
};
function route(){
  const raw = (location.hash || '#/home').replace(/^#\//,'');
  const r = raw.split('?')[0] || 'home';
  const role = currentStaffRole();
  if (role && !STAFF_ALLOWED_ROUTES[role].has(r)) {
    if (location.hash !== '#/assignments') location.hash = '#/assignments';
    return;
  }
  if (window.SP_LMS && !window.SP_LMS.canVisit(r)) {
    if (location.hash !== '#/assignments') location.hash = '#/assignments';
    return;
  }
  S.lastView = r; STORE.save();
  setActiveNav(r);
  const view = $('#view');
  const routes = {
    session:viewSession, review:viewReview, mistakes:viewMistakes, vocab:viewVocab,
    articles:viewArticles, flash:viewFlash, quiz:viewQuiz, sentence:viewSentence,
    spelling:viewSpelling, dictation:viewDictation, families:viewFamilies, verbs:viewVerbs,
    pronounce:viewPronounce, synonyms:viewSynonyms, patterns:viewPatterns, grammar:viewGrammar,
    listen:viewListen, speak:viewSpeak, read:viewRead, write:viewWrite, exam:viewExam,
    resources:viewResources, progress:viewProgress, settings:viewSettings,
    connectors:viewConnectors, collocations:viewCollocations, compare:viewCompare
  };
  (routes[r] || viewHome)(view);
  window.scrollTo({top:0,behavior:'auto'});
}
window.addEventListener('hashchange', route);

/* ============================================================
   SETUP PANEL
   ============================================================ */
function setupPanelHTML(idPrefix, defaultCount, defaultDiff){
  const cnt = defaultCount || S.settings.defaultCount || 10;
  const diff = defaultDiff || S.settings.defaultDifficulty || 'mixed';
  const counts = [5, 10, 20, 50];
  const diffs = [['easy','diff_easy'],['normal','diff_normal'],['hard','diff_hard'],['expert','diff_expert'],['mixed','diff_mixed']];
  return `<div class="setup-panel" data-setup="${idPrefix}">
    <div class="sp-row"><span class="sp-label">${t('setup_count')}</span>
      <div class="chipgroup" data-group="count">${counts.map(n => `<button data-val="${n}" class="${cnt===n?'active':''}">${n}</button>`).join('')}</div>
    </div>
    <div class="sp-row"><span class="sp-label">${t('setup_difficulty')}</span>
      <div class="chipgroup" data-group="difficulty">${diffs.map(([d,l]) => `<button data-val="${d}" class="${diff===d?'active':''}">${t(l)}</button>`).join('')}</div>
    </div>
  </div>`;
}
function wireSetupPanel(root, onChange){
  root.querySelectorAll('[data-setup] .chipgroup').forEach(g => {
    const group = g.dataset.group;
    g.querySelectorAll('button').forEach(b => {
      b.onclick = () => {
        g.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        onChange && onChange(group, b.dataset.val);
      };
    });
  });
}
function readSetupPanel(root, idPrefix){
  const panel = root.querySelector(`[data-setup="${idPrefix}"]`);
  if(!panel) return {count: S.settings.defaultCount || 10, difficulty: S.settings.defaultDifficulty || 'mixed'};
  const count = +panel.querySelector('[data-group="count"] button.active').dataset.val;
  const difficulty = panel.querySelector('[data-group="difficulty"] button.active').dataset.val;
  return {count, difficulty};
}

/* ============================================================
   HOME
   ============================================================ */
