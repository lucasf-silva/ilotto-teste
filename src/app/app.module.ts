import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/user/user.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionModule } from 'src/fila/transactions/transaction.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportModule } from 'src/fila/report/report.module';

@Module({
    imports: [
        UserModule,
        TransactionsModule,
        AuthModule,
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
            },
        }),
        BullModule.registerQueue({
            name: 'transactions',
        }),
        ScheduleModule.forRoot(),
        TransactionModule,
        PrismaModule,
        ReportModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
