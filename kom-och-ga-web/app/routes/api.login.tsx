import {ActionFunctionArgs} from '@remix-run/node';
import {login} from '../utils/auth.server';

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a session.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "hashedpassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
export const action = async ({request}: ActionFunctionArgs) => {
   try {
      const {username, password} = await request.json();

      if (!username || !password) {
         return Response.json({error: 'Missing username or password'}, {status: 400});
      }

      const user = await login({username, password});

      if (!user) {
         return Response.json({error: 'Invalid credentials'}, {status: 400});
      }

      return Response.json({message: 'Login successful', token: 'fake-jwt-token'});
   } catch (error) {
      console.error('Login error:', error);
      return Response.json({error: 'Unexpected Server Error'}, {status: 500});
   }
};
