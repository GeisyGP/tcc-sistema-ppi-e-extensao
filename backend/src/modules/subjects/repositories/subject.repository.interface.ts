import { Subject } from "@prisma/client"
import { CreateSubjectReqDto } from "../types/dtos/requests/create-subject-req.dto"
import { GetAllSubjectsReqDto } from "../types/dtos/requests/get-all-subjects-req.dto"
import { UpdateSubjectReqDto } from "../types/dtos/requests/update-subject-req.dto"

export interface SubjectRepositoryInterface {
    create(dto: CreateSubjectReqDto, currentCourseId: string): Promise<Subject>
    getById(id: string, currentCourseId: string): Promise<Subject | null>
    getAll(dto: GetAllSubjectsReqDto, currentCourseId: string): Promise<{ subjects: Subject[]; totalItems: number }>
    updateById(id: string, dto: UpdateSubjectReqDto, currentCourseId: string): Promise<Subject>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
