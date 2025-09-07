export interface CourseRes {
    id: string
    name: string
    technologicalAxis: string
    educationLevel: string
    degree: string
    modality: string
    shift: string
    createdAt: Date
    updatedAt: Date
}

export interface GetAllCoursesReq {
    name?: string
    page?: number
    limit?: number
}

export interface CourseUpdateInput {
    name: string
    technologicalAxis: string
    educationLevel: string
    degree: string
    modality: string
    shift: string
}

export interface CourseCreateInput {
    name: string
    technologicalAxis: string
    educationLevel: string
    degree: string
    modality: string
    shift: string
}

export interface Course {
    id: string
    name: string
    technologicalAxis: string
    educationLevel: string
    degree: string
    modality: string
    shift: string
    createdAt: string
    updatedAt: string
}