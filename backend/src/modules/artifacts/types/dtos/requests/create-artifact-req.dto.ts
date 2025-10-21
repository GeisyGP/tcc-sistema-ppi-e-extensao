import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateArtifactProjectReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string
}

export class CreateArtifactProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string
}

export class CreateArtifactDeliverableReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    groupId: string
}

export class CreateArtifactDeliverableParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    deliverableId: string
}
