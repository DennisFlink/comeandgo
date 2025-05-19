import {useState} from 'react';
import {Label} from '../label/Label';
import {Input} from '../input/Input';

type Props = {
   onToggle: (showIncomplete: boolean) => void;
};
const ToggleSwitchButton = ({onToggle}: Props) => {
   const [showIncomplete, setShowIncomplete] = useState(true);
   const toggleFilter = () => {
      setShowIncomplete(!showIncomplete);
      onToggle(!showIncomplete);
   };

   return (
      <div className="mt-10 pb-4">
         <Label htmlFor="Toggle1" className="relative inline-flex items-center justify-around w-60 h-6 bg-slate-300 dark:bg-gray-800 rounded-full select-none cursor-pointer py-4">
            <Input id="Toggle1" type="checkbox" className="sr-only peer" onChange={toggleFilter} checked={showIncomplete} />
            <div
               className={`absolute w-30 h-full bg-vgr-primary rounded-full transition-all shadow-vgr-primary
                     ${showIncomplete ? 'left-30' : 'left-0'}
                  `}
            ></div>
            <span
               className={`relative w-30 h-full flex items-center justify-center font-normal text-black transition
                     ${showIncomplete ? 'text-black' : 'text-white'}
                  `}
            >
               ALLA
            </span>

            <span
               className={`relative w-30 h-full flex items-center justify-center font-normal text-black transition
                     ${showIncomplete ? 'text-white' : 'text-black'}
                  `}
            >
               MISSAT
            </span>
         </Label>
      </div>
   );
};

export default ToggleSwitchButton;
