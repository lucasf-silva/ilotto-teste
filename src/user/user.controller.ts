import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@ApiTags('Users')
@Controller('Auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async singUp(@Body() body: SignUpDto) {
        return this.userService.register(body);
    }

    @Post('signin')
    async singIn(@Body() body: SignInDto) {
        return this.userService.login(body);
    }
}
