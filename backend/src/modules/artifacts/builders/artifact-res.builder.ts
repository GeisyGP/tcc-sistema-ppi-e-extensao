import { Artifact } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { ArtifactResDto } from "../types/dtos/responses/artifact-res.dto"

export class ArtifactResBuilder {
    static build(artifact: Artifact): ArtifactResDto {
        return {
            id: artifact.id,
            name: artifact.name,
            fileName: artifact.fileName,
            mimeType: artifact.mimeType,
            size: artifact.size,
            projectId: artifact.projectId,
            groupId: artifact.groupId,
            deliverableId: artifact.deliverableId,
            createdBy: artifact.createdBy,
            updatedBy: artifact.updatedBy,
            createdAt: artifact.createdAt,
            updatedAt: artifact.updatedAt,
        }
    }

    static buildMany(
        artifacts: Artifact[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<ArtifactResDto[]> {
        return {
            items: artifacts.map((artifact) => this.build(artifact)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
