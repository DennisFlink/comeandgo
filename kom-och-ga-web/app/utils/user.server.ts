import {UserSaldoDTO} from '@/dtos/user.dto';
import {db} from './db.server';

export const getUser = async (id: number): Promise<UserSaldoDTO> => {
   const user = await db.user.findUnique({
      where: {id: id},
      select: {
         id: true,
         name: true,
         email: true,
         flexSaldo: true,
         semesterSaldo: true,
         kompSaldo: true,
      },
   });

   if (!user) {
      throw new Error('User not found');
   }

   return user;
};
