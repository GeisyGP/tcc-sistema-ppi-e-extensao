import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { DeliverableRepository } from "../repositories/deliverable.repository"
import { CreateDeliverableReqDto } from "../types/dtos/requests/create-deliverable-req.dto"
import { DeliverableResDto, DeliverableWithContentAndArtifactResDto } from "../types/dtos/responses/deliverable-res.dto"
import { DeliverableStatus, GetAllDeliverableReqDto } from "../types/dtos/requests/get-all-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { DeliverableResBuilder } from "../builders/deliverable-res.builder"
import { UpdateDeliverableReqDto } from "../types/dtos/requests/update-deliverable-req.dto"
import { ProjectService } from "src/modules/projects/services/project.service"
import { DeliverableNotFoundException } from "src/common/exceptions/deliverable-not-found.exception"
import { UserRole } from "src/common/enums/user-role.enum"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { ProjectResDto } from "src/modules/projects/types/dtos/responses/project-res.dto"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { ProjectStatus } from "src/common/enums/project-status.enum"

@Injectable()
export class DeliverableService {
    constructor(
        private readonly deliverableRepository: DeliverableRepository,
        @Inject(forwardRef(() => ProjectService))
        private readonly projectService: ProjectService,
        private readonly subjectService: SubjectService,
        private readonly ppiService: PPIService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(
        dto: CreateDeliverableReqDto,
        currentCourseId: string,
        currentUserId: string,
        currentUserRole: UserRole,
    ): Promise<DeliverableResDto> {
        try {
            await this.handleCreateAccess(currentCourseId, currentUserId, currentUserRole, dto.projectId, dto.subjectId)

            const response = await this.deliverableRepository.create(
                {
                    name: dto.name,
                    description: dto.description,
                    startDate: dto.startDate,
                    endDate: dto.endDate,
                    projectId: dto.projectId,
                    subjectId: dto.subjectId,
                },
                currentCourseId,
                currentUserId,
            )

            return DeliverableResBuilder.build(response)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<DeliverableWithContentAndArtifactResDto> {
        try {
            const deliverable = await this.deliverableRepository.getById(id, currentCourseId)
            if (!deliverable) {
                throw new DeliverableNotFoundException()
            }

            return DeliverableResBuilder.buildWithContentAndArtifact(deliverable)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getByIdAndGroupId(
        id: string,
        currentCourseId: string,
        groupId: string,
    ): Promise<DeliverableWithContentAndArtifactResDto> {
        try {
            const deliverable = await this.deliverableRepository.getById(id, currentCourseId, groupId)
            if (!deliverable) {
                throw new DeliverableNotFoundException()
            }

            return DeliverableResBuilder.buildWithContentAndArtifact(deliverable)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAllByProjectId(
        projectId: string,
        dto: GetAllDeliverableReqDto,
        currentCourseId: string,
        currentUserId: string,
        userRole: UserRole,
    ): Promise<PaginationResDto<DeliverableResDto[]>> {
        try {
            if (userRole === UserRole.STUDENT && !dto.groupId) {
                throw new ForbiddenException()
            }

            const project = await this.projectService.getById(projectId, currentCourseId)
            const canUserManage =
                userRole === UserRole.COORDINATOR && project.status === ProjectStatus.STARTED
                    ? true
                    : Boolean(await this.validateDefaultAccess(projectId, currentCourseId, currentUserId))

            const { deliverables, totalItems } = await this.deliverableRepository.getAllByProjectId(
                {
                    ...dto,
                    status:
                        userRole === UserRole.STUDENT
                            ? dto.status
                                ? dto.status.filter((s) => s !== DeliverableStatus.UPCOMING)
                                : [DeliverableStatus.ACTIVE, DeliverableStatus.EXPIRED]
                            : dto.status,
                },
                currentCourseId,
                projectId,
            )

            return DeliverableResBuilder.buildMany(deliverables, canUserManage, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.getAllByProjectId.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async updateById(
        id: string,
        dto: UpdateDeliverableReqDto,
        currentCourseId: string,
        currentUserId: string,
        currentUserRole: UserRole,
    ): Promise<DeliverableResDto> {
        try {
            await this.handleUpdateOrDeleteAccess(currentCourseId, currentUserId, currentUserRole, id)

            const deliverable = await this.deliverableRepository.updateById(id, dto, currentCourseId, currentUserId)

            return DeliverableResBuilder.build(deliverable)
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

    async deleteById(
        id: string,
        currentCourseId: string,
        currentUserId: string,
        currentUserRole: UserRole,
    ): Promise<void> {
        try {
            await this.handleUpdateOrDeleteAccess(currentCourseId, currentUserId, currentUserRole, id)

            await this.deliverableRepository.deleteById(id, currentCourseId)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.deleteById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    private async handleUpdateOrDeleteAccess(
        currentCourseId: string,
        userId: string,
        role: UserRole,
        deliverableId: string,
    ): Promise<void> {
        try {
            const deliverable = await this.getById(deliverableId, currentCourseId)

            if (role === UserRole.COORDINATOR) {
                const project = await this.projectService.getById(deliverable.projectId, currentCourseId)
                if (project.status === ProjectStatus.FINISHED) throw new ForbiddenException()
                return
            }

            const hasDefaultAccess = await this.validateDefaultAccess(deliverable.projectId, currentCourseId, userId)
            if (!hasDefaultAccess) throw new ForbiddenException()

            const hasAccess = await this.validateSubjectAccess(deliverable, currentCourseId, userId)
            if (!hasAccess) throw new ForbiddenException()

            return
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ForbiddenException()
            }
            throw error
        }
    }

    private async handleCreateAccess(
        currentCourseId: string,
        userId: string,
        role: UserRole,
        projectId: string,
        subjectId?: string,
    ): Promise<void> {
        try {
            if (role === UserRole.COORDINATOR) {
                const project = await this.projectService.getById(projectId, currentCourseId)
                if (project.status === ProjectStatus.FINISHED) throw new ForbiddenException()

                if (subjectId) {
                    const ppi = await this.ppiService.getById(project.ppiId, currentCourseId)
                    if (!ppi.subjects.find((subject) => subject.id === subjectId)) {
                        throw new ForbiddenException()
                    }
                }
                return
            }

            const project = await this.validateDefaultAccess(projectId, currentCourseId, userId)
            if (!project) throw new ForbiddenException()

            if (subjectId) {
                const ppi = await this.ppiService.getById(project.ppiId, currentCourseId)
                if (!ppi.subjects.find((subject) => subject.id === subjectId)) {
                    throw new ForbiddenException()
                }
            }

            return
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ForbiddenException()
            }
            throw error
        }
    }

    private async validateSubjectAccess(
        deliverable: DeliverableWithContentAndArtifactResDto,
        currentCourseId: string,
        userId: string,
    ): Promise<boolean> {
        try {
            if (deliverable.subjectId) {
                const subject = await this.subjectService.getById(deliverable.subjectId, currentCourseId)
                if (!subject.teachers.find((t) => t.id === userId)) return false
            }
            return true
        } catch (error) {
            if (error instanceof NotFoundException) {
                return false
            }
            throw error
        }
    }

    private async validateDefaultAccess(
        projectId: string,
        currentCourseId: string,
        userId: string,
    ): Promise<ProjectResDto | void> {
        try {
            const projectsByPPIAndTeacher = await this.projectService.getAllWithMultipleStatus(
                {
                    teacherId: userId,
                    status: ["STARTED", "NOT_STARTED"],
                    page: 1,
                    limit: 100,
                },
                currentCourseId,
            )

            const project = projectsByPPIAndTeacher.items.find((i) => i.id === projectId)
            if (!project) return

            return project
        } catch (error) {
            if (error instanceof NotFoundException) {
                return
            }
            throw error
        }
    }
}
