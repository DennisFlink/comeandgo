import DayHeader from '@/components/dayHeader/DayHeader';
import Header from '@/components/header/Header';
import {loader} from '@/root';
import {useMatches, useLoaderData} from '@remix-run/react';
import React from 'react';

const HeaderOrDayHeader = (props) => {
   const matches = useMatches();
   const isDayRoute = matches.some((m) => m.id.includes('routes/tidrapport_.$day'));

   const data = useLoaderData<typeof loader>();
   const userId = data?.userId ?? null;

   return isDayRoute ? <DayHeader /> : <Header userId={userId} />;
};

export default HeaderOrDayHeader;
