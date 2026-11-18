/* Network-first: update the app when online, keep the last working shell for offline launch. */
const C='cctv-v12';
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','multi.html','manifest.webmanifest','icon-192.png','icon-512.png'])).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res})
    .catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
