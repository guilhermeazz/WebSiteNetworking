import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import userRoutes from './routes/user.routes';
import projectGroupRoutes from './routes/projectGroup.routes';
import recommendationRoutes from './routes/recomendationUser.routes';
import followRoutes from './routes/follow.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas principais
app.use('/users', userRoutes);
app.use('/groups', projectGroupRoutes);
app.use('/users', recommendationRoutes);
app.use('/users', followRoutes);
app.use('/auth', authRoutes);

export default app;
