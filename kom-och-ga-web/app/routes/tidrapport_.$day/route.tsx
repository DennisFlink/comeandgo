import {Button} from '@/components/ui/button/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card/Card';
import {DailyLogsContainer, DailyLogsType, DailyLogsLine, DailyLogsTime} from '@/components/ui/dailyLogsLabel/DailyLogsLabel';
import {DialogHeader, DialogFooter} from '@/components/ui/dialog/Dialog';
import {changeLogType, transformLogs} from '@/lib/transformLogs';
import {getAllStampsForDay} from '@/utils/monthLogs';
import {Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose} from '@/components/ui/dialog/Dialog';
import {Form as RemixForm, useActionData} from '@remix-run/react';
import {ActionFunctionArgs, data, LoaderFunctionArgs, MetaFunction, redirect} from '@remix-run/node';
import {Form, Link, useFetcher, useLoaderData} from '@remix-run/react';
import {ArrowRight, Copy} from 'lucide-react';
import {Input} from '@components/ui/input/Input';
import {useState} from 'react';
import {useRevalidator} from '@remix-run/react';
import TimePicker from '@/components/timePicker/TimePicker';

import {upDateTimeEntry, updateWorkDayStatus} from '@/utils/stampUpdate.server';
export type Stamp = {
   id: number;
   timestamp: string;
   time: string;
   type: string;
   endTime: string;
   date: string;
};

type NormalizedLog = {
   id?: number;
   label?: string;
   time?: string;
   date?: string;
};
export const meta: MetaFunction = () => {
   return [
      {
         title: 'Tidrapport - Kom och Gå',
         description: 'Se och hantera dina stämplingar för vald dag.',
      },
   ];
};
export const action = async ({request}: ActionFunctionArgs) => {
   const formData = await request.formData();
   const time = formData.get('times') as string;
   const id = formData.get('id');
   const _action = formData.get('_action');
   const day = formData.get('workDayId');
   const label = formData.get('type');

   const labelToTypeMap: Record<string, string> = {
      IN: 'CLOCK_IN',
      'LUNCH UT': 'BREAK_START',
      'LUNCH IN': 'BREAK_END',
      UT: 'CLOCK_OUT',
   };
   const mappedType = labelToTypeMap[label as string];

   if (_action === 'add') {
      if (!day) {
         return data({error: 'Cant find day'}, {status: 404});
      }

      await upDateTimeEntry(Number(day), time, 'add', mappedType);
      await updateWorkDayStatus(Number(day));
      return data({success: true});
   }
   if (_action === 'delete') {
      await upDateTimeEntry(Number(id), time, 'delete');
      await updateWorkDayStatus(Number(day));
      return data({success: true});
   }

   if (!time || !id) {
      return data({error: 'Missing data'}, {status: 400});
   }

   try {
      await upDateTimeEntry(Number(id), time);
      await updateWorkDayStatus(Number(day));
      return data({success: true});
   } catch (error) {
      console.error(error);
      return data({error: 'Time entry not found'}, {status: 404});
   }
};
const expectedLabels = ['IN', 'LUNCH UT', 'LUNCH IN', 'UT'];

export const loader = async ({params}: LoaderFunctionArgs) => {
   const dayIdParam = params.day;

   const dayId = Number(dayIdParam);
   const result = await getAllStampsForDay(dayId);
   if (!result) {
      throw new Response('No data found for the given dayId', {status: 404});
   }

   const {stamps, totalHours, workdayDate} = result;

   return data({stamps, totalHours, workdayDate, dayId});
};

const Day = (props) => {
   const [singleStamp, setSingleStamp] = useState<NormalizedLog>();
   const [dialogOpen, setDialogOpen] = useState<string | null>(null);
   const [dialogClosed, setDialogClosed] = useState(false);
   const [dialogKey, setDialogKey] = useState(0);

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const monthOptions: Intl.DateTimeFormatOptions = {month: 'long', timeZone: 'UTC'};
      const dayOptions: Intl.DateTimeFormatOptions = {day: 'numeric', timeZone: 'UTC'};
      const month = date.toLocaleDateString('sv-SE', monthOptions).charAt(0).toUpperCase() + date.toLocaleDateString('sv-SE', monthOptions).slice(1);
      const day = date.toLocaleDateString('sv-SE', dayOptions);
      return {month, day};
   };
   const {stamps, totalHours, workdayDate, dayId} = useLoaderData<{stamps: Stamp[]; totalHours: number; workdayDate: string; dayId: number}>();
   const {month, day} = formatDate(workdayDate);

   const normalizeLogs = (logs: Stamp[]) => {
      const transformedLogs = changeLogType({logs});

      return expectedLabels.map((label) => {
         const match = transformedLogs.find((log) => log.type === label);

         if (!match) {
            return {label, missing: true};
         }

         return {
            id: match.id,
            label: match.type,
            time: match.time,
         };
      });
   };
   const normalizedLogs = normalizeLogs(stamps);

   const handleSetStamp = (id: number | undefined) => {
      if (!id) {
         return;
      }
      const selectedStamp = normalizedLogs.find((log) => log.id === id);

      setSingleStamp(selectedStamp);
   };

   const handleDialogOpen = (label: string | null) => {
      setDialogOpen(label);
   };
   const formatDecimalHours = (decimalHours: number): string => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
   };
   return (
      <Dialog>
         <div className="bg-vgr-bg-brown99 pt-4  h-[calc(100vh-80px)]">
            <div className="  overflow-y-auto flex-col justify-start  mx-safearea overflow-hidden">
               <main className="w-full flex flex-col gap-4 py-6">
                  <div className="flex w-full justify-center gap-1">
                     <span className="text-lg font-semibold">{day ? `${day}` : 'Ogiltig'}</span>
                     <span className="text-lg font-semibold">{month ? `${month}` : 'Ogiltig'}</span>
                  </div>
                  <Card className="bg-white gap-4 relative ">
                     <CardHeader>
                        <CardTitle>Stämplingar</CardTitle>
                     </CardHeader>
                     <CardContent className="flex flex-col gap-4 px-2">
                        {normalizedLogs.map((log, index) => (
                           <DailyLogsContainer
                              onClick={() => {
                                 handleSetStamp(log.id);
                                 handleDialogOpen(log.label);
                              }}
                              key={index}
                              className={`bg-white py-1 drop-shadow-lg h-10 ${log.missing ? 'border-alert-icon-red bg-red-300 ' : ''}`}
                           >
                              <DailyLogsType className={`${log.missing ? ' bg-red-300 text-nowrap ' : ' text-nowrap w-fit'}`}>{log.label}</DailyLogsType>
                              <DailyLogsLine />
                              <DailyLogsTime className={`${log.missing ? ' bg-red-300 ' : ''}`}>{log.missing ? 'Stämpling saknas' : log.time}</DailyLogsTime>
                              <div className="  flex items-center justify-end px-1">
                                 <ArrowRight size={20} />
                              </div>
                           </DailyLogsContainer>
                        ))}
                     </CardContent>
                  </Card>
                  {normalizedLogs.map((stamp, index) => (
                     <TimePicker key={index} dayLabel={stamp.label} dayId={dayId} day={day} month={month} open={dialogOpen === stamp.label} onOpenChange={() => handleDialogOpen(null)} stamp={!stamp.missing ? stamp : undefined} />
                  ))}
                  {/*          <TimePicker dayId={dayId} day={day} month={month} open={dialogOpen} onOpenChange={() => handleDialogOpen(!open)} stamp={singleStamp || undefined} /> */}
                  <Card>
                     <CardHeader></CardHeader>
                     <CardContent className="flex flex-col gap-4 px-2">
                        <div className="text-center text-lg font-semibold">{totalHours ? `${formatDecimalHours(totalHours)}` : '-- : --'}</div>
                        <div className="text-center text-sm text-gray-700">Total arbetad tid för dagen</div>
                     </CardContent>
                  </Card>
                  <div className="w-full flex justify-end "></div>
               </main>
            </div>
         </div>
      </Dialog>
   );
};

export default Day;
