# Sprachtreppe — Android app

Your offline German A1–B1 course wrapped as a native Android app (Capacitor). Everything runs on-device; progress is stored locally.

## Option A — Get the APK with no setup (GitHub Actions)
1. Create a new GitHub repository and upload everything in this folder (keep `.github/`).
2. Open the **Actions** tab → **Build Android APK** → wait ~5 minutes (it also runs on every push).
3. Open the finished run → download the **Sprachtreppe-apk** artifact → unzip → `app-debug.apk`.
4. Copy the APK to your phone and open it. Allow "Install unknown apps" for your file manager/browser when asked.

## Option B — Build locally
Needs Node 22, Java 21 and Android Studio.
    npm install
    npx cap sync android
    npx cap open android      # then Build ▸ Build APK(s)
or from the terminal: `cd android && ./gradlew assembleDebug` (APK in `android/app/build/outputs/apk/debug/`).

## Option C — Install as a PWA (no APK)
Host the `www/` folder on any HTTPS site (GitHub Pages, Netlify Drop). Open it in Chrome on Android → ⋮ → **Install app**. It works offline afterwards.

## Notes
- Updating the course: replace `www/index.html`, run `npx cap sync android`, rebuild.
- Progress backup: the app's Export button opens Android's share sheet (save to Drive/Files/WhatsApp). Import uses the normal file picker.
- The debug APK is fine for personal use. For Play Store release you need a signed release build (AAB) and a keystore.
- Text-to-speech uses the phone's own engine: install the German voice in Android Settings ▸ Text-to-speech if pronunciation is silent.
