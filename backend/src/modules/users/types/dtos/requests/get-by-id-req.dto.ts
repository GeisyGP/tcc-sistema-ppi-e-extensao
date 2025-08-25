import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

export class GetUserByIdReqDto {
    @ApiProperty()
    @IsString()
    @IsUUID()
    id: string
}
