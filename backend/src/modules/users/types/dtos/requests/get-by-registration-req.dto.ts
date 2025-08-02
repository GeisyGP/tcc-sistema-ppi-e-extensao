import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class GetByRegistrationReqDto {
    @ApiProperty()
    @IsString()
    registration: string
}
