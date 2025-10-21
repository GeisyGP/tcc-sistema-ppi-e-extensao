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

    @ApiProperty()
    createdBy: string

    @ApiProperty()
    updatedBy: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
