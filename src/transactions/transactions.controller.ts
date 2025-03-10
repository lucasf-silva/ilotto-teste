import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/base/auth.constants';

export interface UserReq {
    id: number;
    email: string;
}

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @Post('deposit')
    @ApiOperation({ summary: 'Realizar depósito na conta' })
    async deposit(@Body() data: DepositDto) {


        return this.transactionService.deposit(data);
    }

    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @Post('withdraw')
    @ApiOperation({ summary: 'Realizar saques na conta' })
    async withdraw(
        @Body() data: DepositDto,
        @Req() req: Request
    ) {

        console.log(req[REQUEST_TOKEN_PAYLOAD_NAME]);
        const user: UserReq = req[REQUEST_TOKEN_PAYLOAD_NAME];
        return 'use'
    }
}
