import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import userRoutes from './routes/user.routes';
import projectGroupRoutes from './routes/projectGroup.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger Config
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ConnectDev API',
      version: '1.0.0',
      description: 'API para conectar desenvolvedores e formar grupos com base em habilidades'
    }
  },
  apis: ['src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use('/users', userRoutes);
app.use('/groups', projectGroupRoutes);

export default app;
