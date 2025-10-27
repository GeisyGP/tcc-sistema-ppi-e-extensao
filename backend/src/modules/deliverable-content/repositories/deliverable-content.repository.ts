import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { DeliverableContent } from "@prisma/client"
import { CreateContentReqDto } from "../types/dtos/requests/create-content-req.dto"
import { UpdateContentReqDto } from "../types/dtos/requests/update-content-req.dto"
import { DeliverableContentRepositoryInterface } from "./deliverable-content.repository.interface"

@Injectable()
export class DeliverableContentRepository implements DeliverableContentRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(
        dto: CreateContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<DeliverableContent> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.deliverableContent.create({
            data: {
                content: dto.content,
                deliverableId: dto.deliverableId,
                groupId: dto.groupId,
                createdBy: currentUserId,
                updatedBy: currentUserId,
                courseId: currentCourseId,
            },
        })
    }

    async getById(
        id: string,
        currentCourseId: string,
        studentId?: string,
        visibleToAll?: boolean,
    ): Promise<DeliverableContent | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const deliverable = await this.prisma.deliverableContent.findUnique({
            where: {
                id,
                OR: [
                    {
                        group: {
                            users: {
                                some: { id: studentId },
                            },
                        },
                        deliverable: {
                            project: { visibleToAll },
                        },
                    },
                ],
            },
        })

        if (!deliverable) return null

        return deliverable
    }

    async getAllByDeliverableId(
        currentCourseId: string,
        deliverableId: string,
        groupId?: string,
    ): Promise<{ deliverableContents: DeliverableContent[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            deliverableId,
            groupId,
        }

        const deliverableContents = await this.prisma.deliverableContent.findMany({
            where: filter,
        })

        if (!deliverableContents) {
            return {
                deliverableContents: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.deliverableContent.count({
            where: filter,
        })

        return { deliverableContents, totalItems }
    }

    async updateById(
        id: string,
        dto: UpdateContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<DeliverableContent> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.deliverableContent.update({
            where: { id },
            data: {
                content: dto.content,
                updatedBy: currentUserId,
            },
        })
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.deliverableContent.delete({ where: { id } })
    }
}
