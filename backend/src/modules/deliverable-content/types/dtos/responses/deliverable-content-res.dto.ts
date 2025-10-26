import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class DeliverableContentResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiPropertyOptional()
    content: string

    @ApiProperty({ type: randomUUID })
    deliverableId: string

    @ApiProperty({ type: randomUUID })
    groupId: string

    @ApiProperty()
    createdBy: string

    @ApiProperty()
    updatedBy: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
