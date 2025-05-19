import {useLoaderData} from '@remix-run/react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import {swaggerSpec} from '../utils/swagger';

export const loader = async () => {
   return Response.json(swaggerSpec);
};

export default function ApiDocs() {
   const spec = useLoaderData<typeof loader>();

   return (
      <div>
         <h1>API Documentation</h1>
         <SwaggerUI spec={spec} />
      </div>
   );
}
