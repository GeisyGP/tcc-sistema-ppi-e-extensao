import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllDeliverableReqDto extends PaginationReqDto {}

export class GetAllByProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string
}
