import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class TransferDto {
    senderId: number;

    @IsInt()
    @IsNotEmpty({ message: 'Destino é obrigatório' })
    @ApiProperty()
    receiverId: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01, { message: 'Valor mínimo é 0,01' })
    @ApiProperty()
    amount: number;
}