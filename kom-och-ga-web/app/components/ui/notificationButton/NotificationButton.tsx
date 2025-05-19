import {usePush} from '@remix-pwa/push/client';
import {Button} from '../button/button';
import {Logger} from '@remix-pwa/sw';
import axios from 'axios';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function NotificationButton() {
   const {subscribeToPush, unsubscribeFromPush, isSubscribed} = usePush();

   const handleSubscribe = () => {
      if (!VAPID_PUBLIC_KEY) {
         console.error('VAPID_PUBLIC_KEY is not defined.');
         return;
      }

      subscribeToPush(
         VAPID_PUBLIC_KEY,
         async (subscription) => {
            console.log('User subscribed to push notifications!', subscription);

            try {
               await axios.post(
                  '/api/subscribe',
                  {
                     type: 'subscribe',
                     subscription,
                  },
                  {
                     headers: {
                        'Content-Type': 'application/json',
                     },
                  }
               );
               console.log('Subscription successfully sent to the server.');
            } catch (error) {
               console.error('Error sending subscription to the server!', error);
            }
         },
         (error) => {
            console.error('Error subscribing user to push notifications!', error);
         }
      );
   };

   return (
      <Button
         onClick={() => {
            if (isSubscribed) {
               unsubscribeFromPush();
            } else {
               handleSubscribe();
            }
         }}
      >
         {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
   );
}
