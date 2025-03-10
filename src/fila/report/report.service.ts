import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
    constructor(
        private prisma: PrismaService,
    ) { }

    @Cron('5 6 * * *')
    async handleCron() {
        console.log('Gerando relatório...');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planilha de transações');

        try {
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
            return;
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        }

        console.log('Relatório gerado com sucesso!');
    }
}
