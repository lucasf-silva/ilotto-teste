import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import jwtConfig from 'src/auth/config/jwt/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) { }

  async register(data: SignUpDto) {
    const emailExisting = await this.prisma.users.findFirst({
      where: {
        email: data.email
      }
    })

    if (emailExisting) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await this.hashingService.hash(data.password);

    const newUser = await this.prisma.users.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return newUser.id;
  }

  async login(data: SignInDto) {
    const user = await this.prisma.users.findFirst({ where: { email: data.email } });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await this.hashingService.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl
      }
    );

    return {
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        token
      }
    };
  }
}
