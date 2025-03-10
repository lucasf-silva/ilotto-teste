import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [TransactionsService],
  controllers: [TransactionsController],
  imports: [PrismaModule],
})
export class TransactionsModule {}
