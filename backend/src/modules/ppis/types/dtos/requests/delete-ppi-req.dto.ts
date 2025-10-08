import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class DeletePPIReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
