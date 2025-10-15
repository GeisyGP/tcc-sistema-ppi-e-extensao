import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty } from "class-validator"

export class ChangeVisibilityReqDto {
    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    visibleToAll: boolean
}
