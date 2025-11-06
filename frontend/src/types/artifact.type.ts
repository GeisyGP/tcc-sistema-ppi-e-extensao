export interface ArtifactRes {
    id: string
    name: string
    fileName: string
    mimeType: string
    size: string
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
    groupId: string
    projectId: string
    deliverableId: string
}

export interface GetAllArtifactsReq {
    page?: number
    limit?: number
}

export interface ArtifactProjectCreateInput {
    name: string
}

export interface ArtifactDeliverableCreateInput {
    name: string
    groupId: string
}

export interface Artifact {
    id: string
    name: string
    fileName: string
    mimeType: string
    size: string
    groupId: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
}
