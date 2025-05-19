import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
   const user = await prisma.user.create({
      data: {
         email: 'john.doe@example.com',
         password: 'hashedpassword123',
         name: 'John Doe',
         username: 'johndoe',
         flexSaldo: 20,
         semesterSaldo: 25,
         kompSaldo: 10,
         workDays: {
            create: [
               {
                  date: new Date('2025-05-05'),
                  totalHours: 8.0,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-05-05T08:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-05-05T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-05-05T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-05-05T16:30:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-05-06'),
                  totalHours: 6.0,
                  completed: false,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-05-06T09:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-05-06T12:30:00Z')},
                        // Forgot to CLOCK_OUT
                     ],
                  },
               },
               {
                  date: new Date('2025-05-07'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-05-07T08:15:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-05-07T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-05-07T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-05-07T16:00:00Z')},
                     ],
                  },
               },

               {
                  date: new Date('2025-03-03'),
                  totalHours: 8.0,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-03-03T08:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-03-03T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-03-03T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-03-03T16:30:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-03-04'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-03-04T08:30:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-03-04T12:15:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-03-04T12:45:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-03-04T16:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-03-05'),
                  totalHours: 4.0,
                  completed: false,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-03-05T09:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-03-05T12:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-04-04'),
                  totalHours: 0.0,
                  completed: false,
                  entries: {
                     create: [{type: 'CLOCK_IN', timestamp: new Date('2025-04-04T08:00:00Z')}],
                  },
               },
               {
                  date: new Date('2025-04-07'),
                  totalHours: 8.0,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-04-07T08:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-04-07T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-04-07T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-04-07T16:30:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-04-08'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-04-08T08:15:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-04-08T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-04-08T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-04-08T16:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-04-09'),
                  totalHours: 6.0,
                  completed: false,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-04-09T09:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-04-09T12:30:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-04-09T13:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-04-10'),
                  totalHours: 8.0,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-04-10T08:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-04-10T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-04-10T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2025-04-10T16:30:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-04-11'),
                  totalHours: 4.0,
                  completed: false,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2025-04-11T08:00:00Z')},
                        // No break or clock out → simulate forgotten logout
                     ],
                  },
               },
               {
                  date: new Date('2025-02-26'),
                  totalHours: 8.0,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2024-02-26T08:00:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-02-26T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-02-26T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2024-02-26T16:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-02-27'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2024-02-27T08:30:00Z')},
                        {type: 'BREAK_START', timestamp: new Date('2025-02-27T12:00:00Z')},
                        {type: 'BREAK_END', timestamp: new Date('2025-02-27T12:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2024-02-27T16:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-02-23'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2024-02-27T08:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2024-02-27T16:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-02-22'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2024-02-27T08:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2024-02-27T16:00:00Z')},
                     ],
                  },
               },
               {
                  date: new Date('2025-02-24'),
                  totalHours: 7.5,
                  completed: true,
                  entries: {
                     create: [
                        {type: 'CLOCK_IN', timestamp: new Date('2024-02-27T08:30:00Z')},
                        {type: 'CLOCK_OUT', timestamp: new Date('2024-02-27T16:00:00Z')},
                     ],
                  },
               },
            ],
         },
      },
   });

   console.log('Seeded user:', user);
}

main()
   .then(() => console.log('Seeding complete!'))
   .catch((e) => console.error(e))
   .finally(async () => {
      await prisma.$disconnect();
   });
