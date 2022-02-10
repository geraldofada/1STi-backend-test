import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['error', 'info', 'query', 'warn']
      : ['info'],
  errorFormat: 'minimal',
});

export default prismaClient;
