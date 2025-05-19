import {db} from '@/utils/db.server';
import {getUserId} from '@/utils/reqAuth.server';
import {sendPush} from '@/utils/push.server';
import {ActionFunctionArgs, data} from '@remix-run/node';

export const action = async ({request}: ActionFunctionArgs) => {
   const userId = await getUserId(request);
   if (!userId) {
      return data({error: 'Du måste vara inloggad'}, {status: 401});
   }
   await sendPush(userId);
   return data({success: true}, {status: 200});
};
