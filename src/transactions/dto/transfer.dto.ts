import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class TransferDto {
    @IsInt()
    @IsNotEmpty({ message: 'Origem é obrigatório' })
    @ApiProperty()
    senderId: string;

    @IsInt()
    @IsNotEmpty({ message: 'Destino é obrigatório' })
    @ApiProperty()
    receiverId: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01, { message: 'Valor mínimo é 0,01' })
    @ApiProperty()
    amount: number;
}