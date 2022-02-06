/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import dotenv from 'dotenv';

import app from './app';

process.on('uncaughtException', (uncaughtExc) => {
  // Won't execute
  console.log(chalk.bgRed('UNCAUGHT EXCEPTION! Shutting down...'));
  console.log('uncaughtException Err::', uncaughtExc);
  console.log('uncaughtException Stack::', JSON.stringify(uncaughtExc.stack));
  process.exit(1);
});

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = () => {
  dotenv.config({ path: '.env' });

  const port = process.env.PORT_SERVER || 8080;

  app.use((err: Error, req: Request, _res: Response, _next: NextFunction) => {
    console.error('app error', err.stack);
    console.error('on url', req.url);
    console.error('with headers', req.headers);
  });

  const server = app.listen(port, () => {
    const envMode =
      process.env.NODE_ENV === 'development'
        ? chalk.bgGreen(process.env.NODE_ENV)
        : chalk.bgRed(process.env.NODE_ENV);

    console.log(`Using ${envMode} env`);
    console.log(`App running on port ${chalk.greenBright(port)}...`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    console.log(chalk.bgRed('UNHANDLED REJECTION! Shutting down...'));
    console.log(err.name, err.message);
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('Process terminated!');
    });
  });
};

setUpExpress();
