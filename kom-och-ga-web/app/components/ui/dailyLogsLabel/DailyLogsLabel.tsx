import * as React from 'react';

import {cn} from '../../../lib/utils';

const DailyLogsContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('bg-white min-h-8 border border-vgr-primary px-1 rounded-sm flex items-center ', className)} {...props} />);
DailyLogsContainer.displayName = 'DailyLogsContainer';

const DailyLogsType = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('bg-white w-fit px-1 flex items-center justify-center text-md text-nowrap', className)} {...props} />);
DailyLogsType.displayName = 'DailyLogsType';

const DailyLogsTime = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('bg-white w-full text-nowrap flex items-center justify-center text-md', className)} {...props} />);
DailyLogsTime.displayName = 'DailyLogsTime';

const DailyLogsLine = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('h-6 w-[1px] bg-black mx-0.5', className)} {...props} />);
DailyLogsLine.displayName = 'DailyLogsLine';
export {DailyLogsContainer, DailyLogsType, DailyLogsTime, DailyLogsLine};
