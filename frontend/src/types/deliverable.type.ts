export interface DeliverableRes {
    id: string
    name: string
    description: string
    startDate: Date
    endDate: Date
    projectId: string
    subjectId?: string
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
}

export interface DeliverableWithContentAndArtifactRes extends DeliverableRes {
    artifact: DeliverableArtifact[]
    content: DeliverableContentSimple[]
    subjectName?: string
    canUserManage?: boolean
}

export interface DeliverableContentSimple {
    id: string
    content: string
    groupId: string
}

export interface DeliverableArtifact {
    id: string
    name: string
    groupId: string | null
}

export interface DeliverableCreateInput {
    name: string
    description: string
    startDate: Date
    endDate: Date
    projectId: string
    subjectId?: string
}

export enum DeliverableStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    UPCOMING = "UPCOMING",
}

export enum DeliverableStatusMapped {
    ACTIVE = "Ativo",
    EXPIRED = "Expirado",
    UPCOMING = "Futuro",
}

export interface GetAllDeliverablesReq {
    page?: number
    limit?: number
    name?: string
    groupId?: string
    status: DeliverableStatus[]
}

export interface DeliverableUpdateInput {
    name: string
    description: string
    startDate: Date
    endDate: Date
}

export interface Deliverable {
    id: string
    name: string
    description: string
    startDate: string
    endDate: string
    projectId: string
    subjectId?: string
    subjectName?: string
    artifact: DeliverableArtifact[]
    content: DeliverableContentSimple[]
    createdAt: string
    updatedAt: string
    isSubmitted: boolean
}
