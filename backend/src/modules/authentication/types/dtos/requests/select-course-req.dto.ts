import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class SelectCourseReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    courseId: string
}
