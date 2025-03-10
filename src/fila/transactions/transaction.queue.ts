import { Queue } from 'bullmq';

export const transactionQueue = new Queue('transactions', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
});
