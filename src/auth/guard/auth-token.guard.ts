import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import jwtConfig from "../config/jwt/jwt.config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "src/base/auth.constants";

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractToken(request);

        if (!token) {
            throw new UnauthorizedException('Token não encontrado ou inválido');
        }

        try {
            const payload = await this.jwtService?.verifyAsync(token, this.jwtConfiguration);

            request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
        } catch (error) {
            throw new UnauthorizedException('Token inválido');
        }

        return true;
    }

    extractToken(request: Request) {
        const authorization = request.headers?.authorization;

        if (!authorization || typeof authorization !== 'string') {
            return;
        }

        return authorization.split(' ')[1];
    }
}