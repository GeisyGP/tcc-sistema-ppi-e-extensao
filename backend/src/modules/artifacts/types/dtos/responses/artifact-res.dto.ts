import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class ArtifactResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiPropertyOptional()
    fileName: string

    @ApiPropertyOptional()
    mimeType: string

    @ApiPropertyOptional()
    size: number

    @ApiProperty()
    createdBy: string

    @ApiProperty()
    updatedBy: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date

    @ApiPropertyOptional({ type: randomUUID })
    groupId?: string | null

    @ApiProperty({ type: randomUUID })
    projectId: string | null

    @ApiProperty({ type: randomUUID })
    deliverableId: string | null
}
