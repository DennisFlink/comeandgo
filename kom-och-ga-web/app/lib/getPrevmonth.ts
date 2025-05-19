export const getPrevMonth = async (month: number, year: number) => {
   if (month === 1) {
      return {month: 12, year: year - 1};
   }
   return {month: month - 1, year};
};
