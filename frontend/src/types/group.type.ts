export interface GroupRes {
    id: string
    name: string
    projectId: string
    users: UserResDto[]
    createdAt: Date
    updatedAt: Date
}

interface UserResDto {
    id: string
    name: string
    registration: string
}

export interface GetAllGroupsReq {
    page?: number
    limit?: number
}

export interface GroupUpdateInput {
    name: string
    userIds: string[]
}

export interface GroupCreateInput {
    name: string
    userIds: string[]
    projectId: string
}

export interface Group {
    id: string
    name: string
    projectId: string
    users: UserResDto[]
    createdAt: string
    updatedAt: string
}
