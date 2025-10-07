import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { PPIWithSubjects } from "../repositories/ppi.repository.interface"
import { PPIResDto } from "../types/dtos/responses/ppi-res.dto"

export class PPIResBuilder {
    static build(ppi: PPIWithSubjects): PPIResDto {
        return {
            id: ppi.id,
            classPeriod: ppi.classPeriod,
            workload: ppi.workload,
            subjects: ppi.SubjectPPI.map((subject) => ({
                id: subject.subjectId,
                name: subject.subject?.name,
                workload: subject.workload,
            })),
            createdAt: ppi.createdAt,
            updatedAt: ppi.updatedAt,
        }
    }

    static buildMany(
        ppis: PPIWithSubjects[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<PPIResDto[]> {
        return {
            items: ppis.map((ppi) => this.build(ppi)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
