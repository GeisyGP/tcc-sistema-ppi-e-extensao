import { PPI } from "@prisma/client"
import { CreatePPIReqDto } from "../types/dtos/requests/create-ppi-req.dto"
import { GetAllPPIsReqDto } from "../types/dtos/requests/get-all-ppis-req.dto"
import { UpdatePPIReqDto } from "../types/dtos/requests/update-ppi-req.dto"
import { UpdateSubjectPPIReqDto } from "../types/dtos/requests/update-subject-ppi-req.dto"

export type PPIWithSubjects = PPI & {
    SubjectPPI: { subjectId: string; workload: number; subject?: { name: string } }[]
}

export interface PPIRepositoryInterface {
    create(dto: CreatePPIReqDto, currentCourseId: string): Promise<PPIWithSubjects>
    getById(id: string, currentCourseId: string): Promise<PPIWithSubjects | null>
    getAll(dto: GetAllPPIsReqDto, currentCourseId: string): Promise<{ ppis: PPIWithSubjects[]; totalItems: number }>
    updateById(id: string, dto: UpdatePPIReqDto, currentCourseId: string): Promise<PPIWithSubjects>
    updateSubjectPPIById(id: string, dto: UpdateSubjectPPIReqDto, currentCourseId: string): Promise<void>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
