import { Project } from "@prisma/client"
import { CreateProjectReqDto } from "../types/dtos/requests/create-project-req.dto"
import { GetAllProjectsReq } from "../types/dtos/requests/get-all-projects-req.dto"
import { UpdateProjectReqDto } from "../types/dtos/requests/update-project-req.dto"
import { ChangeStatusReqDto } from "../types/dtos/requests/change-status-req.dto"
import { UpdateProjectContentReqDto } from "../types/dtos/requests/update-project-content-req.dto"
import { ProjectFullResDto } from "../types/dtos/responses/project-res.dto"
import { ChangeVisibilityReqDto } from "../types/dtos/requests/change-visibility-req.dto"

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

export type ProjectWithPPIWithCourse = Omit<
    Project,
    | "scope"
    | "justification"
    | "generalObjective"
    | "specificObjectives"
    | "subjectsContributions"
    | "methodology"
    | "timeline"
    | "status"
    | "theme"
    | "visibleToAll"
    | "ppiId"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "courseId"
> & {
    ppi: {
        classPeriod: string
        workload: number
        course: {
            technologicalAxis: string
            degree: string
            educationLevel: string
            modality: string
            shift: string
            name: string
        }
        SubjectPPI: { subjectId: string; workload: number; isCoordinator: boolean; subject?: { name: string } }[]
    }
}

export interface ProjectRepositoryInterface {
    create(dto: CreateProjectReqDto, currentCourseId: string, currentUserId: string): Promise<ProjectWithPPI>
    getFullById(id: string, currentCourseId: string): Promise<ProjectFullResDto | null>
    getById(
        id: string,
        currentCourseId: string,
        visibleToAll?: boolean,
        studentId?: string,
    ): Promise<ProjectWithPPI | null>
    getAll(dto: GetAllProjectsReq, currentCourseId: string): Promise<{ projects: ProjectWithPPI[]; totalItems: number }>
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
    changeVisibility(
        id: string,
        dto: ChangeVisibilityReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectWithPPI>
    deleteById(id: string, currentCourseId: string): Promise<void>
    getOverview(id: string, currentCourseId: string): Promise<ProjectWithPPIWithCourse | null>
}
