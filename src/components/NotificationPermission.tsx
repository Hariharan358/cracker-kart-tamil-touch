import { useState } from 'react';
import { Button } from './ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useFCM } from '../hooks/useFCM';
import { useToast } from '../hooks/use-toast';

export const NotificationPermission = () => {
  const { isTokenFound, requestPermission } = useFCM();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const success = await requestPermission();
      if (success) {
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive push notifications for updates and offers.',
        });
      } else {
        toast({
          title: 'Permission Denied',
          description: 'Please enable notifications in your browser settings to receive updates.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable notifications. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRequestPermission}
      disabled={isRequesting}
      className="hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-300"
      aria-label={isTokenFound ? "Notifications enabled" : "Enable notifications"}
    >
      {isTokenFound ? (
        <Bell className="h-5 w-5 text-green-600" />
      ) : (
        <BellOff className="h-5 w-5" />
      )}
    </Button>
  );
}; 