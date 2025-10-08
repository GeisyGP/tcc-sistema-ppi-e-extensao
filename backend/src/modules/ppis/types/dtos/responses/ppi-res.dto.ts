import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class PPIResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    classPeriod: string

    @ApiProperty()
    workload: number

    @ApiProperty()
    subjects: Array<PPISubjectResDto>

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

class PPISubjectResDto {
    @ApiProperty()
    id: string

    @ApiPropertyOptional()
    name?: string

    @ApiProperty()
    workload: number
}
