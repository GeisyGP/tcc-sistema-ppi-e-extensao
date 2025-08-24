import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class GetByIdSubjectReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
