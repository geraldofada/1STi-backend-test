import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import routes from './routes';

// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// const swaggerOptions = require('../config/swagger');

dotenv.config();

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(routes);

export default app;
