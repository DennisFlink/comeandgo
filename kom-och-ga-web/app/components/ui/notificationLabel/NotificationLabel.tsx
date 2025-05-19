import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../../../lib/utils';

const notificationLabelVariant = cva('relative w-full  px-2 py-3 text-sm  ', {
   variants: {
      variant: {
         default: 'bg-alert-yellow text-black',
         destructive: 'bg-alert-red text-white text-nowrap',
      },
   },
   defaultVariants: {
      variant: 'default',
   },
});
const NotificationContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('flex ', className)} {...props} />);
NotificationContainer.displayName = 'NotificationContainer';

const NotificationLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof notificationLabelVariant>>(({className, variant, ...props}, ref) => <div ref={ref} role="alert" className={cn(notificationLabelVariant({variant}), className)} {...props} />);
NotificationLabel.displayName = 'NotificationLabel';

const NotificationIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({className, ...props}, ref) => <div ref={ref} className={cn('bg-alert-icon-yellow min-w-12 flex items-center justify-center', className)} {...props} />);
NotificationIcon.displayName = 'NotificationIcon';

export {NotificationLabel, NotificationIcon, NotificationContainer};
