import { DeliverableStatus, GetAllDeliverableReqDto } from "../types/dtos/requests/get-all-req.dto"
import { DeliverableRepositoryInterface, DeliverableWithContentAndArtifact } from "./deliverable.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { Deliverable, Prisma } from "@prisma/client"
import { CreateDeliverableReqDto } from "../types/dtos/requests/create-deliverable-req.dto"
import { UpdateDeliverableReqDto } from "../types/dtos/requests/update-deliverable-req.dto"

@Injectable()
export class DeliverableRepository implements DeliverableRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateDeliverableReqDto, currentCourseId: string, currentUserId: string): Promise<Deliverable> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.deliverable.create({
            data: {
                name: dto.name,
                description: dto.description,
                startDate: dto.startDate,
                endDate: dto.endDate,
                projectId: dto.projectId,
                subjectId: dto.subjectId,
                createdBy: currentUserId,
                updatedBy: currentUserId,
                courseId: currentCourseId,
            },
        })
    }

    async getById(
        id: string,
        currentCourseId: string,
        groupId?: string,
    ): Promise<DeliverableWithContentAndArtifact | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const deliverable = await this.prisma.deliverable.findUnique({
            where: { id },
            include: {
                Artifact: {
                    select: { id: true, name: true, groupId: true },
                    where: { groupId, deletedAt: null },
                },
                DeliverableContent: {
                    select: { id: true, content: true, groupId: true },
                    where: { groupId, deletedAt: null },
                },
                subject: {
                    select: { name: true },
                },
            },
        })

        if (!deliverable) return null

        return deliverable
    }

    async getAllByProjectId(
        dto: GetAllDeliverableReqDto,
        currentCourseId: string,
        projectId: string,
    ): Promise<{ deliverables: DeliverableWithContentAndArtifact[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const now = new Date()
        const orConditions: any[] = []
        dto.status?.forEach((status) => {
            switch (status) {
                case DeliverableStatus.EXPIRED:
                    orConditions.push({ endDate: { lt: now } })
                    break

                case DeliverableStatus.UPCOMING:
                    orConditions.push({ startDate: { gt: now } })
                    break

                case DeliverableStatus.ACTIVE:
                    orConditions.push({
                        startDate: { lte: now },
                        endDate: { gte: now },
                    })
                    break
            }
        })

        const filter = {
            name: {
                contains: dto.name,
                mode: Prisma.QueryMode.insensitive,
            },
            projectId,
            ...(orConditions.length > 0 ? { OR: orConditions } : {}),
        }

        const deliverables = await this.prisma.deliverable.findMany({
            where: filter,
            include: {
                Artifact: {
                    select: { id: true, name: true, groupId: true },
                    where: { groupId: dto.groupId, deletedAt: null },
                },
                DeliverableContent: {
                    select: { id: true, content: true, groupId: true },
                    where: { groupId: dto.groupId, deletedAt: null },
                },
                subject: {
                    select: { name: true },
                },
            },
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ endDate: "asc" }],
        })

        if (!deliverables) {
            return {
                deliverables: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.deliverable.count({
            where: filter,
        })

        return { deliverables, totalItems }
    }

    async updateById(
        id: string,
        dto: UpdateDeliverableReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<Deliverable> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.deliverable.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                startDate: dto.startDate,
                endDate: dto.endDate,
                updatedBy: currentUserId,
            },
        })
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.deliverable.delete({ where: { id } })
    }
}
