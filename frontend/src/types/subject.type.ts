export interface SubjectRes {
    id: string
    name: string
    teachers: TeacherResDto[]
    courseId: string
    createdAt: Date
    updatedAt: Date
}

interface TeacherResDto {
    id: string
    name: string
}

export interface GetAllSubjectsReq {
    name?: string
    teacherId?: string
    page?: number
    limit?: number
}

export interface SubjectUpdateInput {
    name: string
    teachers: string[]
}

export interface SubjectCreateInput {
    name: string
    teachers: string[]
    courseId: string
}

export interface Subject {
    id: string
    name: string
    teachers: string
    createdAt: string
    updatedAt: string
}
