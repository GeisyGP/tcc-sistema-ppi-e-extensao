import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllCoursesReqDto extends PaginationReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string
}
