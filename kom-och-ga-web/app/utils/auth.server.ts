import {db} from './db.server';

import {LoginSchema, loginSchema} from '@/schemas/authSchema';
import {createUserSession} from './session.server';

export async function login({username, password}: LoginSchema) {
   const result = loginSchema.safeParse({username, password});

   const user = await db.user.findUnique({
      where: {username},
   });
   if (!user) {
      return Response.json({error: {username: ['Användare hittas ej']}}, {status: 400});
   }
   if (password !== user.password) {
      return Response.json({error: {password: ['Felaktigt lösenord']}}, {status: 400});
   }

   return createUserSession(user.id, '/');
}
