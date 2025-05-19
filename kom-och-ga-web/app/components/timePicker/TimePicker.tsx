import {zodResolver} from '@hookform/resolvers/zod';
import {useEffect, useRef, useState} from 'react';
import {set, useForm} from 'react-hook-form';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form/Form';
import {date, z} from 'zod';

import {Input} from '../ui/input/Input';
import {Button} from '../ui/button/button';
import {Form as RemixForm, useActionData, useFetcher, useRevalidator} from '@remix-run/react';
import {Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogFooter, DialogHeader} from '@/components/ui/dialog/Dialog';

type TimePickerProps = {day: string; month: string; open: boolean; onOpenChange: () => void; stamp?: SingleStamp; dayId?: number; dayLabel?: string};
type SingleStamp = {id?: number; label?: string; time?: string};

const FormSchema = z.object({
   times: z.coerce.string({
      required_error: 'Date & time is required!.',
   }),
});
export const TimePicker = ({day, month, open, onOpenChange, stamp, dayId, dayLabel}: TimePickerProps) => {
   const fetcher = useFetcher<{success?: boolean}>();
   const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
   const [time, setTime] = useState<string>('');
   const stampLabel = stamp?.label ?? dayLabel;
   const isNew = !stamp?.id;

   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         times: time,
      },
   });

   useEffect(() => {
      if (open) {
         setHasHandledSuccess(false);
         form.setValue('times', stamp?.time ?? '');
      }
   }, [open, stamp, form]);

   useEffect(() => {
      if (fetcher.data?.success === true && !hasHandledSuccess) {
         onOpenChange();
         form.reset();
         setHasHandledSuccess(true);
      }
   }, [open, stamp, setHasHandledSuccess]);

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="w-full max-w-2xl p-4">
            <DialogHeader className="flex flex-col gap-4"></DialogHeader>
            <DialogTitle className="text-lg font-semibold flex gap-1">
               <span>{day}</span>
               <span>{month}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-700">Redigera vald stämpling.</DialogDescription>
            <Form {...form}>
               <fetcher.Form method="post">
                  <input type="hidden" name="id" value={stamp?.id ?? ''} />
                  <input type="hidden" name="workDayId" value={dayId} />
                  <input type="hidden" name="type" value={stampLabel} />
                  <FormField
                     control={form.control}
                     name="times"
                     render={({field}) => (
                        <FormItem className="flex flex-col justify-center items-center gap-2">
                           <FormLabel>Stämpling</FormLabel>
                           <FormLabel>{stampLabel}</FormLabel>
                           <FormControl className="flex justify-center items-center gap-2 w-fit">
                              <Input type="time" min="09:00" max="23:00" {...field} />
                           </FormControl>
                        </FormItem>
                     )}
                  />
                  <div className="flex flex-row gap-4 justify-between w-full mt-4 pt-6">
                     {isNew ? (
                        <Button name="_action" value="add" type="submit" className="w-full" disabled={!form.formState.isDirty}>
                           Lägg till
                        </Button>
                     ) : (
                        <>
                           <Button name="_action" value="delete" type="submit" variant="destructive" className="w-full">
                              Ta bort
                           </Button>
                           <Button type="submit" className="w-full" disabled={!form.formState.isDirty}>
                              Spara
                           </Button>
                        </>
                     )}
                  </div>
               </fetcher.Form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default TimePicker;
