import React, {useEffect} from 'react';
import {Card, CardHeader, CardTitle, CardContent} from '../ui/card/Card';
import {DailyLogsContainer, DailyLogsTime, DailyLogsType, DailyLogsLine} from '../ui/dailyLogsLabel/DailyLogsLabel';
import axios from 'axios';
import {useRevalidation} from '@/context/RevalidationContext';
import {changeLogType, transformLogs} from '@/lib/transformLogs';

const DailyLogs = (props) => {
   const {revalidationTrigger} = useRevalidation();
   interface Log {
      type: string;
      time: string;
      endTime?: string;
   }

   const [dailyLogs, setDailyLogs] = React.useState<Log[]>([]);

   const fetchDailyLogs = async () => {
      try {
         const response = await axios.get('/api/logs');
         const data = response.data;
         const transformedLogs = changeLogType({logs: data});

         setDailyLogs(transformedLogs);
      } catch (err) {}
   };
   useEffect(() => {
      fetchDailyLogs();
   }, [revalidationTrigger]);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Dagens Stämplingar</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-col gap-4">
            {dailyLogs.map((log, index) => (
               <DailyLogsContainer key={index}>
                  <DailyLogsType>{log.type}</DailyLogsType>
                  <DailyLogsLine />
                  <DailyLogsTime>{log.time}</DailyLogsTime>
               </DailyLogsContainer>
            ))}
         </CardContent>
      </Card>
   );
};

export default DailyLogs;
