// Service Worker for PWA notifications

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting(); // Immediately take control of the page
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    self.clients.claim() // Take control of all pages
  );
});

// Listen for push events
self.addEventListener('push', (event) => {
  let payload = {};

  try {
    payload = event.data.json();
  } catch (e) {
    payload = {
      title: 'Notification',
      body: event.data.text(),
      icon: '/origo-icon.png',
      tag: 'default'
    };
  }

  const options = {
    body: payload.body || 'You have a new notification',
    icon: payload.icon || '/origo-icon.png',
    badge: payload.badge || '/origo-badge.png',
    tag: payload.tag || 'origo-notification',
    data: payload.data || {},
    actions: payload.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Origo Notification', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open the app or a specific page
  const urlToOpen = event.notification.data ? 
    event.notification.data.url : 
    new URL('/', self.location.origin).href;

  event.waitUntil(
    self.clients.openWindow(urlToOpen)
  );
});

// Listen for background sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  // This function would sync notifications when connection is available
  console.log('Syncing notifications...');
  // Implementation would depend on your specific needs
}