import { CreateGroupReqDto } from "../types/dtos/requests/create-group-req.dto"
import { GetAllGroupsReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateGroupReqDto } from "../types/dtos/requests/update-group-req.dto"
import { GroupRepositoryInterface, GroupWithUsers } from "./group.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class GroupRepository implements GroupRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateGroupReqDto, currentCourseId: string): Promise<GroupWithUsers> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.group.create({
            data: {
                name: dto.name,
                projectId: dto.projectId,
                users: {
                    connect: dto.userIds.map((id) => ({ id })),
                },
                courseId: currentCourseId,
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        registration: true,
                    },
                },
            },
        })
    }

    async getById(id: string, currentCourseId: string): Promise<GroupWithUsers | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const group = await this.prisma.group.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        registration: true,
                    },
                },
            },
        })

        if (!group) return null

        return group
    }

    async getAllByProjectId(
        projectId: string,
        dto: GetAllGroupsReqDto,
        currentCourseId: string,
    ): Promise<{ groups: GroupWithUsers[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            projectId,
        }

        const groups = await this.prisma.group.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        registration: true,
                    },
                },
            },
        })

        if (!groups) {
            return {
                groups: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.group.count({
            where: filter,
        })

        return { groups, totalItems }
    }

    async updateById(id: string, dto: UpdateGroupReqDto, currentCourseId: string): Promise<GroupWithUsers> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.group.update({
            where: { id },
            data: {
                name: dto.name,
                users: {
                    set: dto.userIds.map((userId: string) => ({
                        id: userId,
                    })),
                },
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        registration: true,
                    },
                },
            },
        })
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.group.delete({ where: { id } })
    }
}
