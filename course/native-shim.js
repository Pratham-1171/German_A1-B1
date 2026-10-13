/* PWA registration + Android native helpers (share sheet for exports) */
(function(){
  var cap = window.Capacitor, native = cap && cap.isNativePlatform && cap.isNativePlatform();

  // The Android build loads the web app from GitHub Pages. Registering the
  // service worker there gives the installed APK the same offline cache and
  // lets HTML/CSS/JS updates arrive without reinstalling the APK.
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('./sw.js', {scope:'./'}).then(function(reg){
        if (reg.update) reg.update().catch(function(){});
      }).catch(function(){});
    });
  }

  if(!native) return;
  document.addEventListener('click', function(ev){
    var a = ev.target.closest && ev.target.closest('a[download]');
    if(!a || !/^blob:/.test(a.href)) return;
    ev.preventDefault(); ev.stopPropagation();
    var name = a.getAttribute('download') || 'sprachtreppe-export.json';
    fetch(a.href).then(function(r){return r.blob();}).then(function(b){
      return new Promise(function(res,rej){var fr=new FileReader();fr.onload=function(){res(String(fr.result).split(',')[1]);};fr.onerror=rej;fr.readAsDataURL(b);});
    }).then(function(b64){
      var P = cap.Plugins;
      return P.Filesystem.writeFile({path:name,data:b64,directory:'CACHE'}).then(function(w){
        return P.Share.share({title:name,url:w.uri,dialogTitle:'Save or send'});
      });
    }).catch(function(e){ if(e && /cancel/i.test(String(e.message||e))) return; alert('Export failed: '+(e&&e.message||e)); });
  }, true);
})();
