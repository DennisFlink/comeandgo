import {redirect} from '@remix-run/node';
import {sessionStorage} from './session.server';

export const requireAuth = async (req: Request) => {
   const session = await sessionStorage.getSession(req.headers.get('Cookie'));
   const userId = session.get('userId');

   if (!userId) {
      throw redirect('/login');
   }
};
export const redirectIfAuth = async (req: Request) => {
   const session = await sessionStorage.getSession(req.headers.get('Cookie'));
   const userId = session.get('userId');

   if (userId) {
      throw redirect('/');
   }
};

export const getUserId = async (req: Request) => {
   const session = await sessionStorage.getSession(req.headers.get('Cookie'));
   const userId = session.get('userId');

   if (!userId) {
      return null;
   }
   return userId;
};
