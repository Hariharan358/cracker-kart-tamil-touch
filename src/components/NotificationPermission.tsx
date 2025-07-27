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

  if (isTokenFound) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <Bell className="h-4 w-4" />
        <span className="text-sm">Notifications enabled</span>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRequestPermission}
      disabled={isRequesting}
      className="flex items-center gap-2"
    >
      <BellOff className="h-4 w-4" />
      {isRequesting ? 'Enabling...' : 'Enable Notifications'}
    </Button>
  );
}; 