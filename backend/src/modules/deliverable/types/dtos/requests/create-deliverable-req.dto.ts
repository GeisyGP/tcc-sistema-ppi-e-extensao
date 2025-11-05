import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsOptional, IsString, MinDate } from "class-validator"
import { IsAfterStartDate } from "src/common/utils/date-validator.util"
import { removeTimezoneOffset } from "src/modules/deliverable/utils/timezone.util"

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
    @IsNotEmpty()
    @Transform(removeTimezoneOffset)
    @MinDate(new Date())
    startDate: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Transform(removeTimezoneOffset)
    @IsAfterStartDate()
    endDate: Date

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    subjectId?: string
}
