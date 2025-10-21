import { GetAllDeliverableReqDto } from "../types/dtos/requests/get-all-req.dto"
import { DeliverableRepositoryInterface } from "./deliverable.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { Deliverable } from "@prisma/client"
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
                createdBy: currentUserId,
                updatedBy: currentUserId,
                courseId: currentCourseId,
            },
        })
    }

    async getById(id: string, currentCourseId: string): Promise<Deliverable | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const deliverable = await this.prisma.deliverable.findUnique({
            where: { id },
        })

        if (!deliverable) return null

        return deliverable
    }

    async getAllByProjectId(
        dto: GetAllDeliverableReqDto,
        currentCourseId: string,
        projectId: string,
    ): Promise<{ deliverables: Deliverable[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            projectId,
        }
        console.log(filter)
        const deliverables = await this.prisma.deliverable.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
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
