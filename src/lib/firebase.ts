import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging with error handling
export const messaging = (() => {
  try {
    // Check if messaging is supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      return getMessaging(app);
    } else {
      console.warn('Firebase messaging not supported in this environment');
      return null;
    }
  } catch (error) {
    console.warn('Messaging not available:', error);
    return null;
  }
})();

// Initialize Firebase Analytics with error handling
import { getAnalytics } from 'firebase/analytics';
export const analytics = (() => {
  try {
    return getAnalytics(app);
  } catch (error) {
    console.warn('Analytics not available:', error);
    return null;
  }
})();

// FCM Token management
export const requestNotificationPermission = async () => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return true;
    } else {
      console.log('Notification permission denied.');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const getFCMToken = async () => {
  try {
    if (!messaging) {
      console.warn('Messaging not available');
      return null;
    }

    // Check if service worker is registered
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log('Notification permission not granted');
      return null;
    }

    // Check if service worker is ready
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
      console.warn('Service Worker not ready');
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: 'BK0pPHvAJtaVIRIqFhGG4JKXfjheQqvp1RtsxlnvbUFGUXn8DNlqwlpLwZCeEEaPyp2DM2jMEZ_nhqjZcreAcDk',
      serviceWorkerRegistration: registration
    });

    if (token) {
      console.log('FCM Token:', token);
      // Store token in localStorage for persistence
      localStorage.setItem('fcmToken', token);
      return token;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    // Don't throw the error, just return null
    return null;
  }
};

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn('Messaging not available for onMessage listener');
      resolve(null);
      return;
    }
    
    try {
      onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        resolve(payload);
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
      resolve(null);
    }
  });
};

// Recaptcha verifier for phone authentication
export const createRecaptchaVerifier = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => console.log('reCAPTCHA solved'),
    'expired-callback': () => console.log('reCAPTCHA expired')
  });
};

export default app; 