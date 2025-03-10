import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Queue, QueueEvents } from 'bullmq';

@Module({
  providers: [
    TransactionsService,
    {
      provide: QueueEvents,
      useFactory: () => {
        const queue = new Queue('transactionQueue');
        return new QueueEvents(queue.name);
      }
    },
  ],
  controllers: [TransactionsController],
  imports: [PrismaModule],
})
export class TransactionsModule { }
