// filepath: c:\vgrlia\kom-och-ga-pwa\kom-och-ga-web\app\utils\monthLogs.ts
import {data} from '@remix-run/node';
import {db} from './db.server';

export const monthLogs = async (userId: number, month: number, year: number) => {
   const startDate = new Date(year, month - 1, 1);
   const endDate = new Date(year, month, 0);
   endDate.setHours(23, 59, 59, 999);
   console.log(startDate, endDate);
   const workDays = await db.workDay.findMany({
      where: {
         userId,
         date: {
            gte: startDate,
            lte: endDate,
         },
      },
      include: {entries: true},
      orderBy: {date: 'desc'},
   });

   const logs = workDays.map((workDay) => ({
      id: workDay.id,
      completed: workDay.completed,
      date: workDay.date.toISOString().split('T')[0],
      totalHours: workDay.totalHours,
   }));

   return {logs};
};
export const getAllIncompleteLogs = async (userId: number) => {
   const incompleteWorkDays = await db.workDay.findMany({
      where: {
         userId,
         completed: false,
      },
      include: {entries: true},
      orderBy: {date: 'desc'},
   });

   return incompleteWorkDays.map((workDay) => ({
      id: workDay.id,
      completed: workDay.completed,
      date: workDay.date.toISOString().split('T')[0],
      totalHours: workDay.totalHours,
   }));
};

export const getAllStampsForDay = async (dayId: number) => {
   const workDay = await db.workDay.findUnique({
      where: {id: dayId},
      include: {entries: true},
   });

   if (!workDay) {
      return null;
   }

   const stamps = workDay.entries.map((entry) => ({
      id: entry.id,
      time: entry.timestamp,
      date: workDay.date.toISOString().split('T')[0],
      type: entry.type,
   }));

   return {stamps, totalHours: workDay.totalHours, workdayDate: workDay.date};
};
