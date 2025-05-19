import {db} from '@/utils/db.server';
import {getUserId} from '@/utils/reqAuth.server';
import {LoaderFunctionArgs} from '@remix-run/node';

export const loader = async ({request}: LoaderFunctionArgs) => {
   const userId = await getUserId(request);

   const today = new Date();
   today.setUTCHours(0, 0, 0, 0);

   let workDay = await db.workDay.findFirst({
      where: {
         userId,
         OR: [{date: today}],
      },
      include: {entries: true},
   });

   let status: 'CLOCKED_IN' | 'ON_BREAK' | 'CLOCKED_OUT' | 'BREAK_END';

   if (!workDay || workDay.entries.length === 0) {
      status = 'CLOCKED_OUT';
   } else {
      const lastEntry = workDay.entries[workDay.entries.length - 1];

      switch (lastEntry.type) {
         case 'CLOCK_IN':
            status = 'CLOCKED_IN';
            break;
         case 'CLOCK_OUT':
            status = 'CLOCKED_OUT';
            break;
         case 'BREAK_START': {
            const breakEndEntry = workDay.entries.some((entry) => entry.type === 'BREAK_END' && new Date(entry.timestamp) > new Date(lastEntry.timestamp));
            status = breakEndEntry ? 'CLOCKED_IN' : 'ON_BREAK';
            break;
         }
         case 'BREAK_END':
            status = 'BREAK_END';
            break;
         default:
            status = 'ON_BREAK';
      }
   }

   return new Response(JSON.stringify(status), {status: 200});
};
