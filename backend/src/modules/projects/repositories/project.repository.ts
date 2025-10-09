import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { CreateProjectReqDto } from "../types/dtos/requests/create-project-req.dto"
import { GetAllProjectsReqDto } from "../types/dtos/requests/get-all-projects-req.dto"
import { UpdateProjectReqDto } from "../types/dtos/requests/update-project-req.dto"
import { ProjectRepositoryInterface, ProjectWithPPI } from "./project.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { ChangeStatusReqDto } from "../types/dtos/requests/change-status-req.dto"
import { UpdateProjectContentReqDto } from "../types/dtos/requests/update-project-content-req.dto"
import { ProjectStatus } from "src/common/enums/project-status.enum"
import { ProjectFullResDto } from "../types/dtos/responses/project-res.dto"

@Injectable()
export class ProjectRepository implements ProjectRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateProjectReqDto, currentCourseId: string, currentUserId: string): Promise<ProjectWithPPI> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.project.create({
            data: {
                class: dto.class,
                currentYear: dto.currentYear,
                topic: dto.topic,
                status: ProjectStatus.NOT_STARTED,
                ppiId: dto.ppiId,
                courseId: currentCourseId,
                createdBy: currentUserId,
                updatedBy: currentUserId,
            },
            select: {
                id: true,
                class: true,
                currentYear: true,
                status: true,
                topic: true,
                ppiId: true,
                createdBy: true,
                updatedBy: true,
                createdAt: true,
                updatedAt: true,
                courseId: true,
                deletedAt: true,
                ppi: { select: { classPeriod: true } },
            },
        })
    }

    async getFullById(id: string, currentCourseId: string): Promise<ProjectFullResDto | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const project = await this.prisma.project.findUnique({
            where: { id },
            select: {
                id: true,
                topic: true,
                scope: true,
                justification: true,
                generalObjective: true,
                specificObjectives: true,
                subjectsContributions: true,
                methodology: true,
                timeline: true,
            },
        })

        if (!project) return null

        return project
    }

    async getById(id: string, currentCourseId: string): Promise<ProjectWithPPI | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const project = await this.prisma.project.findUnique({
            where: { id },
            select: {
                id: true,
                class: true,
                currentYear: true,
                status: true,
                topic: true,
                ppiId: true,
                createdBy: true,
                updatedBy: true,
                createdAt: true,
                updatedAt: true,
                courseId: true,
                deletedAt: true,
                ppi: { select: { classPeriod: true } },
            },
        })

        if (!project) return null

        return project
    }

    async getAll(
        dto: GetAllProjectsReqDto,
        currentCourseId: string,
    ): Promise<{ projects: ProjectWithPPI[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        const filter = {
            ppiId: dto?.ppiId,
            status: dto?.status,
            currentYear: dto?.currentYear ? Number(dto.currentYear) : undefined,
            class: {
                contains: dto?.class,
                mode: Prisma.QueryMode.insensitive,
            },
            topic: {
                contains: dto?.topic,
                mode: Prisma.QueryMode.insensitive,
            },
            Group: dto?.studentId ? { some: { users: { some: { id: dto.studentId } } } } : undefined,
            ppi: dto?.teacherId
                ? { SubjectPPI: { some: { subject: { teachers: { some: { id: dto.teacherId } } } } } }
                : undefined,
        }

        const projects = await this.prisma.project.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ topic: "asc" }],
            select: {
                id: true,
                class: true,
                currentYear: true,
                status: true,
                topic: true,
                ppiId: true,
                createdBy: true,
                updatedBy: true,
                createdAt: true,
                updatedAt: true,
                courseId: true,
                deletedAt: true,
                ppi: { select: { classPeriod: true } },
            },
        })

        if (!projects) {
            return {
                projects: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.project.count({
            where: filter,
        })

        return { projects, totalItems }
    }

    async updateById(
        id: string,
        dto: UpdateProjectReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectWithPPI> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.project.update({
            where: { id },
            data: {
                class: dto.class,
                currentYear: dto.currentYear,
                topic: dto.topic,
                updatedBy: currentUserId,
            },
            select: {
                id: true,
                class: true,
                currentYear: true,
                status: true,
                topic: true,
                ppiId: true,
                createdBy: true,
                updatedBy: true,
                createdAt: true,
                updatedAt: true,
                courseId: true,
                deletedAt: true,
                ppi: { select: { classPeriod: true } },
            },
        })
    }

    async updateContentById(
        id: string,
        dto: UpdateProjectContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectFullResDto> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.project.update({
            where: { id },
            data: {
                topic: dto.topic,
                scope: dto.scope,
                justification: dto.justification,
                generalObjective: dto.generalObjective,
                specificObjectives: dto.specificObjectives,
                subjectsContributions: dto.subjectsContributions,
                methodology: dto.methodology,
                timeline: dto.timeline,
                updatedBy: currentUserId,
            },
            select: {
                id: true,
                topic: true,
                scope: true,
                justification: true,
                generalObjective: true,
                specificObjectives: true,
                subjectsContributions: true,
                methodology: true,
                timeline: true,
            },
        })
    }

    async changeStatus(
        id: string,
        dto: ChangeStatusReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<ProjectWithPPI> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.project.update({
            where: { id },
            data: {
                status: dto.status,
                updatedBy: currentUserId,
            },
            select: {
                id: true,
                class: true,
                currentYear: true,
                status: true,
                topic: true,
                ppiId: true,
                createdBy: true,
                updatedBy: true,
                createdAt: true,
                updatedAt: true,
                courseId: true,
                deletedAt: true,
                ppi: { select: { classPeriod: true } },
            },
        })
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        await this.prisma.project.delete({
            where: { id },
        })
    }
}
