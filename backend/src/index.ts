import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';
import userRoutes from './routes/userRoute';
import { AppDataSource } from './config/dataSource';
import 'reflect-metadata';

const app: Application = express();
const PORT = 5000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');

    app.use(express.json());
    app.use('/api/users', userRoutes);

    // Documentation Swagger
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => console.log('Database connection error: ', error));
