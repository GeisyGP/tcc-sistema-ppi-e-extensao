import * as fs from "fs"
import { Injectable } from "@nestjs/common"
import { ArtifactRepository } from "../repositories/artifact-repository"
import {
    CreateArtifactDeliverableReqDto,
    CreateArtifactProjectReqDto,
} from "../types/dtos/requests/create-artifact-req.dto"
import { ArtifactResDto } from "../types/dtos/responses/artifact-res.dto"
import { GetAllArtifactReqDto } from "../types/dtos/requests/get-all-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { ArtifactResBuilder } from "../builders/artifact-res.builder"
import { ProjectService } from "src/modules/projects/services/project.service"
import { GroupService } from "src/modules/groups/services/group.service"
import { ArtifactNotFoundException } from "src/common/exceptions/artifact-not-found.exception"
import { UpdateArtifactFileInput } from "../repositories/artifact.repository.interface"
import { DeliverableService } from "src/modules/deliverable/services/deliverable.service"
import { CannotUpdateDeliverableAfterEndDateException } from "src/common/exceptions/cannot-update-deliverable-after-end-date.exception"
import { CannotUpdateDeliverableBeforeStartDateException } from "src/common/exceptions/cannot-update-deliverable-before-start-date.exception"

@Injectable()
export class ArtifactService {
    constructor(
        private readonly artifactRepository: ArtifactRepository,
        private readonly projectService: ProjectService,
        private readonly groupService: GroupService,
        private readonly deliverableService: DeliverableService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async createArtifactProject(
        projectId: string,
        dto: CreateArtifactProjectReqDto,
        fileInfo: UpdateArtifactFileInput,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ArtifactResDto> {
        try {
            await this.projectService.getById(projectId, currentCourseId)
            const response = await this.artifactRepository.create(
                {
                    name: dto.name,
                    fileName: fileInfo.fileName,
                    mimeType: fileInfo.mimeType,
                    path: fileInfo.path,
                    size: fileInfo.size,
                    projectId: projectId,
                },
                currentCourseId,
                currentUserId,
            )

            return ArtifactResBuilder.build(response)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.createArtifactProject.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async createArtifactDeliverable(
        deliverableId: string,
        dto: CreateArtifactDeliverableReqDto,
        fileInfo: UpdateArtifactFileInput,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ArtifactResDto> {
        try {
            const deliverable = await this.deliverableService.getById(deliverableId, currentCourseId)
            if (deliverable.startDate > new Date()) throw new CannotUpdateDeliverableBeforeStartDateException()
            if (deliverable.endDate < new Date()) throw new CannotUpdateDeliverableAfterEndDateException()

            await this.groupService.getById(dto.groupId, currentCourseId)
            const response = await this.artifactRepository.create(
                {
                    name: dto.name,
                    fileName: fileInfo.fileName,
                    mimeType: fileInfo.mimeType,
                    path: fileInfo.path,
                    size: fileInfo.size,
                    groupId: dto.groupId,
                    deliverableId: deliverableId,
                },
                currentCourseId,
                currentUserId,
            )

            return ArtifactResBuilder.build(response)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.createArtifactDeliverable.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<{ data: ArtifactResDto; filePath: string }> {
        try {
            const artifact = await this.artifactRepository.getById(id, currentCourseId)
            if (!artifact) {
                throw new ArtifactNotFoundException()
            }

            return { data: ArtifactResBuilder.build(artifact), filePath: artifact.path }
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAllByProjectId(
        projectId: string,
        dto: GetAllArtifactReqDto,
        currentCourseId: string,
    ): Promise<PaginationResDto<ArtifactResDto[]>> {
        try {
            const { artifacts, totalItems } = await this.artifactRepository.getAllByProjectIdOrGroupId(
                dto,
                currentCourseId,
                { projectId },
            )

            return ArtifactResBuilder.buildMany(artifacts, dto.page, dto.limit, totalItems)
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

    async getAllByGroupId(
        groupId: string,
        dto: GetAllArtifactReqDto,
        currentCourseId: string,
    ): Promise<PaginationResDto<ArtifactResDto[]>> {
        try {
            const { artifacts, totalItems } = await this.artifactRepository.getAllByProjectIdOrGroupId(
                dto,
                currentCourseId,
                { groupId },
            )

            return ArtifactResBuilder.buildMany(artifacts, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.getAllByGroupId.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async updateFileById(
        id: string,
        deliverableId: string,
        fileInfo: UpdateArtifactFileInput,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ArtifactResDto> {
        try {
            const deliverable = await this.deliverableService.getById(deliverableId, currentCourseId)
            if (deliverable.startDate > new Date()) throw new CannotUpdateDeliverableBeforeStartDateException()
            if (deliverable.endDate < new Date()) throw new CannotUpdateDeliverableAfterEndDateException()

            const artifactToBeRemoved = await this.getById(id, currentCourseId)
            if (artifactToBeRemoved.data.deliverableId !== deliverableId) {
                throw new ArtifactNotFoundException()
            }
            const artifact = await this.artifactRepository.updateFileById(id, fileInfo, currentCourseId, currentUserId)

            if (artifactToBeRemoved.filePath && fs.existsSync(artifactToBeRemoved.filePath)) {
                fs.unlinkSync(artifactToBeRemoved.filePath)
            }

            return ArtifactResBuilder.build(artifact)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.updateFileById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        try {
            const artifact = await this.getById(id, currentCourseId)
            await this.artifactRepository.deleteById(id, currentCourseId)
            if (artifact.filePath && fs.existsSync(artifact.filePath)) {
                fs.unlinkSync(artifact.filePath)
            }
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
