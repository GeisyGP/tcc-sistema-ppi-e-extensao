import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { IsAfterStartDate } from "src/common/utils/date-validator.util"
import { removeTimezoneOffset } from "src/modules/deliverable/utils/timezone.util"

export class UpdateDeliverableReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Transform(removeTimezoneOffset)
    startDate: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Transform(removeTimezoneOffset)
    @IsAfterStartDate()
    endDate: Date
}
