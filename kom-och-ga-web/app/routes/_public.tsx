import {Outlet} from '@remix-run/react';

export default function Authlayout() {
   return (
      <div className="bg-vgr-bg-brown99 min-h-screen flex flex-col">
         <div className="flex-grow flex flex-col justify-start pt-10 mx-safearea">
            <main className="w-full flex flex-col flex-grow  ">
               <h1 className="text-5xl font-bold mb-4 text-center text-black">Kom & Gå</h1>
               <Outlet />
            </main>
         </div>
      </div>
   );
}
