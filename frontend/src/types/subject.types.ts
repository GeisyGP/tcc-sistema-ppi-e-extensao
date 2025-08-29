export interface SubjectRes {
    id: string
    name: string
    teachers: TeacherResDto[]
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

export interface SubjectInput {
    name: string
    teachers: string[]
}