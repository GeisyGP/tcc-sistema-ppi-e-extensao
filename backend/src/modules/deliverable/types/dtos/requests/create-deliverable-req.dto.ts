import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { IsAfterStartDate, IsFutureDate } from "src/common/utils/date-validator.util"
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
    @IsNotEmpty()
    @Transform(removeTimezoneOffset)
    @IsFutureDate()
    startDate: Date

    @ApiProperty()
    @IsNotEmpty()
    @Transform(removeTimezoneOffset)
    @IsAfterStartDate()
    endDate: Date

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    subjectId?: string
}
