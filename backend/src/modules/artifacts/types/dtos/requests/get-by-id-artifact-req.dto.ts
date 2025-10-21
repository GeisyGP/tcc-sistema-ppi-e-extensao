import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class GetByIdArtifactReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
