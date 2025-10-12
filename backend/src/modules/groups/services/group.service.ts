import { Injectable } from "@nestjs/common"
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

@Injectable()
export class GroupService {
    constructor(
        private readonly groupRepository: GroupRepository,
        private readonly projectService: ProjectService,
        private readonly userService: UserService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(dto: CreateGroupReqDto, currentCourseId: string): Promise<GroupResDto> {
        try {
            await Promise.all([
                this.projectService.getById(dto.projectId, currentCourseId),
                ...dto.userIds.map((userId) => this.userService.getById(userId, currentCourseId)),
            ])

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

    async updateById(id: string, dto: UpdateGroupReqDto, currentCourseId: string): Promise<GroupResDto> {
        try {
            await Promise.all([
                this.getById(id, currentCourseId),
                ...dto.userIds.map((userId) => this.userService.getById(userId, currentCourseId)),
            ])

            const course = await this.groupRepository.updateById(id, dto, currentCourseId)

            return GroupResBuilder.build(course)
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

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        try {
            await this.getById(id, currentCourseId)

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
}
