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

  async seedUsers() {
    const usersData = [
      {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "Password123!",
        balance: 1250.45,
        emailConfirmed: true,
        inative: false,
        createdAt: new Date("2024-03-01T10:00:00Z"),
      },
      {
        name: "Jane Smith",
        email: "janesmith@example.com",
        password: "Password456!",
        balance: 3345.89,
        emailConfirmed: false,
        inative: true,
        createdAt: new Date("2023-11-20T08:15:00Z"),
      },
      {
        name: "Alice Johnson",
        email: "alicej@example.com",
        password: "Alice@1234",
        balance: 4230.75,
        emailConfirmed: true,
        inative: false,
        createdAt: new Date("2024-01-15T12:30:00Z"),
      },
      {
        name: "Bob Brown",
        email: "bobbrown@example.com",
        password: "Bob12345!",
        balance: 5000.50,
        emailConfirmed: true,
        inative: false,
        createdAt: new Date("2023-12-05T14:45:00Z"),
      },
      {
        name: "Charlie Davis",
        email: "charlied@example.com",
        password: "Charlie@9876",
        balance: 1122.60,
        emailConfirmed: false,
        inative: true,
        createdAt: new Date("2024-02-10T09:00:00Z"),
      },
      {
        name: "David Wilson",
        email: "davidw@example.com",
        password: "David1234!",
        balance: 7999.99,
        emailConfirmed: true,
        inative: false,
        createdAt: new Date("2024-01-01T11:20:00Z"),
      },
      {
        name: "Eva Martinez",
        email: "evamartinez@example.com",
        password: "Eva@2024!",
        balance: 3200.80,
        emailConfirmed: false,
        inative: false,
        createdAt: new Date("2024-02-18T16:10:00Z"),
      },
      {
        name: "Frank Lopez",
        email: "frankl@example.com",
        password: "Frank@6789",
        balance: 1500.00,
        emailConfirmed: true,
        inative: false,
        createdAt: new Date("2023-12-30T17:35:00Z"),
      },
      {
        name: "Grace Taylor",
        email: "gracet@example.com",
        password: "Grace@123!",
        balance: 2300.60,
        emailConfirmed: true,
        inative: false,
        createdAt: new Date("2024-02-25T13:25:00Z"),
      },
      {
        name: "Henry Harris",
        email: "henryh@example.com",
        password: "Henry@2024",
        balance: 4000.00,
        emailConfirmed: false,
        inative: true,
        createdAt: new Date("2023-11-10T19:00:00Z"),
      }
    ];

    for (const user of usersData) {

      const hashedPassword = await this.hashingService.hash(user.password);
      await this.prisma.users.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });
      console.log(`Usuário ${user.name} inserido com sucesso!`);
    }

    return 'Inseridos com sucesso!';
  }

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
