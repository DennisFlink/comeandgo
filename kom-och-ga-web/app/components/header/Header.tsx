import {useState} from 'react';
import Logo from '../logo/Logo';
import MobileHeader from '../mobileHeader/MobileHeader';
import SidebarNav from '@/components/sidebarNav/SideBarNav';
import {SheetContent, Sheet, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '../ui/sheet/Sheet';
import {Menu} from 'lucide-react';

interface HeaderProps {
   userId: string | null;
}

const Header = ({userId}: HeaderProps) => {
   const [open, setOpen] = useState(false);

   return (
      <header>
         <Sheet open={open} onOpenChange={setOpen}>
            {/* Mobile Header */}
            <div className="block tablet:hidden">
               <MobileHeader userId={userId} />
            </div>

            {/* Desktop Header */}
            <div className="hidden tablet:flex flex-col items-center justify-between px-10 pb-6 pt-10 gap-10 top-0 w-full z-10 bg-white">
               <div className="flex items-center justify-between w-full">
                  <Logo context="lgblack" />
                  <SheetTrigger asChild>
                     <Menu className="icon-class transition-opacity duration-300" color="black" />
                  </SheetTrigger>
               </div>
            </div>

            <SheetContent className="desktop:w-[500px]" side="right">
               <SheetHeader className="mt-6 mr-16 text-sm">
                  <SheetTitle>Arbetsrelaterat</SheetTitle>
               </SheetHeader>
               <SidebarNav onNavigate={() => setOpen(false)} />
            </SheetContent>
         </Sheet>
      </header>
   );
};

export default Header;
