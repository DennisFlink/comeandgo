import {Input} from '../components/ui/input/Input';
import type {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../components/ui/form/Form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '@/components/ui/button/button';
import {login} from '@/utils/auth.server';
import {redirect, useActionData, useNavigation, Form as RemixForm} from '@remix-run/react';
import {useEffect} from 'react';
import {redirectIfAuth} from '@/utils/reqAuth.server';

export const loginSchema = z.object({username: z.string().min(2, {message: 'Felaktigt Användarnamn'}), password: z.string().min(2, {message: 'Felaktigt Lösenord'})});

export const loader = async ({request}: LoaderFunctionArgs): Promise<{userId: string}> => {
   await redirectIfAuth(request);
   return {userId: ''};
};
export const action = async ({request}: ActionFunctionArgs) => {
   const formData = await request.formData();
   const username = formData.get('username') as string;
   const password = formData.get('password') as string;

   return login({username, password});
};
export default function LoginPage() {
   const actionData = useActionData<typeof action>();
   const navigation = useNavigation();

   const loginForm = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         username: actionData?.values?.username || '',
         password: '',
      },
   });
   useEffect(() => {
      if (!actionData?.error) return;
      console.log('actionData.error', actionData?.error);
      loginForm.clearErrors();
      if (actionData?.error) {
         let data = Object.entries(actionData?.error);
         data.forEach(([key, value]) => {
            loginForm.setError(key as keyof z.infer<typeof loginSchema>, {message: value as string});
         });
      }
   }, [actionData, loginForm]);

   return (
      <section className=" desktop:container desktop:mx-auto desktop:max-w-2xl desktop:mt-20">
         <Form {...loginForm}>
            <RemixForm method="post" className="space-y-12 mt-10">
               <FormField
                  control={loginForm.control}
                  name="username"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Användarnamn</FormLabel>
                        <FormControl>
                           <Input placeholder="Användarnamn" {...field} />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={loginForm.control}
                  name="password"
                  render={({field}) => (
                     <FormItem>
                        <FormLabel>Lösenord</FormLabel>
                        <FormControl>
                           <Input placeholder="Lösenord" type="password" {...field} />
                        </FormControl>

                        <FormMessage />
                     </FormItem>
                  )}
               />

               <Button variant="default" disabled={navigation.state === 'submitting' || navigation.state === 'loading'} className="w-full mt-10 ">
                  {navigation.state === 'submitting' ? 'LOGGAR IN...' : 'LOGGA IN'}
               </Button>
            </RemixForm>
         </Form>
      </section>
   );
}
