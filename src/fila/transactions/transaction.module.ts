import { Module, OnModuleInit } from '@nestjs/common';
import { transactionWorker } from './transaction.worker';

@Module({})
export class TransactionModule implements OnModuleInit {
  async onModuleInit() {
    console.log('Inicializando workers de transações...');
    transactionWorker;
  }
}
