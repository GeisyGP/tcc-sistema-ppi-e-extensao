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

export interface CoursesJwt {
    courseId: string
    role: string
    name: string
}

export enum EducationLevelEnum {
    MEDIO = "Médio",
    SUPERIOR = "Superior",
}

export enum DegreeEnum {
    TECNICO = "Técnico",
    TECNOLOGO = "Tecnólogo",
    BACHARELADO = "Bacharelado",
    LICENCIATURA = "Licenciatura",
}

export enum ModalityEnum {
    PRESENCIAL = "Presencial",
    SEMIPRESENCIAL = "Semipresencial",
    EAD = "Educação a Distância (EaD)",
}

export enum ShiftEnum {
    INTEGRAL = "Integral",
    MATUTINO = "Matutino",
    VESPERTINO = "Vespertino",
    NOTURNO = "Noturno",
}
