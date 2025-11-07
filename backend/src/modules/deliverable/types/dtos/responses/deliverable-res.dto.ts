import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class DeliverableResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiPropertyOptional()
    description: string | null

    @ApiProperty()
    startDate: Date

    @ApiProperty()
    endDate: Date

    @ApiProperty({ type: randomUUID })
    projectId: string

    @ApiProperty({ type: randomUUID })
    subjectId: string | null

    @ApiProperty()
    createdBy: string

    @ApiProperty()
    updatedBy: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

export class DeliverableWithContentAndArtifactResDto extends DeliverableResDto {
    @ApiProperty()
    artifact: DeliverableArtifact[]

    @ApiProperty()
    content: DeliverableContent[]

    @ApiPropertyOptional()
    subjectName?: string

    @ApiPropertyOptional()
    canUserManage?: boolean
}

class DeliverableContent {
    @ApiProperty()
    id: string

    @ApiProperty()
    content: string

    @ApiProperty()
    groupId: string
}

class DeliverableArtifact {
    @ApiProperty()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    groupId: string | null
}
