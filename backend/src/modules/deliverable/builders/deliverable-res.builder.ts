import { Deliverable } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { DeliverableResDto } from "../types/dtos/responses/deliverable-res.dto"

export class DeliverableResBuilder {
    static build(data: Deliverable): DeliverableResDto {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            projectId: data.projectId,
            startDate: data.startDate,
            endDate: data.endDate,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }

    static buildMany(
        deliverables: Deliverable[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<DeliverableResDto[]> {
        return {
            items: deliverables.map((deliverable) => this.build(deliverable)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
