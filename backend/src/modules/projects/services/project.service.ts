import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { GetAllProjectsReqDto } from "../types/dtos/requests/get-all-projects-req.dto"
import { UpdateProjectReqDto } from "../types/dtos/requests/update-project-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { ProjectFullResDto, ProjectResDto } from "../types/dtos/responses/project-res.dto"
import { ProjectResBuilder } from "../builders/project-res.builder"
import { ProjectRepository } from "../repositories/project.repository"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { CreateProjectReqDto } from "../types/dtos/requests/create-project-req.dto"
import { ProjectNotFoundException } from "src/common/exceptions/project-not-found.exception"
import { UpdateProjectContentReqDto } from "../types/dtos/requests/update-project-content-req.dto"
import { ChangeStatusReqDto } from "../types/dtos/requests/change-status-req.dto"
import { UserRole } from "src/common/enums/user-role.enum"
import { Action } from "src/common/enums/action.enum"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { ProjectStatus } from "src/common/enums/project-status.enum"
import { ProjectIsFinishedException } from "src/common/exceptions/project-is-finished.exception"

@Injectable()
export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly ppiService: PPIService,
        private readonly subjectService: SubjectService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(dto: CreateProjectReqDto, currentCourseId: string, currentUserId: string): Promise<ProjectResDto> {
        try {
            await this.ppiService.getById(dto.ppiId, currentCourseId)

            const project = await this.projectRepository.create(dto, currentCourseId, currentUserId)

            return ProjectResBuilder.build(project)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getFullById(id: string, currentCourseId: string): Promise<ProjectFullResDto> {
        try {
            const project = await this.projectRepository.getFullById(id, currentCourseId)
            if (!project) {
                throw new ProjectNotFoundException()
            }

            return ProjectResBuilder.buildFull(project)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.getFullById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<ProjectResDto> {
        try {
            const project = await this.projectRepository.getById(id, currentCourseId)
            if (!project) {
                throw new ProjectNotFoundException()
            }

            return ProjectResBuilder.build(project)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAll(
        dto: GetAllProjectsReqDto,
        currentCourseId: string,
        role: UserRole,
    ): Promise<PaginationResDto<ProjectResDto[]>> {
        try {
            const shouldRestrictStatus = [UserRole.STUDENT, UserRole.VIEWER].includes(role as any)
            let statusList: ProjectStatus[] | undefined

            if (shouldRestrictStatus) {
                if (!dto.status) {
                    statusList = [ProjectStatus.STARTED, ProjectStatus.FINISHED]
                } else {
                    const status = Array.isArray(dto.status) ? dto.status : [dto.status]
                    statusList = status.filter((s) => s !== ProjectStatus.NOT_STARTED)
                }
            } else {
                statusList = dto?.status ? [dto.status] : undefined
            }

            const formattedDto = {
                ...dto,
                status: statusList,
            }
            const { projects, totalItems } = await this.projectRepository.getAll(formattedDto, currentCourseId)

            return ProjectResBuilder.buildMany(projects, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getAll.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async updateById(
        id: string,
        dto: UpdateProjectReqDto,
        currentCourseId: string,
        currentUserId: string,
        role: UserRole,
    ): Promise<ProjectResDto> {
        try {
            const project = await this.getById(id, currentCourseId)
            if (project.status === ProjectStatus.FINISHED) throw new ProjectIsFinishedException()
            await this.handleAccess(project, currentCourseId, currentUserId, Action.Update, role)

            const updatedProject = await this.projectRepository.updateById(id, dto, currentCourseId, currentUserId)
            return ProjectResBuilder.build(updatedProject)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.updateById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async updateContentById(
        id: string,
        dto: UpdateProjectContentReqDto,
        currentCourseId: string,
        currentUserId: string,
        role: UserRole,
    ): Promise<ProjectFullResDto> {
        try {
            const project = await this.getById(id, currentCourseId)
            if (project.status === ProjectStatus.FINISHED) throw new ProjectIsFinishedException()
            await this.handleAccess(project, currentCourseId, currentUserId, Action.Update, role)

            const updatedProject = await this.projectRepository.updateContentById(
                id,
                dto,
                currentCourseId,
                currentUserId,
            )

            return ProjectResBuilder.buildFull(updatedProject)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.updateContentById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async changeStatus(
        id: string,
        dto: ChangeStatusReqDto,
        currentCourseId: string,
        currentUserId: string,
        role: UserRole,
    ): Promise<ProjectResDto> {
        try {
            const project = await this.getById(id, currentCourseId)
            await this.handleAccess(project, currentCourseId, currentUserId, Action.ChangeStatus, role)

            const updatedProject = await this.projectRepository.changeStatus(id, dto, currentCourseId, currentUserId)

            return ProjectResBuilder.build(updatedProject)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.changeStatus.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async delete(id: string, currentCourseId: string, currentUserId: string, role: UserRole): Promise<void> {
        try {
            const project = await this.getById(id, currentCourseId)
            await this.handleAccess(project, currentCourseId, currentUserId, Action.Delete, role)
            await this.projectRepository.deleteById(id, currentCourseId)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.delete.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    private async handleAccess(
        project: ProjectResDto,
        currentCourseId: string,
        userId: string,
        action: Action,
        role: UserRole,
    ): Promise<void> {
        if (role === UserRole.COORDINATOR) return

        try {
            if (action === Action.Update) {
                const hasAccess = await this.validateDefaultAccess(project.ppiId, currentCourseId, userId)
                if (!hasAccess) {
                    throw new ForbiddenException()
                }
            }

            if (action === Action.ChangeStatus || action === Action.Delete) {
                const hasAccess = await this.validateCoordinatorAccess(project.ppiId, currentCourseId, userId)
                if (!hasAccess) {
                    throw new ForbiddenException()
                }
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ForbiddenException()
            }
            throw error
        }
    }

    private async validateCoordinatorAccess(ppiId: string, currentCourseId: string, userId: string): Promise<boolean> {
        try {
            const ppi = await this.ppiService.getById(ppiId, currentCourseId)

            const coordinatorSubject = ppi.subjects.find((subject) => subject.isCoordinator)
            if (!coordinatorSubject) return false

            const subject = await this.subjectService.getById(coordinatorSubject.id, currentCourseId)
            const isUserPPICoordinator = subject.teachers.some((teacher) => teacher.id == userId)
            if (!isUserPPICoordinator) return false
        } catch (error) {
            if (error instanceof NotFoundException) {
                return false
            }
            throw error
        }

        return true
    }

    private async validateDefaultAccess(ppiId: string, currentCourseId: string, userId: string): Promise<boolean> {
        try {
            const projectsByPPIAndTeacher = await this.getAll(
                {
                    teacherId: userId,
                    page: 1,
                    limit: 1,
                    ppiId: ppiId,
                },
                currentCourseId,
                UserRole.TEACHER,
            )

            if (projectsByPPIAndTeacher.metadata.totalItems === 0) return false
        } catch (error) {
            if (error instanceof NotFoundException) {
                return false
            }
            throw error
        }

        return true
    }
}
