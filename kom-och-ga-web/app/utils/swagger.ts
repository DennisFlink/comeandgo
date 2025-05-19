import swaggerJsdoc from 'swagger-jsdoc';

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Remix API',
         version: '1.0.0',
         description: 'API documentation for Remix app',
      },
      servers: [
         {
            url: 'http://localhost:5173',
            description: 'Local Development Server',
         },
      ],
   },
   apis: ['./app/routes/api.*.tsx'],
};

export const swaggerSpec = swaggerJsdoc(options);
