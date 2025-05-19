import {db} from './db.server';
import {sendPush} from './push.server';
import cron from 'node-cron';

export function initializeCronJobs() {
   cron.schedule('0 9 * * 1-5', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const users = await db.user.findMany();
      console.log('Users:', users);

      for (const user of users) {
         const workDay = await db.workDay.findFirst({
            where: {
               userId: user.id,
               date: today,
            },
         });

         if (!workDay) {
            console.log(`No WorkDay found for user ${user.id}. Sending push notification.`);
            await sendPush(user.id);
         } else {
            console.log(`WorkDay already exists for user ${user.id}.`);
         }
      }
   });

   console.log('Cron jobs initialized.');
}
