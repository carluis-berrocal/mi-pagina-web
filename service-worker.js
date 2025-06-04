const CACHE_NAME = 'mi-portafolio-cache-v3';
const ARCHIVOS_A_CACHEAR = [
  '/',
  '/index.html',
  '/js/main.js',
  '/js/app.js',
  '/estilos/estilos.css',
  '/imagenes/pwa/192.png',
  '/imagenes/pwa/512.png',
  '/manifest.json',
  '/offline.html',
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Archivos cacheados');
      return cache.addAll(ARCHIVOS_A_CACHEAR);
    })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
  console.log('[SW] Activado y limpio');
});

// Fetch - estrategia cache first para archivos estáticos y fallback para navegación SPA
self.addEventListener('fetch', event => {
  const request = event.request;

  // Para navegación (URLs visitadas)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // En offline, sirve el index.html para que la SPA funcione
          return caches.match('/index.html');
        })
    );
    return;
  }

  // Para otros recursos (js, css, imágenes) estrategia cache first
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no está en cache, intenta de la red y cachea la respuesta nueva
      return fetch(request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // En caso de fallo y recurso no cacheado, podría devolver algo fallback o nada
      });
    })
  );
});
