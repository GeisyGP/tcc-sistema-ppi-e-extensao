import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, Max } from "class-validator"

export class PaginationReqDto {
    @ApiPropertyOptional()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page: number = 1

    @ApiPropertyOptional()
    @IsNumber()
    @IsPositive()
    @Max(30)
    @IsOptional()
    @Type(() => Number)
    limit: number = 30
}
