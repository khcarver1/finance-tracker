const APP_PREFIX = 'Budget-track';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = 'data-cache-v1';


const FILES_TO_CACHE = [
  '/index.html',
  '/css/styles.css',
  '/js/index.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];


// Install the service worker
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Your files were pre-cached successfully!');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Intercept fetch requests
self.addEventListener('fetch', function(evt) {
  if (evt.request.url.includes('/api/')) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }

              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        })
        .catch(err => console.log(err))
    );

    return;
  }

  evt.respondWith(
    fetch(evt.request).catch(function() {
      return caches.match(evt.request).then(function(response) {
        if (response) {
          return response;
        } else if (evt.request.headers.get('accept').includes('text/html')) {
          // return the cached home page for all requests for html pages
          return caches.match('/');
        }
      });
    })
  );
});






















































// self.addEventListener('install', function (e) {
//   e.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       console.log('installing cache : ' + CACHE_NAME)
//       return cache.addAll(FILES_TO_CACHE)
//     })
//   )
// })

// self.addEventListener('activate', function (e) {
//   e.waitUntil(
//     caches.keys().then(keyList => {
//       const cacheKeepList = keyList.filter(function (key) {
//         return key.indexOf(APP_PREFIX);
//       })
//       cacheKeepList.push(CACHE_NAME);
//       return Promise.all(keyList.map(function (key, i) {
//         if (cacheKeepList.indexOf(key) === -1) {
//           return caches.delete(keyList[i]);
//         }
//       })
//       );
//     })
//   );
// });

// self.addEventListener('fetch', function (e) {
//   e.respondWith(
//     caches.match(e.request).then(function (request) {
//       if (request) {
//         return request;
//       } else {
//         return fetch(e.request);
//       }
//     }))
// });





// if (e.request.url.includes('/')) {
//   e.respondWith(
//     caches
//       .open(CACHE_NAME)
//       .then(cache => {
//         return fetch(e.request)
//           .then(response => {
//             // If the response was good, clone it and store it in the cache.
//             if (response.status === 200) {
//               cache.put(e.request.url, response.clone());
//             }

//             return response;
//           })
//           .catch(err => {
//             // Network request failed, try to get it from the cache.
//             return cache.match(e.request);
//           });
//       })
//       .catch(err => console.log(err))
//   );

//   return;
// }

// evt.respondWith(
//   fetch(e.request).catch(function() {
//     return caches.match(e.request).then(function(response) {
//       if (response) {
//         return response;
//       } else if (e.request.headers.get('accept').includes('text/html')) {
//         // return the cached home page for all requests for html pages
//         return caches.match('/');
//       }
//     });``
//   })
// );