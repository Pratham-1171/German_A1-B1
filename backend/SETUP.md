# Backend setup (about 15 minutes, free tier is enough)

> **Already done for you:** the project `sprachtreppe` (ap-south-1) was created and `schema.sql` applied through the Supabase connector.
> Project URL: `https://biqkgnkiuibckbhfsbrs.supabase.co`. Continue at step 2 (admin account) and step 4 (GitHub secrets).

The app needs a small server for **accounts** and the **weekly updates**. It uses Supabase (hosted PostgreSQL + login).
Nothing secret is ever placed inside the app.

## 1. Create the project
1. Sign up at https://supabase.com → **New project** (any name, strong database password you will not need again, region near your students).
2. Open **SQL Editor → New query**, paste the whole of `backend/schema.sql`, press **Run**. It should finish with "Success".

## 2. Create YOUR admin account (the password never goes into the app or GitHub)
1. **Authentication → Users → Add user → Create new user**: your email + a long passphrase (use a password manager). Tick **Auto Confirm User**.
2. **SQL Editor** → run (with your email):
   ```sql
   update public.profiles set role = 'admin', approved = true where email = 'you@example.com';
   ```
   This is the only way to create an admin. Students cannot do it, not even by modifying the app.

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
* **Admin → Overdue** lists approved students who have not synced for 7 days (server-side time, cannot be faked on the phone).
* Forgot password: students use "Forgot password?" on the login screen (Supabase sends the email).
* Removing a student: Authentication → Users → delete (their data is deleted with them).
