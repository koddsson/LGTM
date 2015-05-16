'use strict';

const CACHE_NAME = 'LGTM-v2';

var isImageRequest = function(request) {
  return request.method === 'GET' && request.context === 'image';
};

self.addEventListener('install', function(event) {
  console.log('Installing');
  console.log('Adding large images to cache!');
  fetch('data.json').then(function(response) {
    return response.json();
  }).then(function(json) {
    caches.open(CACHE_NAME).then(function(cache) {
      json.forEach(function(item) {
        console.log(`Adding ${item.url} to cache`);
        fetch(item.url).then(function(response) {
          let largeUrl = item.url
            .replace('.gif', 's.gif')
            .replace('.png', 's.png')
            .replace('.jpg', 's.jpg');
          cache.put(largeUrl, response);
        });
      });
    });
  });
});

self.addEventListener('activate', function(event) {
  console.log('activating');
});

self.addEventListener('fetch', function(event) {
  console.log('fetching');
  if (!isImageRequest(event.request)) {
    return;
  } else {
    let cleanURL = event.request.url.substring(0, event.request.url.indexOf('?'));
    event.respondWith(
      caches.match(cleanURL).then(function(response) {
        if (response) {
          console.log('Cache hit!');
        } else {
          console.log('Cache miss!');
        }
        return response || fetch(event.request);
      })
    );
  }
});
