import {redirect, createCookieSessionStorage} from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
   throw new Error('SESSION_SECRET must be set');
}

const sessionStorage = createCookieSessionStorage({
   cookie: {
      name: '_session',
      secure: process.env.NODE_ENV === 'production',
      secrets: [sessionSecret],
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
   },
});

export async function createUserSession(userId: number, redirectTo: string) {
   const session = await sessionStorage.getSession();
   session.set('userId', userId);
   return redirect(redirectTo, {
      headers: {
         'Set-Cookie': await sessionStorage.commitSession(session),
      },
   });
}

export {sessionStorage};
