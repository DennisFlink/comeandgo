import {Link, useLocation} from '@remix-run/react';
import {CircleCheck, LayoutGrid} from 'lucide-react';
import {NotificationButton} from '../ui/notificationButton/NotificationButton';
import {Button} from '../ui/button/button';
type SidebarNavProps = {
   onNavigate?: () => void;
};
const SideBarNav = ({onNavigate}: {onNavigate?: () => void}) => {
   const location = useLocation();
   const currentPath = location.pathname;

   return (
      <nav className="flex flex-col gap-4 px-4 mt-4 text-sm font-medium">
         <div className={`flex items-center justify-start rounded-2xl py-1 px-4 ${currentPath === '/' ? 'bg-vgr-primary' : ''}`}>
            <LayoutGrid color={currentPath === '/' ? 'white' : 'black'} size={20} />
            <Link to="/" className={`px-2 ${currentPath === '/' ? 'text-white font-bold' : 'text-gray-800'}`} onClick={onNavigate}>
               Översikt
            </Link>
         </div>

         <div className={`flex items-center justify-start rounded-2xl py-1 px-4 ${currentPath === '/tidrapport' ? 'bg-vgr-primary' : ''}`}>
            <CircleCheck color={currentPath === '/tidrapport' ? 'white' : 'black'} size={20} />
            <Link to="/tidrapport" className={`px-2 ${currentPath === '/tidrapport' ? 'text-white font-bold' : 'text-gray-800'}`} onClick={onNavigate}>
               Tidrapport
            </Link>
         </div>
         <div className="w-full h-full flex items-center justify-center mt-4">{/*  <NotificationButton /> */}</div>
      </nav>
   );
};
export default SideBarNav;
