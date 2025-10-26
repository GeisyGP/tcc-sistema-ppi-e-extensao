import { DeliverableContent } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { DeliverableContentResDto } from "../types/dtos/responses/deliverable-content-res.dto"

export class DeliverableContentResBuilder {
    static build(data: DeliverableContent): DeliverableContentResDto {
        return {
            id: data.id,
            content: data.content,
            groupId: data.groupId,
            deliverableId: data.deliverableId,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }

    static buildMany(
        deliverableContents: DeliverableContent[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<DeliverableContentResDto[]> {
        return {
            items: deliverableContents.map((content) => this.build(content)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
