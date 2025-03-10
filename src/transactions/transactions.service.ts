import { BadRequestException, Injectable } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { transactionQueue } from 'src/fila/transactions/transaction.queue';
import { QueueEvents } from 'bullmq';
import { TransferDto } from './dto/transfer.dto';

@Injectable()
export class TransactionsService {
    constructor(
        private prisma: PrismaService,
        private readonly queueEvents: QueueEvents
    ) { }

    async deposit(data: DepositDto) {
        await transactionQueue.add('processTransaction', {
            type: 'deposit',
            amount: data.amount,
            userId: data.senderId
        });

        return "Depósito será realizado em breve!"
    }

    async withdraw(data: DepositDto) {
        await transactionQueue.add('processTransaction', {
            type: 'withdraw',
            amount: data.amount,
            userId: data.senderId
        });

        return "Saque será realizado em breve!"
    }

    async transfer(data: TransferDto) {
        await transactionQueue.add('processTransaction', {
            type: 'transfer',
            amount: data.amount,
            userId: data.senderId,
            targetUserId: data.receiverId
        });

        return "Transferência será realizada em breve!"
    }

    async report(userId: number) {
        const transactions = await this.prisma.transactions.findMany({
            where: {
                OR: [
                    { senderUserId: userId }
                ]
            }
        });

        return transactions;
    }
}
