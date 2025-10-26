import { ForbiddenException, Injectable } from "@nestjs/common"
import { DeliverableContentResDto } from "../types/dtos/responses/deliverable-content-res.dto"
import { CustomLoggerService } from "src/common/logger"
import { DeliverableContentRepository } from "../repositories/deliverable-content.repository"
import { DeliverableContentResBuilder } from "../builders/deliverable-content-res.builder"
import { GroupService } from "src/modules/groups/services/group.service"
import { DeliverableService } from "../../deliverable/services/deliverable.service"
import { CreateContentReqDto } from "../types/dtos/requests/create-content-req.dto"
import { UpdateContentReqDto } from "../types/dtos/requests/update-content-req.dto"
import { DeliverableContentExistsException } from "src/common/exceptions/deliverable-content-exists.exception"
import { DeliverableContentNotFoundException } from "src/common/exceptions/deliverable-content-not-found.exception"
import { DeliverableNotFoundException } from "src/common/exceptions/deliverable-not-found.exception"

@Injectable()
export class DeliverableContentService {
    constructor(
        private readonly deliverableService: DeliverableService,
        private readonly groupService: GroupService,
        private readonly deliverableContentRepository: DeliverableContentRepository,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(
        dto: CreateContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<DeliverableContentResDto> {
        try {
            const group = await this.groupService.getById(dto.groupId, currentCourseId)
            if (!group.users.find((user) => user.id === currentUserId)) {
                throw new ForbiddenException()
            }
            const deliverable = await this.deliverableService.getByIdAndGroupId(
                dto.deliverableId,
                currentCourseId,
                dto.groupId,
            )
            if (deliverable.projectId !== group.projectId) {
                throw new DeliverableNotFoundException()
            }
            if (deliverable.content.length > 0) {
                throw new DeliverableContentExistsException()
            }

            const response = await this.deliverableContentRepository.create(dto, currentCourseId, currentUserId)

            return DeliverableContentResBuilder.build(response)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<DeliverableContentResDto> {
        try {
            const deliverable = await this.deliverableContentRepository.getById(id, currentCourseId)
            if (!deliverable) {
                throw new DeliverableContentNotFoundException()
            }

            return DeliverableContentResBuilder.build(deliverable)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async updateById(
        id: string,
        dto: UpdateContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<DeliverableContentResDto> {
        try {
            const content = await this.getById(id, currentCourseId)
            const group = await this.groupService.getById(content.groupId, currentCourseId)
            if (!group.users.find((user) => user.id === currentUserId)) {
                throw new ForbiddenException()
            }

            const updatedDeliverable = await this.deliverableContentRepository.updateById(
                id,
                dto,
                currentCourseId,
                currentUserId,
            )

            return DeliverableContentResBuilder.build(updatedDeliverable)
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

    async deleteById(id: string, currentCourseId: string, currentUserId: string): Promise<void> {
        try {
            const content = await this.getById(id, currentCourseId)
            const group = await this.groupService.getById(content.groupId, currentCourseId)
            if (!group.users.find((user) => user.id === currentUserId)) {
                throw new ForbiddenException()
            }

            await this.deliverableContentRepository.deleteById(id, currentCourseId)
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
