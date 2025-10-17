import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class UpdateProjectContentReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    theme: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    scope: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    justification: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    generalObjective: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    specificObjectives: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    subjectsContributions: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    methodology: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    timeline: string
}
