export interface DeliverableContentRes {
    id: string
    content: string
    deliverableId: string
    groupId: string
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
}

export interface DeliverableContentCreateInput {
    content: string
    groupId: string
    deliverableId: string
}

export interface DeliverableContentUpdateInput {
    content: string
}

export interface DeliverableContent {
    id: string
    content: string
    deliverableId: string
    groupId: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
}
