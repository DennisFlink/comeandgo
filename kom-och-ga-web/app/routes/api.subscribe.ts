import {db} from '@/utils/db.server';
import {getUserId} from '@/utils/reqAuth.server';
import {ActionFunctionArgs, data} from '@remix-run/node';

export const action = async ({request}: ActionFunctionArgs) => {
   const userId = await getUserId(request);

   if (!userId) {
      return data({error: 'Du måste vara inloggad'}, {status: 401});
   }

   const body = await request.json();
   const actualSubscription = body.subscription;
   if (!actualSubscription?.endpoint) {
      return data({error: 'Invalid subscription object'}, {status: 400});
   }

   await db.subscription.upsert({
      where: {
         userId_endpoint: {
            userId,
            endpoint: actualSubscription.endpoint,
         },
      },
      update: {
         subscription: JSON.stringify(actualSubscription),
      },
      create: {
         userId,
         endpoint: actualSubscription.endpoint,
         subscription: JSON.stringify(actualSubscription),
      },
   });

   return data({success: true}, {status: 200});
};

const createSubscription = async (userId: string, subscription: PushSubscription) => {};
