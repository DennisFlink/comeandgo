import {db} from '@/utils/db.server';
import {getUserId} from '@/utils/reqAuth.server';
import {LoaderFunctionArgs} from '@remix-run/node';

export const loader = async ({request}: LoaderFunctionArgs) => {
   const userId = await getUserId(request);

   if (!userId) {
      return Response.json({error: 'Du måste vara inloggad'}, {status: 401});
   }

   const today = new Date();
   today.setUTCHours(0, 0, 0, 0);

   const workDay = await db.workDay.findFirst({
      where: {
         userId: userId,
         date: today,
      },
      include: {
         entries: true,
      },
   });
   if (!workDay) {
      return Response.json({error: 'Du har inte börjat din arbetsdag'}, {status: 201});
   }

   const logs = workDay.entries.map((entry) => ({
      type: entry.type,
      time: entry.timestamp,
   }));

   return new Response(JSON.stringify(logs), {status: 200});
};
