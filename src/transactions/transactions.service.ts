import { BadRequestException, Injectable } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService) { }

    async deposit(data: DepositDto) {
        const user = await this.prisma.users.findFirst({ where: { id: data.senderId } });

        if (!user) {
            throw new BadRequestException('Conta do usuário não encontrado');
        }

        const updatedUser = await this.prisma.users.update({
            where: { id: data.senderId },
            data: {
                balance: user.balance + data.amount
            }
        });

        await this.prisma.transactions.create({
            data: {
                type: 'deposit',
                senderUserId: user.id,
                amount: data.amount,
              },
        });

        return "Depósito realizado com sucesso"
    }

    async withdraw(data: DepositDto) {
        const user = await this.prisma.users.findFirst({ where: { id: data.senderId } });

        if (!user) {
            throw new BadRequestException('Conta do usuário não encontrado');
        }

        if (user.balance < data.amount) {
            throw new BadRequestException('Saldo insuficiente');
        }

        const updatedUser = await this.prisma.users.update({
            where: { id: data.senderId },
            data: {
                balance: user.balance - data.amount
            }
        });

        await this.prisma.transactions.create({
            data: {
                type: 'withdraw',
                senderUserId: user.id,
                amount: data.amount,
              },
        });

        return "Saque realizado com sucesso"
    }
}
