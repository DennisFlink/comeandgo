import {useState} from 'react';
import ClockBtn from '../composed/ClockBtn';
import {Button} from '../ui/button/button';
import {NotificationButton} from '../ui/notificationButton/NotificationButton';
const Footer = () => {
   const [showDrawer, setShowDrawer] = useState(false);

   return (
      <>
         <footer className="flex flex-col items-center justify-end bg-white mt-md desktop:rounded-vgr-footer-xl-border-radius mobile:rounded-vgr-footer-lg-border-radius min-h-24 max-h-26 border-t-1 border-gray-400 py-6 relative">
            <ClockBtn />
         </footer>
      </>
   );
};

export default Footer;
