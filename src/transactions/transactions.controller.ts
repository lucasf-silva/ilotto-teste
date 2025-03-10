import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/base/auth.constants';
import { TransferDto } from './dto/transfer.dto';

export interface UserReq {
    sub: number;
    email: string;
}

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @Post('deposit')
    @ApiOperation({ summary: 'Realizar depósito na conta' })
    async deposit(
        @Body() data: DepositDto,
        @Req() req: Request
    ) {
        const user: UserReq = req[REQUEST_TOKEN_PAYLOAD_NAME];

        data.senderId = user.sub;

        return this.transactionService.deposit(data);
    }

    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @Put('withdraw')
    @ApiOperation({ summary: 'Realizar saques na conta' })
    async withdraw(
        @Body() data: DepositDto,
        @Req() req: Request
    ) {
        const user: UserReq = req[REQUEST_TOKEN_PAYLOAD_NAME];

        data.senderId = user.sub;

        return this.transactionService.withdraw(data);
    }

    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @Post('transfer')
    @ApiOperation({ summary: 'Realizar transferência entre contas' })
    async transfer(
        @Body() data: TransferDto,
        @Req() req: Request
    ) {
        const user: UserReq = req[REQUEST_TOKEN_PAYLOAD_NAME];

        data.senderId = user.sub;

        return this.transactionService.transfer(data);
    }

    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @Get('report')
    @ApiOperation({ summary: 'Gerar relatório de transações' })
    async report(
        @Req() req: Request
    ) {
        const user: UserReq = req[REQUEST_TOKEN_PAYLOAD_NAME];

        return this.transactionService.report(user.sub);
    }
}
