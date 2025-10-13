// Advanced Service Worker for EduForge Learning Platform
// Version 2.0 - Optimized for performance

// Cache names for different types of assets
const STATIC_CACHE = 'eduforge-static-v2';
const DYNAMIC_CACHE = 'eduforge-dynamic-v2';
const IMAGE_CACHE = 'eduforge-images-v2';
const API_CACHE = 'eduforge-api-v2';
const FONT_CACHE = 'eduforge-fonts-v2';

// Assets that should be cached immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/eduforge.svg',
  '/serviceWorker.js',
  '/performance-optimization.js',
  '/static/js/main.js',
  '/static/css/main.css'
];

// External CDN resources to cache
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2'
];

// Combined assets to cache during install
const ASSETS_TO_CACHE = [...PRECACHE_ASSETS, ...CDN_ASSETS];

// Install event - Precache static assets
self.addEventListener('install', event => {
  self.skipWaiting(); // Ensure new service worker activates immediately
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching app shell and static assets');
        return cache.addAll(ASSETS_TO_CACHE);
      }),
      
      // Create empty caches for dynamic content
      caches.open(DYNAMIC_CACHE),
      caches.open(IMAGE_CACHE),
      caches.open(API_CACHE),
      caches.open(FONT_CACHE)
    ])
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE, FONT_CACHE];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated and controlling page');
      return self.clients.claim(); // Take control of uncontrolled clients
    })
  );
});

// Helper function to determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    return {
      cacheName: STATIC_CACHE,
      strategy: 'network-first'
    };
  }
  
  // For API requests
  if (url.pathname.includes('/api/')) {
    return {
      cacheName: API_CACHE,
      strategy: 'network-first',
      maxAge: 60 * 5 // 5 minutes
    };
  }
  
  // For image requests
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) {
    return {
      cacheName: IMAGE_CACHE,
      strategy: 'cache-first',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    };
  }
  
  // For font requests
  if (request.destination === 'font' || url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    return {
      cacheName: FONT_CACHE,
      strategy: 'cache-first',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    };
  }
  
  // For CSS/JS assets
  if (request.destination === 'script' || request.destination === 'style' || 
      url.pathname.match(/\.(js|css)$/i)) {
    return {
      cacheName: STATIC_CACHE,
      strategy: 'stale-while-revalidate'
    };
  }
  
  // Default strategy
  return {
    cacheName: DYNAMIC_CACHE,
    strategy: 'stale-while-revalidate'
  };
}

// Helper function to implement network-first strategy
async function networkFirst(request, cacheName, maxAge) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Store in cache if successful
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Nothing in cache, try network again as last resort
    return fetch(request);
  }
}

// Helper function to implement cache-first strategy
async function cacheFirst(request, cacheName, maxAge) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Refresh cache in background if response is old
    if (maxAge) {
      const cachedDate = new Date(cachedResponse.headers.get('date'));
      const now = new Date();
      const ageInSeconds = (now - cachedDate) / 1000;
      
      if (ageInSeconds > maxAge) {
        // Refresh cache in the background
        fetch(request).then(async networkResponse => {
          if (networkResponse.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse);
          }
        }).catch(() => {});
      }
    }
    return cachedResponse;
  }
  
  // Nothing in cache, use network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      // Store in cache if successful
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    return new Response('Network and cache both failed.', {
      status: 408,
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });
  }
}

// Helper function to implement stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  // Try to get from cache
  const cachedResponse = await caches.match(request);
  
  // Fetch from network and update cache regardless of cache hit
  const fetchPromise = fetch(request).then(async networkResponse => {
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.error('Failed to fetch:', error);
    // Return a fallback response if both cache and network fail
    if (!cachedResponse) {
      return new Response('Network and cache both failed.', {
        status: 408,
        headers: new Headers({ 'Content-Type': 'text/plain' })
      });
    }
  });
  
  // Return the cached response immediately if available, otherwise wait for fetch
  return cachedResponse || fetchPromise;
}

// Main fetch event handler
self.addEventListener('fetch', event => {
  // Skip non-GET requests or cross-origin requests that don't support cors
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://cdn.jsdelivr.net') && 
      !event.request.url.startsWith('https://cdnjs.cloudflare.com')) {
    return;
  }
  
  // Determine cache strategy for this request
  const { cacheName, strategy, maxAge } = getCacheStrategy(event.request);
  
  // Apply the appropriate caching strategy
  if (strategy === 'network-first') {
    event.respondWith(networkFirst(event.request, cacheName, maxAge));
  } else if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(event.request, cacheName, maxAge));
  } else {
    event.respondWith(staleWhileRevalidate(event.request, cacheName));
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Function to handle form submissions that happened offline
function syncForms() {
  return idbKeyval.get('offline-forms').then(forms => {
    // If no forms are stored, return early
    if (!forms || !forms.length) return Promise.resolve();
    
    // Submit each form that was stored while offline
    return Promise.all(forms.map(form => {
      return fetch(form.url, {
        method: form.method,
        body: form.formData,
        headers: form.headers
      }).then(response => {
        if (response.ok) {
          // Remove from storage if successful
          return idbKeyval.get('offline-forms')
            .then(forms => forms.filter(f => f.id !== form.id))
            .then(remainingForms => idbKeyval.set('offline-forms', remainingForms));
        }
      }).catch(err => {
        console.error('Sync failed for form:', form.id, err);
        // Keep the form in storage to try again later
      });
    }));
  });
}

// Handle messages from clients (like skip waiting)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push notification support
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/eduforge.svg',
    badge: '/eduforge.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});