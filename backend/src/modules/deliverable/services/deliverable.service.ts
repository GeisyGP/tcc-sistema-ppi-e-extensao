import { ForbiddenException, Injectable } from "@nestjs/common"
import { DeliverableRepository } from "../repositories/deliverable.repository"
import { CreateDeliverableReqDto } from "../types/dtos/requests/create-deliverable-req.dto"
import { DeliverableResDto, DeliverableWithContentAndArtifactResDto } from "../types/dtos/responses/deliverable-res.dto"
import { GetAllDeliverableReqDto } from "../types/dtos/requests/get-all-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { DeliverableResBuilder } from "../builders/deliverable-res.builder"
import { UpdateDeliverableReqDto } from "../types/dtos/requests/update-deliverable-req.dto"
import { ProjectService } from "src/modules/projects/services/project.service"
import { DeliverableNotFoundException } from "src/common/exceptions/deliverable-not-found.exception"
import { UserRole } from "src/common/enums/user-role.enum"

@Injectable()
export class DeliverableService {
    constructor(
        private readonly deliverableRepository: DeliverableRepository,
        private readonly projectService: ProjectService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(
        dto: CreateDeliverableReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<DeliverableResDto> {
        try {
            await this.projectService.getById(dto.projectId, currentCourseId)

            const response = await this.deliverableRepository.create(
                {
                    name: dto.name,
                    description: dto.description,
                    startDate: dto.startDate,
                    endDate: dto.endDate,
                    projectId: dto.projectId,
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
        userRole: UserRole,
    ): Promise<PaginationResDto<DeliverableResDto[]>> {
        try {
            if (userRole === UserRole.STUDENT && !dto.groupId) {
                throw new ForbiddenException()
            }
            const { deliverables, totalItems } = await this.deliverableRepository.getAllByProjectId(
                dto,
                currentCourseId,
                projectId,
            )

            return DeliverableResBuilder.buildMany(deliverables, dto.page, dto.limit, totalItems)
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
    ): Promise<DeliverableResDto> {
        try {
            await this.getById(id, currentCourseId)

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

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        try {
            await this.getById(id, currentCourseId)

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
}
