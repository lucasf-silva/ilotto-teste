import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

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
}
