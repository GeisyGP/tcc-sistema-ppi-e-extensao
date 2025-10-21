import { Artifact } from "@prisma/client"
import { GetAllArtifactReqDto } from "../types/dtos/requests/get-all-req.dto"

export interface CreateArtifactInput {
    name: string
    fileName: string
    mimeType: string
    path: string
    size: number
    projectId?: string
    groupId?: string
    deliverableId?: string
}

export interface UpdateArtifactFileInput {
    fileName: string
    mimeType: string
    path: string
    size: number
}

export interface ArtifactRepositoryInterface {
    create(dto: CreateArtifactInput, currentCourseId: string, currentUserId: string): Promise<Artifact>
    getById(id: string, currentCourseId: string): Promise<Artifact | null>
    getAllByProjectIdOrGroupId(
        dto: GetAllArtifactReqDto,
        currentCourseId: string,
        id: {
            projectId?: string
            groupId?: string
        },
    ): Promise<{ artifacts: Artifact[]; totalItems: number }>
    updateFileById(
        id: string,
        dto: UpdateArtifactFileInput,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<Artifact>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
