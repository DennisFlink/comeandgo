import {db} from '@/utils/db.server';
import {getUserId} from '@/utils/reqAuth.server';
import {ActionFunctionArgs} from '@remix-run/node';

/**
 * @swagger
 * /api/time:
 *   post:
 *     summary: Handles user actions (Clock In & Break Start)
 *     description: Allows users to clock in and start breaks.
 *     tags: [WorkTime]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [CLOCK_IN, BREAK_START,BREAK_END,CLOCK_OUT]
 *                 example: "CLOCK_IN"
 *     responses:
 *       200:
 *         description: Action successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User already performed the action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Du har redan klockat in"
 *       401:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Du måste vara inloggad"
 */
export const action = async ({request}: ActionFunctionArgs) => {
   const userId = await getUserId(request);

   if (!userId) {
      return Response.json({error: 'Du måste vara inloggad'}, {status: 401});
   }
   const {action} = await request.json();

   if (action === 'CLOCK_IN') {
      return await handleClockIn(userId);
   }
   if (action === 'BREAK_START') {
      return await handleBreakStart(userId);
   }
   if (action === 'BREAK_END') {
      return await handleBreakEnd(userId);
   }
   if (action === 'CLOCK_OUT') {
      return await handleClockOut(userId);
   }
};
/**
 * Handles the clock-in action for a user.
 * @param userId - The ID of the user.
 * @returns A response indicating success or failure.
 */
const handleClockIn = async (userId: number) => {
   let workDay = await db.workDay.findFirst({
      where: {
         userId: userId,
      },
      orderBy: {
         date: 'desc',
      },
      include: {
         entries: true,
      },
   });

   const today = new Date();
   today.setUTCHours(0, 0, 0, 0);

   if (!workDay || new Date(workDay.date).getTime() !== today.getTime()) {
      workDay = await db.workDay.create({
         data: {
            userId,
            date: today,
            completed: false,
         },
         include: {entries: true},
      });
   }
   const clockEntry = workDay.entries.find((entry) => entry.type === 'CLOCK_IN');
   if (clockEntry) {
      return Response.json({error: 'Du har redan klockat in'}, {status: 400});
   }
   await db.timeEntry.create({
      data: {workDayId: workDay.id, type: 'CLOCK_IN', timestamp: new Date()},
   });
   return new Response(JSON.stringify({success: true}), {status: 200});
};

/**
 * Handles the break start action for a user.
 * @param userId - The ID of the user.
 * @returns A response indicating success or failure.
 */
const handleBreakStart = async (userId: number) => {
   let workDay = await db.workDay.findFirst({
      where: {
         userId: userId,
      },
      orderBy: {
         date: 'desc',
      },
      include: {
         entries: true,
      },
   });

   if (!workDay) {
      return Response.json({error: 'Du har inte klockat in'}, {status: 400});
   }
   const clockEntry = workDay.entries.find((entry) => entry.type === 'BREAK_START');

   if (clockEntry) {
      return Response.json({error: 'Du har redan klockat rast'}, {status: 400});
   }
   await db.timeEntry.create({
      data: {workDayId: workDay.id, type: 'BREAK_START', timestamp: new Date()},
   });
   return new Response(JSON.stringify({success: true}), {status: 200});
};

/**
 * Handles the break end action for a user.
 * @param userId - The ID of the user.
 * @returns A response indicating success or failure.
 */
const handleBreakEnd = async (userId: number) => {
   let workDay = await db.workDay.findFirst({
      where: {
         userId: userId,
      },
      orderBy: {
         date: 'desc',
      },
      include: {
         entries: true,
      },
   });

   if (!workDay) {
      return new Response(JSON.stringify({error: 'Du har inte klockat in'}), {status: 400});
   }
   const breakStartEntry = workDay.entries.find((entry) => entry.type === 'BREAK_START');
   const breakEndEntry = workDay.entries.find((entry) => entry.type === 'BREAK_END');

   if (!breakStartEntry) {
      return new Response(JSON.stringify({error: 'Du har inte startat rast'}), {status: 400});
   }
   if (breakEndEntry) {
      return new Response(JSON.stringify({error: 'Du har redan avslutat rast'}), {status: 400});
   }
   await db.timeEntry.create({
      data: {workDayId: workDay.id, type: 'BREAK_END', timestamp: new Date()},
   });
   return new Response(JSON.stringify({success: true}), {status: 200});
};

/**
 * Handles the Clock out action for a user.
 * @param userId - The ID of the user.
 * @returns A response indicating success or failure.
 */

const STANDARD_WORK_HOURS = 8;

export const calculateFlexTime = (totalHours: number) => {
   return totalHours - STANDARD_WORK_HOURS;
};
const calculateTotalHours = (entries: {type: string; timestamp: Date}[]) => {
   let totalWorkTime = 0;
   let totalBreakTime = 0;
   let clockInTime: Date | null = null;
   let breakStartTime: Date | null = null;

   entries.forEach((entry) => {
      if (entry.type === 'CLOCK_IN') {
         clockInTime = entry.timestamp;
      } else if (entry.type === 'CLOCK_OUT' && clockInTime) {
         totalWorkTime += (entry.timestamp.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
         clockInTime = null;
      } else if (entry.type === 'BREAK_START') {
         breakStartTime = entry.timestamp;
      } else if (entry.type === 'BREAK_END' && breakStartTime) {
         totalBreakTime += (entry.timestamp.getTime() - breakStartTime.getTime()) / (1000 * 60 * 60);
         breakStartTime = null;
      }
   });

   totalWorkTime = totalWorkTime - totalBreakTime;
   return totalWorkTime;
};
const getWorkDayMetrics = (entries: {type: string; timestamp: Date}[]) => {
   const totalHours = calculateTotalHours(entries);
   const flexDelta = calculateFlexTime(totalHours);
   return {totalHours, flexDelta};
};
const handleClockOut = async (userId: number) => {
   let workDay = await db.workDay.findFirst({
      where: {userId: userId},
      orderBy: {date: 'desc'},
      include: {entries: true},
   });

   if (!workDay) {
      return new Response(JSON.stringify({error: 'Du har inte klockat in'}), {status: 400});
   }

   const clockEntry = workDay.entries.find((entry) => entry.type === 'CLOCK_OUT');
   if (clockEntry) {
      return new Response(JSON.stringify({error: 'Du har redan klockat ut'}), {status: 400});
   }

   const breakStartEntry = workDay.entries.find((entry) => entry.type === 'BREAK_START');
   const breakEndEntry = workDay.entries.find((entry) => entry.type === 'BREAK_END');

   let isCompleted = true;

   if (!breakStartEntry && !breakEndEntry) {
      const breakStartTimestamp = new Date();
      breakStartTimestamp.setUTCHours(11, 0, 0, 0);
      const breakEndTimestamp = new Date();
      breakEndTimestamp.setUTCHours(11, 45, 0, 0);

      await db.timeEntry.create({
         data: {workDayId: workDay.id, type: 'BREAK_START', timestamp: breakStartTimestamp},
      });

      await db.timeEntry.create({
         data: {workDayId: workDay.id, type: 'BREAK_END', timestamp: breakEndTimestamp},
      });
   } else if (breakStartEntry && !breakEndEntry) {
      isCompleted = false;
   }

   await db.timeEntry.create({
      data: {workDayId: workDay.id, type: 'CLOCK_OUT', timestamp: new Date()},
   });

   const updatedWorkDay = await db.workDay.findFirst({
      where: {id: workDay.id},
      include: {entries: true},
   });

   if (!updatedWorkDay) {
      return Response.json({error: 'Error fetching updated workday data'}, {status: 500});
   }
   const {totalHours, flexDelta} = getWorkDayMetrics(updatedWorkDay.entries);
   /*    const totalWorkTime = calculateTotalHours(updatedWorkDay.entries);
   const roundedTotalWorkTime = Math.round(totalWorkTime * 100) / 100; */

   await db.workDay.update({
      where: {id: workDay.id},
      data: {completed: isCompleted, totalHours: totalHours, flexDelta: flexDelta},
   });
   await db.user.update({
      where: {id: userId},
      data: {
         flexSaldo: {increment: flexDelta},
      },
   });

   return Response.json({success: true, completed: isCompleted}, {status: 200});
};
