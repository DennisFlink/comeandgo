import {EntryType} from '@prisma/client';
import {db} from './db.server';

export const upDateTimeEntry = async (timeEntryId: number, time: string, actionType?: string, types?: string) => {
   switch (actionType) {
      case 'add': {
         const workDay = await db.workDay.findUnique({where: {id: timeEntryId}});
         if (!workDay) {
            throw new Error('Workday not found');
         }

         const datePart = workDay.date.toISOString().split('T')[0];
         const newTimestamp = new Date(`${datePart}T${time}`);

         await db.timeEntry.create({
            data: {
               timestamp: newTimestamp,
               type: types as EntryType,
               workDay: {connect: {id: timeEntryId}},
            },
         });
         return;
      }

      case 'delete': {
         await db.timeEntry.delete({where: {id: timeEntryId}});
         return;
      }

      default: {
         const existing = await db.timeEntry.findUnique({where: {id: timeEntryId}});
         if (!existing) {
            throw new Error('Time entry not found');
         }

         const datePart = existing.timestamp.toISOString().split('T')[0];
         const newTimestamp = new Date(`${datePart}T${time}`);

         await db.timeEntry.update({
            where: {id: timeEntryId},
            data: {timestamp: newTimestamp},
         });
         return;
      }
   }
};

export const updateWorkDayStatus = async (workDayId: number) => {
   /* Hitta rätt dag */
   const workDay = await db.workDay.findUnique({
      where: {id: workDayId},
      include: {entries: true},
   });

   if (!workDay) {
      throw new Error('Workday not found');
   }

   const {entries} = workDay;
   /* Hitta stämplingar */
   const clockIn = entries.find((e) => e.type === 'CLOCK_IN');
   const clockOut = entries.find((e) => e.type === 'CLOCK_OUT');
   const breakStart = entries.find((e) => e.type === 'BREAK_START');
   const breakEnd = entries.find((e) => e.type === 'BREAK_END');
   let totalTime = 0;
   let completed = false;
   if (clockIn && clockOut) {
      const startTime = new Date(clockIn.timestamp).getTime();
      const endTime = new Date(clockOut.timestamp).getTime();
      totalTime = (endTime - startTime) / (1000 * 60 * 60);

      if (breakStart && breakEnd) {
         const breakStartTime = new Date(breakStart.timestamp).getTime();
         const breakEndTime = new Date(breakEnd.timestamp).getTime();
         const breakTime = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
         totalTime -= breakTime;
      }
      if ((!breakStart && !breakEnd) || (breakStart && breakEnd)) {
         completed = true;
      }
   }

   await db.workDay.update({
      where: {id: workDayId},
      data: {totalHours: totalTime, completed: completed},
   });
};
