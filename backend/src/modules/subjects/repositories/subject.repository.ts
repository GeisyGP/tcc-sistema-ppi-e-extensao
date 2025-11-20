import { Injectable } from "@nestjs/common"
import { Prisma, Subject } from "@prisma/client"
import { CreateSubjectReqDto } from "../types/dtos/requests/create-subject-req.dto"
import { GetAllSubjectsReqDto } from "../types/dtos/requests/get-all-subjects-req.dto"
import { UpdateSubjectReqDto } from "../types/dtos/requests/update-subject-req.dto"
import { SubjectRepositoryInterface } from "./subject.repository.interface"
import { PrismaService } from "src/config/prisma.service"

type SubjectWithTeacher = Subject & { teachers: { id: string; name: string }[] }

@Injectable()
export class SubjectRepository implements SubjectRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateSubjectReqDto, currentCourseId: string): Promise<SubjectWithTeacher> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.subject.create({
            data: {
                name: dto.name,
                teachers: {
                    connect: dto.teachers.map((teacherId: string) => ({
                        id: teacherId,
                    })),
                },
                courseId: currentCourseId,
            },
            include: {
                teachers: {
                    where: { deletedAt: null },
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })
    }

    async getById(id: string, currentCourseId: string): Promise<SubjectWithTeacher | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const subject = await this.prisma.subject.findUnique({
            where: { id },
            include: {
                teachers: {
                    where: { deletedAt: null },
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        if (!subject) return null

        return subject
    }

    async getAll(
        dto: GetAllSubjectsReqDto,
        currentCourseId: string,
    ): Promise<{ subjects: SubjectWithTeacher[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            name: {
                contains: dto.name,
                mode: Prisma.QueryMode.insensitive,
            },
            teachers: dto.teacherId ? { some: { id: dto.teacherId } } : undefined,
        }

        const subjects = await this.prisma.subject.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
            include: {
                teachers: {
                    where: { deletedAt: null },
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })

        if (!subjects) {
            return {
                subjects: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.subject.count({
            where: filter,
        })

        return { subjects, totalItems }
    }

    async updateById(id: string, dto: UpdateSubjectReqDto, currentCourseId: string): Promise<SubjectWithTeacher> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.subject.update({
            where: { id },
            data: {
                name: dto.name,
                teachers: {
                    set: dto.teachers.map((teacherId: string) => ({
                        id: teacherId,
                    })),
                },
            },
            include: {
                teachers: {
                    where: { deletedAt: null },
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        })
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        await this.prisma.subject.delete({
            where: { id },
        })
    }
}
