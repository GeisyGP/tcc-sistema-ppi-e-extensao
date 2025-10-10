export interface ProjectRes {
    id: string
    class: string
    currentYear: number
    status: ProjectStatus
    topic: string
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
    topic: string
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
    currentYear?: string
    class?: string
    topic?: string
    studentId?: string
    teacherId?: string
}

export interface ProjectCreateInput {
    class: string
    currentYear: number
    topic: string
    ppiId: string
}

export interface ProjectUpdateInput {
    class: string
    currentYear: number
    topic: string
}

export interface ProjectContentUpdateInput {
    topic: string
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
    currentYear: number
    status: ProjectStatus
    topic: string
    ppiClassPeriod: string
    createdBy: string
    updatedBy: string
    createdAt: string
    updatedAt: string
}
