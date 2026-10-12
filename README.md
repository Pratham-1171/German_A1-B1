# Sprachtreppe — German A1–B1 (v8): accounts, weekly sync, teacher review

An offline German course (vocabulary, grammar, reading, writing, quizzes, exams) that runs as an Android app.
Students sign in; once a week their progress is sent to the teacher, who reviews it and sends feedback.

## What is new in v8
**Exercise engine (rewritten):** a real German grammar core generates every sentence by rule (conjugation incl. stem changes and
separable verbs, articles and cases, contractions, Perfekt, Präteritum, modals, negation, subordinate clauses, adjective endings,
Konjunktiv II, relative clauses, passive) together with a matching English gloss. Wrong answers are produced by *breaking the rule*
(wrong ending, wrong case, verb in the wrong place …), so a "wrong" option can never accidentally be correct.
Practice adapts: skills with low accuracy come up more often; immediate repeats are avoided.
**Reading:** passages are built from facts, so questions always match the text (multiple choice + richtig/falsch).
**Writing:** tasks with a checklist and a rubric (required content, length, level-appropriate connectors, typical learner mistakes
such as verb position after *weil*).
**Fixed from v7:** the Reading screen crashed; the old generator produced wrong German ("Du wohnest", "Du schlafst", "wohnt im Schauer")
and ambiguous quiz options (duplicate or also-correct collocation verbs).

## Accounts, sync and review
* **Student**: register → teacher approves → study offline → progress is sent automatically when online; **must connect at least once every 7 days**
  (warning from day 5; on day 7 the app locks until a sync succeeds). Everything studied while locked-out is kept and sent.
* **Admin**: signs in with the same login screen (Admin tab). Console: approvals, to-review list, overdue list, per-student detail
  (accuracy, weak skills, frequent mistakes, writing samples), feedback + rating, CSV export.

### Security — what is and is not protected
| Question | Answer |
|---|---|
| Is the admin password in the app/APK/GitHub? | **No.** Admin signs in against Supabase Auth; only a bcrypt hash exists, on the server. Nothing to scrape. |
| Can a student read other students or become admin by editing the app? | **No.** Enforced by database row-level-security (tested on a real PostgreSQL engine, `tests/sql.test.js`). |
| Can a student fake his results? | The app sends what the app computed; a determined student with a rooted phone could alter his own numbers. The server stores them with **server time**; the teacher sees the writing samples and mistakes themselves. |
| Can a student avoid the weekly sync? | The lock uses a monotonic clock (setting the phone clock back does not help) but it is a client-side nudge. The authoritative list is **Admin → Overdue** (server time). |
| Brute-force on the admin account? | Supabase rate-limits sign-in; the app adds a 30 s cool-down after 5 failures. Use a long passphrase; optionally enable CAPTCHA in Supabase. |
| Anything in the APK that is secret? | No. The Supabase *anon* key is public by design; the build **refuses** a `service_role` key. |
| Hostile text (a student typing `<script>`)? | Everything the admin sees is escaped (tested). |
| Data on the phone | Android backup is disabled; each account keeps separate local progress on a shared phone. |
Not implemented (be aware): multi-factor login for the admin inside the app; remote wipe of a lost phone; offline password check
(signing in needs internet once, then the session is remembered).

## Get the APK (no software to install)
1. Do `backend/SETUP.md` (Supabase project, run `schema.sql`, make your admin, copy URL + anon key).
2. Create a GitHub repository, upload **everything in this folder** (if `.github` does not upload, see `github-workflow/READ-ME-FIRST.txt`).
3. Add the two repository secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. **Actions → Build Android APK → Run workflow** (about 6–10 minutes; it runs all tests first).
5. Download artifact **Sprachtreppe-apk**, install `app-debug.apk` on the phones ("Install unknown apps").

A build without the two secrets **fails on purpose** (so you never hand out an app with the login missing).
Practice-only build: Run workflow → tick *local_mode*.

## Develop locally
```
npm install
npm test                                   # ~3 min: grammar engine, screens, login/sync flow, database rules
SUPABASE_URL=… SUPABASE_ANON_KEY=… npm run build      # writes www/index.html   (add ALLOW_LOCAL_MODE=1 for no-login)
npx cap sync android && npx cap open android
```
Source map: `course/german-core.js` (grammar), `exercises-v8.js` (question types), `reading-writing-v8.js`, `engine-v8.js` (app glue),
`auth-sync.js` (login, weekly lock, admin console), `original.html` (the course), `backend/schema.sql` (database + security rules).
