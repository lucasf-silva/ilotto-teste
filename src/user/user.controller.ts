import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { UserReq } from 'src/transactions/transactions.controller';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/base/auth.constants';

@ApiTags('Users')
@Controller('Auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @ApiOperation({ summary: 'Criar um conta' })
    async singUp(@Body() body: SignUpDto) {
        return this.userService.register(body);
    }

    @Post('signin')
    @ApiOperation({ summary: 'Entrar no sistema' })
    async singIn(@Body() body: SignInDto) {
        return this.userService.login(body);
    }

    @Post('seed')
    @ApiOperation({ summary: 'Apenas envie para o banco para popular o mesmo' })
    async seedUsers() {
        return this.userService.seedUsers();
    }

    @Get('accont')
    @ApiOperation({ summary: 'Verificar dados da conta' })
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    async account(
        @Req() req: Request
    ) {
        const user: UserReq = req[REQUEST_TOKEN_PAYLOAD_NAME];

        const id = user.sub;

        if (!id) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        return this.userService.account(id);
    }

    @Get('getall')
    @ApiOperation({ summary: 'Verificar todas as contas(apenas ambiente de testes)' })
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
}
