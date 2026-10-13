/* Sprachtreppe password recovery handler.
 * Supabase redirects here with an authenticated recovery session in the URL fragment.
 * This file is intentionally independent of the normal login UI so recovery works
 * even when the existing app has no active session yet.
 */
(function () {
  'use strict';
  const cfg = window.SP_CONFIG || {};

  // The existing login code calls /auth/v1/recover directly. Intercept that request
  // and provide the production app URL explicitly so Supabase returns to the app
  // instead of falling back to an incorrect Site URL.
  const nativeFetch = window.fetch;
  if (typeof nativeFetch === 'function') {
    window.fetch = function (input, init) {
      try {
        let url = typeof input === 'string' ? input : input && input.url;
        if (url && /\/auth\/v1\/recover(?:\?|$)/.test(url) && !/[?&]redirect_to=/.test(url)) {
          const redirectTo = 'https://pratham-1171.github.io/German_A1-B1/';
          url += (url.indexOf('?') >= 0 ? '&' : '?') + 'redirect_to=' + encodeURIComponent(redirectTo);
          if (typeof input === 'string') input = url;
          else input = new Request(url, input);
        }
      } catch (e) {}
      return nativeFetch.call(this, input, init);
    };
  }

  const hash = String(location.hash || '');
  if (!/(^|[#&])type=recovery(?:&|$)/.test(hash)) return;

  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const access = params.get('access_token');
  const type = params.get('type');
  if (!access || type !== 'recovery') return;

  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  if (!cfg.url || !cfg.key) return;

  const css = document.createElement('style');
  css.textContent = `
    #spRecovery{position:fixed;inset:0;z-index:20000;background:var(--bg,#13161c);color:var(--text,#fff);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto}
    #spRecovery .box{width:min(430px,100%);background:var(--card,#1c212b);border:1px solid var(--line,#394150);border-radius:16px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.35)}
    #spRecovery h2{margin:0 0 8px} #spRecovery p{line-height:1.55}
    #spRecovery label{display:block;font-size:13px;font-weight:700;margin:14px 0 5px}
    #spRecovery input{box-sizing:border-box;width:100%;padding:12px;border:1px solid var(--line,#394150);border-radius:10px;background:var(--bg,#13161c);color:inherit;font:inherit}
    #spRecovery button{width:100%;margin-top:16px;padding:12px;border:0;border-radius:10px;background:var(--accent,#1e6feb);color:#fff;font:inherit;font-weight:700;cursor:pointer}
    #spRecovery .msg{min-height:20px;margin-top:10px;font-size:13px;color:var(--muted,#9aa4b2)}
    #spRecovery .ok{color:#62d394} #spRecovery .bad{color:#ff7373}
  `;
  document.head.appendChild(css);

  const box = document.createElement('div');
  box.id = 'spRecovery';
  box.innerHTML = `<div class="box">
    <h2>🔐 Reset your password</h2>
    <p>Choose a new password for your Sprachtreppe account.</p>
    <label for="spRecoveryPw">New password</label>
    <input id="spRecoveryPw" type="password" autocomplete="new-password" minlength="10" placeholder="At least 10 characters">
    <label for="spRecoveryPw2">Confirm password</label>
    <input id="spRecoveryPw2" type="password" autocomplete="new-password" minlength="10" placeholder="Enter it again">
    <div class="msg" id="spRecoveryMsg"></div>
    <button id="spRecoveryBtn">Set new password</button>
  </div>`;
  document.body.appendChild(box);

  const msg = box.querySelector('#spRecoveryMsg');
  const btn = box.querySelector('#spRecoveryBtn');
  const pw1 = box.querySelector('#spRecoveryPw');
  const pw2 = box.querySelector('#spRecoveryPw2');

  async function updatePassword(password) {
    const res = await fetch(cfg.url + '/auth/v1/user', {
      method: 'PUT',
      headers: {apikey: cfg.key, Authorization: 'Bearer ' + access, 'Content-Type': 'application/json'},
      body: JSON.stringify({password})
    });
    let data = null;
    try { data = await res.json(); } catch (e) {}
    if (!res.ok) throw new Error((data && (data.message || data.error_description || data.error)) || ('HTTP ' + res.status));
    return data;
  }

  btn.onclick = async () => {
    const a = pw1.value, b = pw2.value;
    if (a.length < 10 || !/[A-Za-z]/.test(a) || !/\d/.test(a)) {
      msg.className = 'msg bad'; msg.textContent = 'Use at least 10 characters with letters and numbers.'; return;
    }
    if (a !== b) { msg.className = 'msg bad'; msg.textContent = 'The passwords do not match.'; return; }
    btn.disabled = true; msg.className = 'msg'; msg.textContent = 'Updating password…';
    try {
      await updatePassword(a);
      msg.className = 'msg ok'; msg.textContent = 'Password updated successfully. You can now sign in.';
      pw1.value = ''; pw2.value = '';
      setTimeout(() => { box.remove(); location.hash = ''; location.reload(); }, 1200);
    } catch (e) {
      msg.className = 'msg bad'; msg.textContent = 'This reset link is invalid or expired. Request a new one.';
      btn.disabled = false;
    }
  };
})();
