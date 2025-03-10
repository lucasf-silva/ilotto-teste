import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class DepositDto {
    senderId: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0.01, { message: 'Valor mínimo é 0,01' })
    @ApiProperty()
    amount: number;
}