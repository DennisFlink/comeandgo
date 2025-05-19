import {monthLogs} from '@/utils/monthLogs';
import {getUserId} from '@/utils/reqAuth.server';
import {data, LoaderFunctionArgs} from '@remix-run/node';
export const loader = async ({request}: LoaderFunctionArgs) => {
   const url = new URL(request.url);

   const month = parseInt(url.searchParams.get('month') ?? '', 10);
   const year = parseInt(url.searchParams.get('year') ?? '', 10);

   const userId = await getUserId(request);

   if (!userId) {
      return Response.json({error: 'Unauthorized'}, {status: 401});
   }
   const logs = await monthLogs(userId, month, year);

   if (!logs) {
      return Response.json({error: 'No logs found'}, {status: 404});
   }
   return data({logs});
};
