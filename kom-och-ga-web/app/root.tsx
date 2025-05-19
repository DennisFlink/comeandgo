import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useMatches} from '@remix-run/react';
import {ManifestLink} from '@remix-pwa/sw';
import type {LinksFunction, LoaderFunction} from '@remix-run/node';

import './tailwind.css';
import Header from './components/header/Header';
import {getUserId} from './utils/reqAuth.server';
import DayHeader from './components/dayHeader/DayHeader';
import HeaderOrDayHeader from './components/composed/headerOrDayHeader/HeaderOrDayHeader';

export const links: LinksFunction = () => [
   {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
   {
      rel: 'icon',
      href: 'https://www.vgregion.se/images/favicons/favicon-180.png',
      type: 'image/png',
   },
   {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
   },
   {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
   },
   {rel: 'manifest', href: '/manifest.webmanifest', crossOrigin: 'use-credentials'},
];
export const loader: LoaderFunction = async ({request}) => {
   const userId = await getUserId(request);
   return {userId};
};

export function Layout({children}: {children: React.ReactNode}) {
   return (
      <html lang="en">
         <head>
            <meta charSet="utf-8" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-title" content="Kom&Gå" />
            <meta name="mobile-web-app-status-bar-style" content="default"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {/*     <link rel="manifest" href="/manifest.json" /> */}
            <Links />
         </head>
         <body>
            <HeaderOrDayHeader />
            {children}

            <ScrollRestoration />
            <Scripts />
         </body>
      </html>
   );
}

export default function App() {
   return <Outlet />;
}
