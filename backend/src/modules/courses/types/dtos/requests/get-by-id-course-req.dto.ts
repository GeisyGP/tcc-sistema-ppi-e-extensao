import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class GetByIdCourseReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
