import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
    constructor(
        private prisma: PrismaService,
    ) { }

    @Cron('5 6 * * *')
    async handleCron() {
        console.log('Gerando relatório...');

        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0)); 
            const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999))

            const transactions = await this.prisma.transactions.findMany({
                where: {
                    timestamp: {
                        gte: startOfDay, 
                        lte: endOfDay,  
                    },
                },
            });
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
        }

        console.log('Relatório gerado com sucesso!');
    }
}
