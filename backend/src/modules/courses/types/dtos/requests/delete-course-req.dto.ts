import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class DeleteCourseReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
