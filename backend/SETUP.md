# Backend setup (about 15 minutes, free tier is enough)

> **Already done for you:** the project `sprachtreppe` (ap-south-1) was created and `schema.sql` applied through the Supabase connector.
> Project URL: `https://biqkgnkiuibckbhfsbrs.supabase.co`. Continue at step 2 (admin account) and step 4 (GitHub secrets).

The app needs a small server for **accounts**, **weekly updates**, and LMS data. It uses Supabase (hosted PostgreSQL + login).
Nothing secret is ever placed inside the app.

## 1. Create the project
1. Sign up at https://supabase.com → **New project** (any name, strong database password you will not need again, region near your students).
2. Open **SQL Editor → New query**, paste the whole of `backend/schema.sql`, press **Run**. It should finish with "Success".

### 1b. Apply LMS migrations
After `schema.sql`, run these files in order in **SQL Editor**:
1. `backend/migrations/001_lms_phase1.sql` — teacher role, classes, class memberships and invite codes.
2. `backend/migrations/002_lms_phase2.sql` — announcements and in-app notifications.

Do not run the migration files before `schema.sql`. If you already ran Phase 1, run only Phase 2 now.

The migrations are additive and preserve the existing student progress/submission system.

## 2. Create YOUR admin account (the password never goes into the app or GitHub)
1. **Authentication → Users → Add user → Create new user**: your email + a long passphrase (use a password manager). Tick **Auto Confirm User**.
2. **SQL Editor** → run (with your email):
   ```sql
   update public.profiles set role = 'admin', approved = true where email = 'you@example.com';
   ```
   This is the only way to create an admin. Students cannot do it, not even by modifying the app.

## 2b. Passwordless admin sign-in (emailed code) — one-time template change
The Admin tab signs in with a 6-digit code sent to the admin's email (no password to remember or leak). Supabase's default email
contains only a link, so add the code to it:
1. **Authentication → Emails → Templates → Magic Link** (older dashboards: Authentication → Email Templates).
2. Replace the body with, for example:
   ```html
   <h2>Sprachtreppe admin sign-in</h2>
   <p>Your code: <b>{{ .Token }}</b></p>
   <p>It expires soon and works once. If you did not ask for it, ignore this email.</p>
   ```
3. Save. Supabase's built-in sender delivers to your own (project owner / team member) email, which is all the admin needs.
   Limits: about 2 emails per hour on the built-in sender, one code per minute per address.
In the app: **Admin tab → type your email → Send me a code → enter the code**. "Use password instead" stays available.
Only an account whose role is `admin` gets in; students who try the Admin tab are refused.

## 3. Recommended Authentication settings (Authentication → Sign In / Providers, and Settings)
* **Email**: leave enabled. **Minimum password length: 10**. For a classroom you may switch **Confirm email** off so students can start at once —
  they still cannot send anything until you approve them.
* When all your students have registered: switch **Allow new users to sign up** off (or keep it on and just ignore unapproved accounts).
* Optional: turn on CAPTCHA protection (Authentication → Bot and Abuse Protection) if your app link is public.

## 4. Copy two values into GitHub
Supabase → **Project Settings → API**:
* **Project URL**  → GitHub secret `SUPABASE_URL`
* **anon / publishable key** → GitHub secret `SUPABASE_ANON_KEY`  (this is the *public* key. **Never** use the `service_role` key — the build refuses it.)

GitHub → your repository → **Settings → Secrets and variables → Actions → New repository secret** (create both).

## 5. Build
GitHub → **Actions → Build Android APK → Run workflow**. Download the APK artifact, install it, sign in as admin, tap **🛡️ Admin**.

## Day-to-day
* New students register inside the app → they appear under **Admin → Approvals** → open → **Approve account**.
* Every student's progress arrives in **Admin → To review** (accuracy, weak skills, frequent mistakes, writing samples). Add feedback and press **Mark reviewed**; the student sees it after the next sync.
* **Admin/Teacher → Classes** can create classes, add teachers and generate invitation codes after Phase 1 is applied.
* **Teacher/Admin → Announcements** can publish class-specific or global announcements after Phase 2 is applied.
* Students receive announcements in the in-app notification center and can mark notifications read.
* **Admin → Overdue** lists approved students who have not synced for 7 days (server-side time, cannot be faked on the phone).
* Forgot password: students use "Forgot password?" on the login screen (Supabase sends the email).
* Removing a student: Authentication → Users → delete (their data is deleted with them).
