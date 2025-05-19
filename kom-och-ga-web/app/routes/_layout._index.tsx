import {Info, TriangleAlert} from 'lucide-react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '../components/ui/card/Card';
import {NotificationLabel, NotificationIcon, NotificationContainer} from '../components/ui/notificationLabel/NotificationLabel';
import {getUserId, requireAuth} from '@/utils/reqAuth.server';
import {LoaderFunctionArgs, MetaFunction} from '@remix-run/node';
import SaldoInfo from '@/components/composed/SaldoInfo';
import {getUser} from '@/utils/user.server';
import {Link, useLoaderData} from '@remix-run/react';
import WelcomeCard from '@/components/composed/WelcomeCard';
import DailyLogs from '@/components/composed/DailyLogs';
import {getAllIncompleteLogs} from '@/utils/monthLogs';
import {Button} from '@/components/ui/button/button';
import {db} from '@/utils/db.server';
export const meta: MetaFunction = () => {
   return [
      {
         title: 'Översikt - Kom och Gå',
         description: 'Se och hantera dina arbetsdagar och stämplingar för månaden.',
      },
   ];
};
export const loader = async ({request}: LoaderFunctionArgs) => {
   await requireAuth(request);
   const userId = await getUserId(request);
   const user = await getUser(userId);
   const incompletedLogs = await getAllIncompleteLogs(userId);

   return {user, incompletedLogs};
};

const index = (props) => {
   const {user, incompletedLogs} = useLoaderData<typeof loader>();
   const getFlexSaldoThresholdMessage = (flexSaldo: number) => {
      const thresholds = [10, 20, 30, 40];

      for (const t of thresholds) {
         if (flexSaldo >= t) {
            return `Flex överstigit ${t}h`;
         }
         if (flexSaldo <= -t) {
            return `Flex underskridit -${t}h`;
         }
      }

      return null;
   };

   const flexNotis = getFlexSaldoThresholdMessage(user.flexSaldo);

   return (
      <div className="  flex flex-col gap-2 ">
         <WelcomeCard name={user.name} />
         <SaldoInfo flexSaldo={user.flexSaldo} semesterSaldo={user.semesterSaldo} kompSaldo={user.kompSaldo} />
         <Card>
            <CardHeader>
               <CardTitle>Notiser</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-2">
               {flexNotis && (
                  <NotificationContainer>
                     <NotificationIcon>
                        <TriangleAlert size={26} />
                     </NotificationIcon>
                     <NotificationLabel>{flexNotis}</NotificationLabel>
                  </NotificationContainer>
               )}
               {incompletedLogs.length > 0 && (
                  <Link to="/tidrapport">
                     <NotificationContainer>
                        <NotificationIcon className=" bg-alert-icon-red">
                           <TriangleAlert stroke="white" size={26} />
                        </NotificationIcon>
                        <NotificationLabel variant={'destructive'}> Du har flera felaktiga stämplingar</NotificationLabel>
                     </NotificationContainer>
                  </Link>
               )}
            </CardContent>
         </Card>
         <DailyLogs />
      </div>
   );
};

export default index;
