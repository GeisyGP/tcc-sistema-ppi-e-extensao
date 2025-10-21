import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class DeleteDeliverableReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
