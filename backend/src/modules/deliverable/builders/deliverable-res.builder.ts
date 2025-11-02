import { Deliverable } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { DeliverableResDto, DeliverableWithContentAndArtifactResDto } from "../types/dtos/responses/deliverable-res.dto"
import { DeliverableWithContentAndArtifact } from "../repositories/deliverable.repository.interface"

export class DeliverableResBuilder {
    static build(data: Deliverable): DeliverableResDto {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            projectId: data.projectId,
            subjectId: data.subjectId,
            startDate: data.startDate,
            endDate: data.endDate,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }

    static buildWithContentAndArtifact(
        data: DeliverableWithContentAndArtifact,
    ): DeliverableWithContentAndArtifactResDto {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            projectId: data.projectId,
            subjectId: data.subjectId,
            subjectName: data.subject?.name,
            startDate: data.startDate,
            endDate: data.endDate,
            artifact: data.Artifact,
            content: data.DeliverableContent,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }

    static buildMany(
        deliverables: DeliverableWithContentAndArtifact[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<DeliverableResDto[]> {
        return {
            items: deliverables.map((deliverable) => this.buildWithContentAndArtifact(deliverable)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
