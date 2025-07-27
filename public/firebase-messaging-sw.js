// Firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCGIjHqHVSi4R7pOwDSVtSBoKx-PA3TUuc",
  authDomain: "kmpyrotech-ff59c.firebaseapp.com",
  projectId: "kmpyrotech-ff59c",
  storageBucket: "kmpyrotech-ff59c.firebasestorage.app",
  messagingSenderId: "823979328021",
  appId: "1:823979328021:web:cfd4bfebc5feb4f729841c",
  measurementId: "G-4WT39FYB27"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title || 'KMPyrotech';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new notification',
    icon: '/logo.jpeg',
    badge: '/logo.jpeg',
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
}); 