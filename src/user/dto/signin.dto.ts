import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty({ message: 'Email é obrigatório' })
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Senha é obrigatório' })
    @ApiProperty()
    password: string;
}