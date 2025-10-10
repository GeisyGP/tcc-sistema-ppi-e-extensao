export interface ProjectRes {
    id: string
    class: string
    executionPeriod: string
    status: ProjectStatus
    theme: string
    ppiId: string
    ppiClassPeriod: string
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
}

export enum ProjectStatus {
    NOT_STARTED = "NOT_STARTED",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
}

export interface ProjectFullRes {
    id: string
    theme: string
    scope: string | null
    justification: string | null
    generalObjective: string | null
    specificObjectives: string | null
    subjectsContributions: string | null
    methodology: string | null
    timeline: string | null
}

export interface GetAllProjectsReq {
    page?: number
    limit?: number
    ppiId?: string
    status?: ProjectStatus
    executionPeriod?: string
    class?: string
    theme?: string
    studentId?: string
    teacherId?: string
}

export interface ProjectCreateInput {
    class: string
    executionPeriod: string
    theme: string
    ppiId: string
}

export interface ProjectUpdateInput {
    class: string
    executionPeriod: string
    theme: string
}

export interface ProjectContentUpdateInput {
    theme: string
    scope: string
    justification: string
    generalObjective: string
    specificObjectives: string
    subjectsContributions: string
    methodology: string
    timeline: string
}

export interface ChangeProjectStatusInput {
    status: ProjectStatus
}

export interface Project {
    id: string
    class: string
    executionPeriod: string
    status: ProjectStatusMapped | "Desconhecido"
    theme: string
    ppiClassPeriod: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
}

export enum ProjectStatusMapped {
    NOT_STARTED = "Não iniciado",
    STARTED = "Em andamento",
    FINISHED = "Concluído",
}
