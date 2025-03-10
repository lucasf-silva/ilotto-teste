import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty({ message: 'Nome é obrigatório' })
    @ApiProperty()
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Email é obrigatório' })
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'Senha é obrigatório' })
    @ApiProperty()
    password: string;
}