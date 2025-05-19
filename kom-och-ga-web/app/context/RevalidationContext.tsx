import {createContext, ReactNode, useContext, useState} from 'react';
type RevalidationContextType = {
   revalidate: () => void;
   revalidationTrigger: boolean;
};

export const RevalidationContext = createContext<RevalidationContextType | undefined>(undefined);

const RevalidationProvider = ({children}: {children: ReactNode}) => {
   const [revalidationTrigger, setRevalidationTrigger] = useState(false);

   const revalidate = () => {
      setRevalidationTrigger((prev) => !prev);
   };

   return <RevalidationContext.Provider value={{revalidate, revalidationTrigger}}>{children}</RevalidationContext.Provider>;
};

const useRevalidation = () => {
   const context = useContext(RevalidationContext);
   if (!context) {
      throw new Error('useRevalidation must be used within a RevalidationProvider');
   }
   return context;
};

export {RevalidationProvider, useRevalidation};
