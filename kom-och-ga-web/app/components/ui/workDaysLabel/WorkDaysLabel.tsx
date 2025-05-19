import * as React from 'react';

import {cn} from '../../../lib/utils';

const WorkDayContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('bg-white min-h-8  border-vgr-primary px-4 rounded-sm flex items-center justify-between py-1 drop-shadow-lg', className)} {...props} />);
WorkDayContainer.displayName = 'DailyLogsContainer';

const WorkDayDate = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn(' min-w-8  flex flex-col justify-center items-center text-sm font-semibold mr-2   ', className)} {...props} />);
WorkDayDate.displayName = 'DailyLogsType';

const WorkDayTime = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('bg-white w-full flex items-center justify-start ml-4 ', className)} {...props} />);
WorkDayTime.displayName = 'DailyLogsTime';

const WorkDayLine = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('h-8 w-[1px] bg-black mx-1', className)} {...props} />);
WorkDayLine.displayName = 'DailyLogsLine';
export {WorkDayContainer, WorkDayDate, WorkDayTime, WorkDayLine};
