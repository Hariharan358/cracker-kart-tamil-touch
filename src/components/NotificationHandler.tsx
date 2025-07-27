import { useEffect } from 'react';
import { useFCM } from '../hooks/useFCM';
import { useNavigate } from 'react-router-dom';

export const NotificationHandler = () => {
  const { notification } = useFCM();
  const navigate = useNavigate();

  useEffect(() => {
    if (notification?.data) {
      const { type, orderId } = notification.data;
      
      // Handle different notification types
      switch (type) {
        case 'new_order':
          // Admin notification - could navigate to admin orders page
          console.log('New order notification received:', orderId);
          break;
          
        case 'order_status_update':
          // Customer notification - navigate to track order page
          if (orderId) {
            const customerMobile = localStorage.getItem('customerMobile');
            if (customerMobile) {
              navigate(`/track?orderId=${orderId}&mobile=${customerMobile}`);
            }
          }
          break;
          
        default:
          console.log('Unknown notification type:', type);
      }
    }
  }, [notification, navigate]);

  // This component doesn't render anything, it just handles notifications
  return null;
}; 