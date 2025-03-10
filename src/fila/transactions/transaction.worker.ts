import { BadRequestException } from '@nestjs/common';
import { Worker } from 'bullmq';
import { PrismaService } from 'src/prisma/prisma.service';

const redisConnection = {
	host: process.env.REDIS_HOST || 'localhost',
	port: Number(process.env.REDIS_PORT) || 6379,
	password: process.env.REDIS_PASSWORD,
};

export const transactionWorker = new Worker(
	'transactions',
	async (job) => {
		const { type, amount, userId, targetUserId } = job.data;
		console.log(`Processando ${type} de R$${amount} para o usuário ${userId}`);
		const prisma = new PrismaService();

		if (type === 'deposit') {
			try {
				const user = await prisma.users.findFirst({ where: { id: userId } });

				if (!user) {
					console.log('Conta do usuário não encontrado');

					await prisma.transactions.create({
						data: {
							type: 'deposit',
							senderUserId: userId,
							amount: amount,
							status: 'failed',
							error: 'Conta do usuário não encontrado'
						},
					});

					return;
				}

				await prisma.users.update({
					where: { id: userId },
					data: {
						balance: { increment: amount }
					}
				});

				await prisma.transactions.create({
					data: {
						type: 'deposit',
						senderUserId: user.id,
						amount: amount,
						status: 'success',
					},
				});

				console.log('Depósito processado!');
			}
			catch (error) {
				console.error('Erro ao processar depósito:', error);
			}
		} else if (type === 'withdraw') {
			try {
				const user = await prisma.users.findFirst({ where: { id: userId } });

				if (!user) {
					console.log('Conta do usuário não encontrado');

					await prisma.transactions.create({
						data: {
							type: 'deposit',
							senderUserId: userId,
							amount: amount,
							status: 'failed',
							error: 'Conta do usuário não encontrado'
						},
					});

					return;
				}

				if (user.balance < amount) {
					console.log('Saldo insuficiente');

					await prisma.transactions.create({
						data: {
							type: 'deposit',
							senderUserId: userId,
							amount: amount,
							status: 'failed',
							error: 'Saldo insuficiente'
						},
					});

					return;
				}

				await prisma.users.update({
					where: { id: user.id },
					data: {
						balance: { decrement: amount }
					}
				});

				await prisma.transactions.create({
					data: {
						type: 'withdraw',
						senderUserId: user.id,
						amount: amount,
						status: 'success',
					},
				});

				return { status: 'success', message: 'Saque realizado com sucesso!' };
			} catch (error) {
				console.error('Erro ao processar saque:', error);
				return {
					status: 'error', message: error.message
				}
			}
		} else if (type === 'transfer' && targetUserId) {
			const transaction = await prisma.$transaction(async (prisma) => {
				const sender = await prisma.users.findFirst({
					where: { id: userId },
				});

				if (!sender) {
					console.log('Conta do remetente não encontrada');

					await prisma.transactions.create({
						data: {
							type: 'transfer',
							senderUserId: userId,
							amount: amount,
							status: 'failed',
							error: 'Conta do usuário remetente não encontrado',
							recipientUserId: targetUserId,
						},
					});

					return;
				}

				const recipient = await prisma.users.findFirst({
					where: { id: targetUserId },
				});

				if (!recipient) {
					console.log('Conta do destinatario não encontrada');

					await prisma.transactions.create({
						data: {
							type: 'transfer',
							senderUserId: userId,
							amount: amount,
							status: 'failed',
							error: 'Conta do usuário destinatario não encontrado',
							recipientUserId: targetUserId,
						},
					});

					return;
				}

				if (sender.balance < amount) {
					console.log('Saldo insuficiente');

					await prisma.transactions.create({
						data: {
							type: 'transfer',
							senderUserId: userId,
							amount: amount,
							status: 'failed',
							error: 'Saldo insuficiente',
							recipientUserId: targetUserId,
						},
					});

					return;
				}

				await prisma.users.update({
					where: { id: sender.id },
					data: { balance: { decrement: amount } },
				});

				await prisma.users.update({
					where: { id: recipient.id },
					data: { balance: { increment: amount } },
				});

				await prisma.transactions.create({
					data: {
						type: 'transfer',
						senderUserId: sender.id,
						recipientUserId: recipient.id,
						amount: amount,
						status: 'success',
					},
				});

				return 'Transferência realizada com sucesso';
			});

			return transaction;
		}

		return { status: 'error', message: 'Tipo de transação inválido' };
	},
	{
		connection: redisConnection,
	},
);

transactionWorker.on('completed', (job) => {
	console.log(`Transação do job ${job.id} concluída!`);
});

transactionWorker.on('failed', (job, err) => {
	console.log(`Job ${job?.id} falhou: ${err.message}`);
});
