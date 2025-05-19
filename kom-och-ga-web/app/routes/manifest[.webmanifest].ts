import type {WebAppManifest} from '@remix-pwa/dev';
import {json} from '@remix-run/node';

export const loader = () => {
   return json(
      {
         short_name: 'Kom&Gå',
         name: 'Kom och Gå',
         start_url: '/',
         id: '/',
         display: 'standalone',
         background_color: '#ffffff',
         theme_color: 'hsl(200, 18%, 26%)',
         icons: [
            {
               src: 'https://www.vgregion.se/images/favicons/favicon-180.png',
               sizes: '180x180',
               type: 'image/png',
            },
            {
               src: '/apple-touch-icon-120x120.png',
               sizes: '120x120',
               type: 'image/png',
            },
            {
               src: '/apple-touch-icon-120x120-precomposed.png',
               sizes: '120x120',
               type: 'image/png',
            },
            {
               src: '/apple-touch-icon-180x180.png',
               sizes: '180x180',
               type: 'image/png',
            },
            {
               src: '/web-app-manifest-192x192.png',
               sizes: '192x192',
               type: 'image/png',
            },
            {
               src: '/web-app-manifest-512x512.png',
               sizes: '512x512',
               type: 'image/png',
            },
         ],
         description: 'Kom och Gå - En app för att hantera din arbetstid',
      } as WebAppManifest,
      {
         headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Content-Type': 'application/manifest+json',
         },
      }
   );
};
