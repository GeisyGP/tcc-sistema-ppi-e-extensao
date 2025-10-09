import { Project } from "@prisma/client"
import { CreateProjectReqDto } from "../types/dtos/requests/create-project-req.dto"
import { GetAllProjectsReqDto } from "../types/dtos/requests/get-all-projects-req.dto"
import { UpdateProjectReqDto } from "../types/dtos/requests/update-project-req.dto"
import { ChangeStatusReqDto } from "../types/dtos/requests/change-status-req.dto"
import { UpdateProjectContentReqDto } from "../types/dtos/requests/update-project-content-req.dto"
import { ProjectFullResDto } from "../types/dtos/responses/project-res.dto"

export type ProjectWithPPI = Omit<
    Project,
    | "scope"
    | "justification"
    | "generalObjective"
    | "specificObjectives"
    | "subjectsContributions"
    | "methodology"
    | "timeline"
> & {
    ppi: { classPeriod: string }
}

export interface ProjectRepositoryInterface {
    create(dto: CreateProjectReqDto, currentCourseId: string, currentUserId: string): Promise<ProjectWithPPI>
    getFullById(id: string, currentCourseId: string): Promise<ProjectFullResDto | null>
    getAll(
        dto: GetAllProjectsReqDto,
        currentCourseId: string,
    ): Promise<{ projects: ProjectWithPPI[]; totalItems: number }>
    updateById(
        id: string,
        dto: UpdateProjectReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectWithPPI>
    updateContentById(
        id: string,
        dto: UpdateProjectContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectFullResDto>
    changeStatus(
        id: string,
        dto: ChangeStatusReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectWithPPI>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
