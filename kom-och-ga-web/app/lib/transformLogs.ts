import {Stamp} from '@/routes/tidrapport_.$day/route';
import {l} from 'node_modules/vite/dist/node/types.d-aGj9QkWt';

type Log = {
   id?: number;
   timestamp?: string;
   type: string;
   time?: string;
};
type LogsProps = {
   logs: (Log | Stamp)[];
};
type TransformedLog = {
   id?: number;
   type: string;
   time: string;
   endTime?: string;
};
type ChangeLogType = {
   id: number;
   type: string;
   time: string;
   endTime?: string;
};

const logTypeMap: {[key: string]: string} = {
   CLOCK_IN: 'IN',
   CLOCK_OUT: 'UT',
};
export const transformLogs = async ({logs}: LogsProps): Promise<TransformedLog[]> => {
   const transformedLogs: TransformedLog[] = [];

   logs.forEach((log) => {
      const [hours, minutes] = (log.time ?? '').split(':');
      const formattedTime = `${hours}:${minutes}`;

      if (log.type === 'BREAK_START') {
         transformedLogs.push({
            type: 'Lunch',
            time: `${formattedTime} - Pågår`,
         });
         console.log('break', transformedLogs);
      } else if (log.type === 'BREAK_END') {
         const lastLunch = transformedLogs.find((entry) => entry.type === 'Lunch' && entry.time.includes('Pågår'));

         if (lastLunch) {
            lastLunch.time = lastLunch.time.replace('Pågår', formattedTime);
         }
      } else {
         transformedLogs.push({
            ...log,
            type: logTypeMap[log.type] || log.type,
            time: formattedTime,
         });
      }
   });

   return transformedLogs;
};

const logType: {[key: string]: string} = {
   CLOCK_IN: 'IN',
   BREAK_START: 'LUNCH UT',
   BREAK_END: 'LUNCH IN',
   CLOCK_OUT: 'UT',
};
export const changeLogType = ({logs}: LogsProps): TransformedLog[] => {
   return logs.map((log) => {
      let formattedTime = '';

      if (log.time) {
         const date = new Date(log.time);
         const hours = String(date.getHours()).padStart(2, '0');
         const minutes = String(date.getMinutes()).padStart(2, '0');
         formattedTime = `${hours}:${minutes}`;
      }

      const mappedType = logType[log.type] || log.type;

      return {
         id: log.id,
         type: mappedType,
         time: formattedTime,
      };
   });
};
