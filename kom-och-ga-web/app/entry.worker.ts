/// <reference lib="WebWorker" />

import {Logger} from '@remix-pwa/sw';
import {PushManager} from '@remix-pwa/push/client';
export type {};

declare let self: ServiceWorkerGlobalScope;
const logger = new Logger({
   prefix: 'todoist',
});
self.addEventListener('install', (event) => {
   logger.log('Service worker installed');
   event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
   logger.log('Service worker activated');
   event.waitUntil(self.clients.claim());
});
/* self.addEventListener('push', (e) => {
   const message = e.data?.json();

   console.log('[SW] Push received:', message);

   e.waitUntil(
      self.registration.showNotification(message.title, {
         body: message.body,
         icon: 'https://www.vgregion.se/images/favicons/favicon-180.png',
         badge: 'https://www.vgregion.se/images/favicons/favicon-180.png',
         data: {
            url: message.url,
         },
      })
   );
});

self.addEventListener('notificationclick', (e) => {
   e.notification.close();
   e.waitUntil(self.clients.openWindow(e.notification.data?.url || '/'));
});
 */
const pushManager = new PushManager({
   handlePushEvent: (event) => {
      const message = event.data?.json();
      console.log('[SW] Push received:', message);

      event.waitUntil(
         self.registration.showNotification(message.title, {
            body: message.body,
            icon: 'https://www.vgregion.se/images/favicons/favicon-180.png',
            badge: 'https://www.vgregion.se/images/favicons/favicon-180.png',
            data: {
               url: message.url,
            },
         })
      );
   },
   handleNotificationClick: (event) => {
      console.log('[SW] Notification clicked:', event.notification);

      event.notification.close();

      event.waitUntil(self.clients.openWindow(event.notification.data?.url || '/'));
   },
   handleNotificationClose: (event) => {
      // Handle notification close event
   },
   handleNotificationError: (event) => {
      // Handle notification error event
   },
});
