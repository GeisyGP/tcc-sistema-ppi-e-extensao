import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

export class GetByIdReqDto {
    @ApiProperty()
    @IsString()
    @IsUUID()
    id: string
}
