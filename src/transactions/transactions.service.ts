import { BadRequestException, Injectable } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { transactionQueue } from 'src/fila/transactions/transaction.queue';
import { QueueEvents } from 'bullmq';
import { TransferDto } from './dto/transfer.dto';
import * as ExcelJS from 'exceljs';

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
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planilha de transações');

        worksheet.columns = [
            { header: 'Tipo', key: 'type', width: 15 },
            { header: 'ID do Sender', key: 'senderId', width: 15 },
            { header: 'Nome do Sender', key: 'senderName', width: 30 },
            { header: 'ID do Recipient', key: 'recipientId', width: 15 },
            { header: 'Nome do Recipient', key: 'recipientName', width: 30 },
            { header: 'Valor', key: 'amount', width: 15 },
            { header: 'Status', key: 'status', width: 15 },
        ];

        const transactions = await this.prisma.transactions.findMany({
            where: {
                senderUserId: userId
            }
            ,
            include: {
                senderUser: true,
                recipientUser: true,
            },
        });

        transactions.forEach(transaction => {
            worksheet.addRow({
                type: transaction.type,
                senderId: transaction.senderUser.id,
                senderName: transaction.senderUser.name,
                recipientId: transaction?.recipientUser?.id,
                recipientName: transaction?.recipientUser?.name,
                amount: transaction.amount,
                status: transaction.status,
            });
        });

        // return await workbook.xlsx.writeFile('transactions.xlsx');

        return transactions;
    }
}
