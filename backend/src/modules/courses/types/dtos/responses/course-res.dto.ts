import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class CourseResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    technologicalAxis: string

    @ApiProperty()
    educationLevel: string

    @ApiProperty()
    degree: string

    @ApiProperty()
    modality: string

    @ApiProperty()
    shift: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
