export interface PPIRes {
    id: string
    classPeriod: string
    workload: number
    subjects: PPISubjectResDto[]
    createdAt: Date
    updatedAt: Date
}

export interface PPISubjectResDto {
    id: string
    name?: string
    workload: number
    isCoordinator: boolean
}

export interface GetAllPPIsReq {
    classPeriod?: string
    page?: number
    limit?: number
}

export interface PPIUpdateInput {
    classPeriod: string
    workload: number
}

export interface PPIUpdateSubjectInput {
    subjects: SubectReqDto[]
}

interface SubectReqDto {
    id: string
    workload: number
    isCoordinator?: boolean
}

export interface PPICreateInput {
    classPeriod: string
    workload: number
    subjects: SubectReqDto[]
}

export interface PPI {
    id: string
    classPeriod: string
    workload: number
    subjects: PPISubjectResDto[]
    subjectsNames: string
    createdAt: string
    updatedAt: string
}
