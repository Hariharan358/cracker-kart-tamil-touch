import { useState, useEffect } from 'react';
import { getFCMToken, onMessageListener, requestNotificationPermission } from '../lib/firebase';
import { useToast } from './use-toast';

interface NotificationPayload {
  notification?: {
    title: string;
    body: string;
    icon?: string;
  };
  data?: {
    [key: string]: string;
  };
}

export const useFCM = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isTokenFound, setIsTokenFound] = useState(false);
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if token exists in localStorage
    const existingToken = localStorage.getItem('fcmToken');
    if (existingToken) {
      setToken(existingToken);
      setIsTokenFound(true);
    }

    // Request permission and get token
    const initializeFCM = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.warn('Not in browser environment, skipping FCM initialization');
          return;
        }

        const permission = await requestNotificationPermission();
        if (permission) {
          const fcmToken = await getFCMToken();
          if (fcmToken) {
            setToken(fcmToken);
            setIsTokenFound(true);
            
            // Send token to backend
            await sendTokenToServer(fcmToken);
          }
        }
      } catch (error) {
        console.error('Error initializing FCM:', error);
        // Don't throw the error, just log it
      }
    };

    // Only initialize if we're in a browser environment with service worker support
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      initializeFCM();
    } else {
      console.warn('Service Worker not supported, skipping FCM initialization');
    }
  }, []);

  // Listen for foreground messages
  useEffect(() => {
    const setupMessageListener = async () => {
      try {
        // onMessageListener returns a Promise that resolves when a message is received
        const payload = await onMessageListener() as NotificationPayload | null;
        if (payload) {
          setNotification(payload);
          
          // Show toast notification
          if (payload?.notification) {
            toast({
              title: payload.notification.title,
              description: payload.notification.body,
              duration: 5000,
            });
          }
        }
      } catch (err) {
        console.error('Error receiving foreground message:', err);
        // Don't throw the error, just log it
      }
    };

    // Only setup listener if we're in a browser environment
    if (typeof window !== 'undefined') {
      setupMessageListener();
    }
  }, [toast]);

  // Send token to backend
  const sendTokenToServer = async (fcmToken: string) => {
    try {
      // Determine user type and ID
      let userId = 'anonymous';
      const isAdmin = localStorage.getItem('adminToken') === 'admin-auth-token';
      const customerMobile = localStorage.getItem('customerMobile');
      
      if (isAdmin) {
        userId = 'admin';
      } else if (customerMobile) {
        userId = `customer_${customerMobile}`;
      }
      
  const response = await fetch('https://cracker-backend-rvta.onrender.com/api/notifications/register-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: fcmToken,
          userId: userId,
        }),
      });

      if (response.ok) {
        console.log('FCM token registered with server');
      } else {
        console.warn('Failed to register FCM token with server');
      }
    } catch (error) {
      console.error('Error sending token to server:', error);
      // Don't throw the error, just log it
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      if (permission) {
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          setToken(fcmToken);
          setIsTokenFound(true);
          await sendTokenToServer(fcmToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  return {
    token,
    isTokenFound,
    notification,
    requestPermission,
  };
}; 