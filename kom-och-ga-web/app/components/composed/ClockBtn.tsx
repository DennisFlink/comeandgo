import React, {useEffect, useState} from 'react';
import {Button} from '../ui/button/button';
import axios from 'axios';
import {useRevalidation} from '@/context/RevalidationContext';

const ClockBtn = (props) => {
   const [status, setStatus] = useState<'CLOCKED_IN' | 'CLOCKED_OUT' | 'ON_BREAK' | 'BREAK_END' | null>(null);
   const {revalidate} = useRevalidation();
   const fetchStatus = async () => {
      try {
         const response = await axios.get('/api/time/status');

         setStatus(response.data);
      } catch (err) {
         console.error('Error fetching status:', err);
      }
   };

   useEffect(() => {
      fetchStatus();
   }, []);

   const handleClockIn = async (action: string) => {
      try {
         const response = await axios.post('/api/time', {action});
         if (response.status === 200) {
            fetchStatus();
            revalidate();
         }
      } catch (err) {
         console.error('Error:', err);
      }
   };
   console.log(status);
   return (
      <div className="w-full px-4">
         {status === 'CLOCKED_OUT' || !status ? (
            <Button size="lg" variant="default" onClick={() => handleClockIn('CLOCK_IN')} className="w-full ">
               STÄMPLA IN
            </Button>
         ) : status === 'CLOCKED_IN' ? (
            <div className="flex mx-2 gap-2 ">
               <Button type="button" size="lg" variant="default" onClick={() => handleClockIn('CLOCK_OUT')} className="w-1/2 ">
                  STÄMPLA UT
               </Button>
               <Button type="button" size="lg" variant="outline" onClick={() => handleClockIn('BREAK_START')} className="w-1/2 ">
                  RAST
               </Button>
            </div>
         ) : status === 'ON_BREAK' ? (
            <div className="w-full gap-2 flex  ">
               <Button type="button" size="lg" variant="outline" onClick={() => handleClockIn('BREAK_END')} className="w-full ">
                  AVSLUTA RAST
               </Button>
            </div>
         ) : status === 'BREAK_END' ? (
            <div className="w-full gap-2 flex  ">
               <Button type="button" size="lg" variant="default" onClick={() => handleClockIn('CLOCK_OUT')} className="w-full ">
                  STÄMPLA UT
               </Button>
            </div>
         ) : null}
      </div>
   );
};

export default ClockBtn;
