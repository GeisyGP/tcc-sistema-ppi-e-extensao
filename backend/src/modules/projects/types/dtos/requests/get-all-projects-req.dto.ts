import { ApiPropertyOptional } from "@nestjs/swagger"
import { ProjectStatus } from "@prisma/client"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllProjectsReqDto extends PaginationReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ppiId?: string

    @ApiPropertyOptional({ enum: ProjectStatus })
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    executionPeriod?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    class?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    theme?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    studentId?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    teacherId?: string
}
