import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllDeliverableReqDto extends PaginationReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    groupId: string
}

export class GetAllByProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string
}
