import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"
import { PPISubjectResDto } from "src/modules/ppis/types/dtos/responses/ppi-res.dto"

export class ProjectOverviewResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    technologicalAxis: string

    @ApiProperty()
    courseName: string

    @ApiProperty()
    educationLevel: string

    @ApiProperty()
    degree: string

    @ApiProperty()
    modality: string

    @ApiProperty()
    executionPeriod: string

    @ApiProperty()
    ppiClassPeriod: string

    @ApiProperty()
    workload: number

    @ApiProperty()
    shift: string

    @ApiProperty()
    class: string

    @ApiProperty()
    campusDirector: string

    @ApiProperty()
    academicDirector: string

    @ApiProperty()
    subjects: Array<PPISubjectResDto>
}
