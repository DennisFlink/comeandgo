import webPush from 'web-push';
import {db} from './db.server';
import dotenv from 'dotenv';

dotenv.config();
webPush.setVapidDetails('mailto:admin@example.com', process.env.VITE_VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export const sendPush = async (userId: number) => {
   const sub = await db.subscription.findFirst({where: {userId}});

   if (!sub) {
      console.warn(`No subscription for user ${userId}`);
      return;
   }

   const payload = JSON.stringify({
      title: 'Har du glömt att stämpla in?',
      body: 'Kom ihåg att stämpla in.',
      url: '/',
   });
   console.log(process.env.VAPID_PRIVATE_KEY!);
   try {
      await webPush.sendNotification(JSON.parse(sub.subscription), payload, {vapidDetails: {subject: 'mailto:admin@example.com', publicKey: process.env.VITE_VAPID_PUBLIC_KEY!, privateKey: process.env.VAPID_PRIVATE_KEY!}});
      console.log(` Push sent to user ${userId}`);
   } catch (err: any) {
      console.error(' Push failed:', err.statusCode);
      if (err.statusCode === 410 || err.statusCode === 404) {
         await db.subscription.delete({where: {id: sub.id}});
      }
   }
};
