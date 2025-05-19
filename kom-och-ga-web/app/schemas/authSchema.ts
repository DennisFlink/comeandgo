import {z} from 'zod';

export const loginSchema = z.object({
   username: z.string().min(2, {message: 'Felaktigt Användarnamn'}),
   password: z.string().min(2, {message: 'Felaktigt Lösenord'}),
});

export type LoginSchema = z.infer<typeof loginSchema>;
