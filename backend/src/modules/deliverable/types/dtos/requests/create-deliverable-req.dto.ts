import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString, MinDate } from "class-validator"
import { IsAfterStartDate } from "src/common/utils/date-validator.util"

export class CreateDeliverableReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    @IsNotEmpty()
    @MinDate(new Date())
    startDate: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @IsAfterStartDate()
    endDate: Date

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    subjectId?: string
}
