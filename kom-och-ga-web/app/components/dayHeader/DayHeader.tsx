import {Link} from '@remix-run/react';
import {ArrowLeft} from 'lucide-react';

const DayHeader = (props) => {
   return (
      <div className="bg-vgr-primary px-4 py-6 gap-4 relative h-20 ">
         <Link to={`/tidrapport`}>
            <ArrowLeft color="white" />
         </Link>
      </div>
   );
};

export default DayHeader;
