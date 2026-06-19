import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Biblioteca Universitaria',
      version: '1.0.0',
      description: 'API REST para gestión de biblioteca',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/modules/**/*.http'],
};

export default swaggerJsdoc(options);
