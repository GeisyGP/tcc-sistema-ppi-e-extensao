import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { randomUUID } from "crypto"
import { ProjectStatus } from "src/common/enums/project-status.enum"

export class ProjectResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    class: string

    @ApiProperty()
    executionPeriod: string

    @ApiProperty()
    campusDirector: string

    @ApiProperty()
    academicDirector: string

    @ApiProperty({ enum: ProjectStatus })
    status: ProjectStatus

    @ApiProperty()
    theme: string

    @ApiProperty({ type: randomUUID })
    ppiId: string

    @ApiProperty()
    ppiClassPeriod: string

    @ApiProperty()
    createdBy: string

    @ApiProperty()
    updatedBy: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

export class ProjectFullResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    theme: string

    @ApiPropertyOptional()
    scope: string | null

    @ApiPropertyOptional()
    justification: string | null

    @ApiPropertyOptional()
    generalObjective: string | null

    @ApiPropertyOptional()
    specificObjectives: string | null

    @ApiPropertyOptional()
    subjectsContributions: string | null

    @ApiPropertyOptional()
    methodology: string | null

    @ApiPropertyOptional()
    timeline: string | null
}
