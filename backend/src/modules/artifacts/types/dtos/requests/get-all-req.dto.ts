import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllArtifactReqDto extends PaginationReqDto {}

export class GetAllArtifactByProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string
}

export class GetAllArtifactByGroupParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    groupId: string
}
