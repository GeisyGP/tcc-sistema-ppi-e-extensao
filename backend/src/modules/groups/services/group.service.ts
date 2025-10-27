import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import { GroupRepository } from "../repositories/group-repository"
import { CreateGroupReqDto } from "../types/dtos/requests/create-group-req.dto"
import { GroupResDto } from "../types/dtos/responses/group-res.dto"
import { GetAllGroupsReqDto } from "../types/dtos/requests/get-all-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { GroupResBuilder } from "../builders/group-res.builder"
import { UpdateGroupReqDto } from "../types/dtos/requests/update-group-req.dto"
import { ProjectService } from "src/modules/projects/services/project.service"
import { GroupNotFoundException } from "src/common/exceptions/group-not-found.exception"
import { UserService } from "src/modules/users/services/user.service"
import { UserRole } from "@prisma/client"
import { Action } from "src/common/enums/action.enum"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { SubjectService } from "src/modules/subjects/services/subject.service"

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly projectService: ProjectService,
        private readonly userService: UserService,
        private readonly ppiService: PPIService,
        private readonly subjectService: SubjectService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(
        dto: CreateGroupReqDto,
        currentCourseId: string,
        currentUserId: string,
        currentUserRole: UserRole,
    ): Promise<GroupResDto> {
        try {
            await this.handleAccess(dto.projectId, currentCourseId, currentUserId, Action.Create, currentUserRole)
            await Promise.all([...dto.userIds.map((userId) => this.userService.getById(userId, currentCourseId))])

            const group = await this.groupRepository.create(dto, currentCourseId)

            return GroupResBuilder.build(group)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<GroupResDto> {
        try {
            const group = await this.groupRepository.getById(id, currentCourseId)
            if (!group) {
                throw new GroupNotFoundException()
            }

            return GroupResBuilder.build(group)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAllByProjectId(
        projectId: string,
        dto: GetAllGroupsReqDto,
        currentCourseId: string,
    ): Promise<PaginationResDto<GroupResDto[]>> {
        try {
            const { groups, totalItems } = await this.groupRepository.getAllByProjectId(projectId, dto, currentCourseId)

            return GroupResBuilder.buildMany(groups, dto.page, dto.limit, totalItems)
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
        dto: UpdateGroupReqDto,
        currentCourseId: string,
        currentUserId: string,
        currentUserRole: UserRole,
    ): Promise<GroupResDto> {
        try {
            const [group] = await Promise.all([
                this.getById(id, currentCourseId),
                ...dto.userIds.map((userId) => this.userService.getById(userId, currentCourseId)),
            ])
            await this.handleAccess(group.projectId, currentCourseId, currentUserId, Action.Update, currentUserRole)

            const updatedGroup = await this.groupRepository.updateById(id, dto, currentCourseId)

            return GroupResBuilder.build(updatedGroup)
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
            const group = await this.getById(id, currentCourseId)
            await this.handleAccess(group.projectId, currentCourseId, currentUserId, Action.Delete, currentUserRole)
            await this.groupRepository.deleteById(id, currentCourseId)
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

    private async handleAccess(
        projectId: string,
        currentCourseId: string,
        userId: string,
        action: Action,
        role: UserRole,
    ): Promise<void> {
        if (role === UserRole.COORDINATOR) return

        try {
            if (action === Action.Update || action === Action.Create) {
                const hasAccess = await this.validateDefaultAccess(projectId, currentCourseId, userId)
                if (!hasAccess) {
                    throw new ForbiddenException()
                }
                return
            }

            if (action === Action.Delete) {
                const hasAccess = await this.validateCoordinatorAccess(projectId, currentCourseId, userId)
                if (!hasAccess) {
                    throw new ForbiddenException()
                }
                return
            }
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new ForbiddenException()
            }
            throw error
        }
    }

    private async validateCoordinatorAccess(
        projectId: string,
        currentCourseId: string,
        userId: string,
    ): Promise<boolean> {
        try {
            const project = await this.projectService.getById(projectId, currentCourseId)
            const ppi = await this.ppiService.getById(project.ppiId, currentCourseId)

            const coordinatorSubject = ppi.subjects.find((subject) => subject.isCoordinator)
            if (!coordinatorSubject) return false

            const subject = await this.subjectService.getById(coordinatorSubject.id, currentCourseId)
            const isUserPPICoordinator = subject.teachers.some((teacher) => teacher.id == userId)
            if (!isUserPPICoordinator) return false

            return true
        } catch (error) {
            if (error instanceof NotFoundException) {
                return false
            }
            throw error
        }
    }

    private async validateDefaultAccess(projectId: string, currentCourseId: string, userId: string): Promise<boolean> {
        try {
            const projectsByTeacher = await this.projectService.getAll(
                {
                    teacherId: userId,
                    status: "STARTED",
                    page: 1,
                    limit: 1,
                },
                currentCourseId,
                userId,
                UserRole.TEACHER,
            )

            const project = projectsByTeacher.items.find((i) => i.id === projectId)
            if (!project) return false

            return true
        } catch (error) {
            if (error instanceof NotFoundException) {
                return false
            }
            throw error
        }
    }
}
