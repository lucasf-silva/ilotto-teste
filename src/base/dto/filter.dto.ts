import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class FilterBase {
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Min(0)
    @Max(50)
    limit: number;

    @IsInt()
    @Type(() => Number)
    @Min(0)
    @IsOptional()
    offset: number;
}