import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsString } from "class-validator"
import { IsAfterStartDate } from "src/common/utils/date-validator.util"

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
    @Type(() => Date)
    @IsNotEmpty()
    startDate: Date

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    @IsAfterStartDate()
    endDate: Date
}
