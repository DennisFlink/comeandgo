import Footer from '@/components/footer/Footer';

import {RevalidationProvider} from '@/context/RevalidationContext';
import {Outlet, useLocation, useRevalidator} from '@remix-run/react';

const DashboardLayout = () => {
   const location = useLocation();
   const noFooterRoutes = ['/tidrapport'];
   const showFooter = !noFooterRoutes.includes(location.pathname);

   return (
      <RevalidationProvider>
         <div className="flex flex-col h-full bg-vgr-bg-brown99 pt-4">
            <div className="flex flex-col flex-grow overflow-hidden mx-safearea">
               <main className="flex-grow overflow-y-auto">
                  <Outlet />
               </main>
            </div>

            {showFooter && <Footer />}
         </div>
      </RevalidationProvider>
   );
};

export default DashboardLayout;
