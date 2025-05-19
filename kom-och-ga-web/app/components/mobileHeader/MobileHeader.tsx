import {useState} from 'react';
import Logo from '../logo/Logo';

import {Menu, Sidebar, X} from 'lucide-react';
import {useLocation} from '@remix-run/react';
import {useEffect} from 'react';
import {SheetTrigger} from '../ui/sheet/Sheet';
interface MobileHeaderProps {
   title?: string;
   userId: string | null;
}

const MobileHeader = ({userId}: MobileHeaderProps) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const location = useLocation();

   const getTitle = () => {
      switch (location.pathname) {
         case '/':
            return 'Översikt';
         case '/tidrapport':
            return 'Tidrapport';
      }
   };
   return (
      <>
         {userId && (
            <div className=" sticky bg-vgr-primary-dark h-10 w-full flex items-center px-4">
               <Logo context="small" />
            </div>
         )}
         <div className="sticky bg-vgr-primary px-4 py-4 gap-4  ">
            <div className={`flex items-center ${userId ? 'justify-end' : 'justify-center'} w-full`}>
               {!userId && <Logo context="lgwhite" />}
               {userId && (
                  <div className="w-full  flex items-center justify-between">
                     <span
                        className="text-white ml-2.5
                     "
                     >
                        {getTitle()}
                     </span>
                     <div className="flex flex-col items-center justify-center h-full px-2 ">
                        <SheetTrigger asChild>
                           <Menu className="icon-class transition-opacity duration-300" color="white" />
                        </SheetTrigger>
                        <span className="text-white text-xs">Meny</span>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
};

export default MobileHeader;
