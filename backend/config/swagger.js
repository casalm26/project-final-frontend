import swaggerJSDoc from 'swagger-jsdoc';
import { info } from './swagger/info.js';
import { servers } from './swagger/servers.js';
import { securitySchemes, security } from './swagger/security.js';
import { schemas } from './swagger/schemas/index.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info,
    servers,
    components: {
      securitySchemes,
      schemas
    },
    security
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJSDoc(options);

export default specs;