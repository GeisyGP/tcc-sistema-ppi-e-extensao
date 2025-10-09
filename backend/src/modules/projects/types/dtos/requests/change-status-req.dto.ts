import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty } from "class-validator"
import { ProjectStatus } from "src/common/enums/project-status.enum"

export class ChangeStatusReqDto {
    @ApiProperty({ enum: ProjectStatus })
    @IsEnum(ProjectStatus)
    @IsNotEmpty()
    status: ProjectStatus
}
