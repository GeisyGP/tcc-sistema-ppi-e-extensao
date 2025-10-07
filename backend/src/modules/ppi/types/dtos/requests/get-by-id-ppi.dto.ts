import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class GetByIdPPIReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
