import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export enum DeliverableStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    UPCOMING = "UPCOMING",
}

export class GetAllDeliverableReqDto extends PaginationReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    groupId?: string

    @ApiPropertyOptional({ enum: DeliverableStatus, isArray: true })
    @IsArray()
    @IsEnum(DeliverableStatus, { each: true })
    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    status?: DeliverableStatus[]
}

export class GetAllByProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string
}
