import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [JwtModule.registerAsync(jwtConfig.asProvider()), ConfigModule.forFeature(jwtConfig)],
    providers: [
        {
            provide: HashingServiceProtocol,
            useClass: BcryptService
        },
    ],
    exports: [HashingServiceProtocol, JwtModule, ConfigModule]
})
export class AuthModule { }
