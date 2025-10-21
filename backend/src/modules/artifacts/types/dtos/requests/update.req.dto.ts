import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateByIdArtifactReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    deliverableId: string
}
