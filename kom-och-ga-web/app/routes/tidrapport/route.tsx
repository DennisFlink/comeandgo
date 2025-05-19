import ToggleSwitchButton from '@/components/ui/toggleSwitchButton/ToggleSwitchButton';
import {WorkDayContainer, WorkDayDate, WorkDayLine, WorkDayTime} from '@/components/ui/workDaysLabel/WorkDaysLabel';
import {getPrevMonth} from '@/lib/getPrevmonth';
import {getAllIncompleteLogs, monthLogs} from '@/utils/monthLogs';

import {getUserId, requireAuth} from '@/utils/reqAuth.server';
import {data, LoaderFunctionArgs, MetaFunction} from '@remix-run/node';
import {Link, useLoaderData} from '@remix-run/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';

export const meta: MetaFunction = () => {
   return [
      {
         title: 'Tidrapport - Kom och Gå',
         description: 'Se och hantera dina arbetsdagar och stämplingar för månaden.',
      },
   ];
};
type WorkDay = {
   id: number;
   completed: boolean;
   date: string;
   totalHours: number;
};
type LoadedMonth = {
   month: number;
   year: number;
};
export const loader = async ({request}: LoaderFunctionArgs) => {
   await requireAuth(request);
   const userId = await getUserId(request);
   const now = new Date();
   const month = now.getMonth() + 1;
   const year = now.getFullYear();

   const current = {month, year};
   const prev = await getPrevMonth(month, year);

   const [currentMonthLogs, prevMonthLogs, incompleteLogs] = await Promise.all([monthLogs(userId, current.month, current.year), monthLogs(userId, prev.month, prev.year), getAllIncompleteLogs(userId)]);
   console.log(currentMonthLogs);
   return data({
      currentMonthlogs: currentMonthLogs.logs,
      prevMonthLogs: prevMonthLogs.logs,
      incompleteLogs,
      loadedMonths: [current, prev],
   });
};

const Tidrapport = () => {
   const {
      currentMonthlogs,
      incompleteLogs,
      prevMonthLogs,
      loadedMonths: initialLoadedMonths,
   } = useLoaderData<{
      currentMonthlogs: WorkDay[];
      prevMonthLogs: WorkDay[];
      loadedMonths: LoadedMonth[];
      incompleteLogs: WorkDay[];
   }>();

   const initalsLogs = [...currentMonthlogs, ...prevMonthLogs];

   const [showIncomplete, setShowIncomplete] = useState<boolean>(true);
   const monthRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
   const [workDays, setWorkDays] = useState<WorkDay[]>(initalsLogs);

   const [loadedMonths, setLoadedMonths] = useState<Set<LoadedMonth>>(new Set(initialLoadedMonths));

   const [hasMore, setHasMore] = useState<boolean>(true);
   const defaultMonth = new Date(workDays[0].date).toLocaleDateString('sv-SE', {month: 'long'}).charAt(0).toUpperCase() + new Date(workDays[0].date).toLocaleDateString('sv-SE', {month: 'long'}).slice(1);
   const [displayMonth, setDisplayMonth] = useState<string>(defaultMonth);

   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const monthOptions: Intl.DateTimeFormatOptions = {month: 'short'};
      const dayOptions: Intl.DateTimeFormatOptions = {day: 'numeric'};
      const month = date.toLocaleDateString('en-US', monthOptions);
      const day = date.toLocaleDateString('en-US', dayOptions);
      return {month, day};
   };

   const handleToggle = (value: boolean) => {
      setShowIncomplete(value);
   };
   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  const month = entry.target.getAttribute('data-month');

                  if (month) {
                     setDisplayMonth(month);
                  }
               }
            });
         },
         {threshold: 0.1}
      );

      Object.values(monthRefs.current).forEach((ref) => {
         if (ref) {
            observer.observe(ref);
         }
      });

      return () => {
         Object.values(monthRefs.current).forEach((ref) => {
            if (ref) {
               observer.unobserve(ref);
            }
         });
      };
   }, [workDays, showIncomplete]);

   const fetchMoreData = async () => {
      const lastLoadedMonth = Array.from(loadedMonths).pop();
      if (!lastLoadedMonth) {
         console.error('No last loaded month found.');
         return;
      }
      console.log(lastLoadedMonth);
      const prev = await getPrevMonth(lastLoadedMonth.month, lastLoadedMonth.year);

      if (Array.from(loadedMonths).some((month) => month.month === prev.month && month.year === prev.year)) {
         console.log('Month already loaded:', prev);
         return;
      }

      console.log('Fetching data for previous month:', prev);

      try {
         const response = await axios.get(`/api/tidrapport?month=${prev.month}&year=${prev.year}`);
         const data = response.data.logs.logs;

         if (!data || data.length === 0) {
            console.log('No more data to load.');
            setHasMore(false);
            return;
         }

         setWorkDays((prevWorkDays) => [...prevWorkDays, ...data]);
         setLoadedMonths((prevLoadedMonths) => new Set([...prevLoadedMonths, prev]));
         console.log('Loaded months:', Array.from(loadedMonths));
      } catch (error) {
         console.error('Error fetching more data:', error);
      }
   };

   const formatDecimalHours = (decimalHours: number): string => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
   };

   return (
      <section className="flex flex-col">
         <div className="bg-white min-h-14 flex items-center justify-center">
            <ToggleSwitchButton onToggle={handleToggle} />
         </div>

         <div className="bg-vgr-bg-brown99 pt-10 h-[calc(100vh-190px)]">
            {!showIncomplete && <span className="w-full ml-6 ">{displayMonth}</span>}
            <div id="scrollableDiv" className="mx-safearea overflow-hidden max-h-3/4 overflow-y-auto">
               <InfiniteScroll dataLength={workDays.length} scrollableTarget="scrollableDiv" next={fetchMoreData} loader={<h4>Loading...</h4>} endMessage={<p>Inga fler dagar</p>} hasMore={hasMore} className="flex flex-col gap-6 justify-start py-4">
                  {showIncomplete
                     ? incompleteLogs.map((workDay) => {
                          const {month, day} = formatDate(workDay.date);
                          return (
                             <Link to={`/tidrapport/${workDay.id}`} key={workDay.id}>
                                <WorkDayContainer key={workDay.id}>
                                   <div className="flex flex-col">
                                      <WorkDayDate>{day}</WorkDayDate>
                                      <WorkDayDate>{month}</WorkDayDate>
                                   </div>
                                   <WorkDayLine />
                                   <WorkDayTime>
                                      <span className="text-sm"> Daglig summa</span> : {formatDecimalHours(workDay.totalHours)}h
                                   </WorkDayTime>
                                   <div className="flex items-center justify-center">
                                      <div className={`rounded-full h-2 w-2 bg-alert-icon-red`}></div>
                                   </div>
                                </WorkDayContainer>
                             </Link>
                          );
                       })
                     : workDays.map((workDay) => {
                          const {month, day} = formatDate(workDay.date);
                          const monthKey = `${new Date(workDay.date).getMonth() + 1}`;

                          return (
                             <Link to={`/tidrapport/${workDay.id}`} key={workDay.id}>
                                <div key={workDay.id} ref={(el) => (monthRefs.current[monthKey] = el)} data-month={new Date(workDay.date).toLocaleDateString('sv-SE', {month: 'long'}).charAt(0).toUpperCase() + new Date(workDay.date).toLocaleDateString('sv-SE', {month: 'long'}).slice(1)}>
                                   <WorkDayContainer key={workDay.id}>
                                      <div className="flex flex-col">
                                         <WorkDayDate>{day}</WorkDayDate>
                                         <WorkDayDate>{month}</WorkDayDate>
                                      </div>
                                      <WorkDayLine />
                                      <WorkDayTime>
                                         <span className="text-sm"> Daglig summa</span> : {formatDecimalHours(workDay.totalHours)} h
                                      </WorkDayTime>
                                      <div className="flex items-center justify-center">
                                         <div className={`rounded-full h-2 w-2 ${workDay.completed ? 'bg-green-400' : 'bg-alert-icon-red'}`}></div>
                                      </div>
                                   </WorkDayContainer>
                                </div>
                             </Link>
                          );
                       })}
               </InfiniteScroll>
            </div>
         </div>
      </section>
   );
};

export default Tidrapport;
