import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { CreatePPIReqDto } from "../types/dtos/requests/create-ppi-req.dto"
import { GetAllPPIsReqDto } from "../types/dtos/requests/get-all-ppis-req.dto"
import { UpdatePPIReqDto } from "../types/dtos/requests/update-ppi-req.dto"
import { PPIRepositoryInterface, PPIWithSubjects } from "./ppi.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { UpdateSubjectPPIReqDto } from "../types/dtos/requests/update-subject-ppi-req.dto"

@Injectable()
export class PPIRepository implements PPIRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreatePPIReqDto, currentCourseId: string): Promise<PPIWithSubjects> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.pPI.create({
            data: {
                classPeriod: dto.classPeriod,
                workload: dto.workload,
                courseId: currentCourseId,
                SubjectPPI: {
                    create: dto.subjects.map((subject: { id: string; workload: number }) => ({
                        subject: { connect: { id: subject.id } },
                        workload: subject.workload,
                    })),
                },
            },
            include: {
                SubjectPPI: {
                    include: {
                        subject: { select: { name: true } },
                    },
                },
            },
        })
    }

    async getById(id: string, currentCourseId: string): Promise<PPIWithSubjects | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const ppi = await this.prisma.pPI.findUnique({
            where: { id },
            include: {
                SubjectPPI: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        subject: { select: { name: true } },
                    },
                },
            },
        })

        if (!ppi) return null

        return ppi
    }

    async getAll(
        dto: GetAllPPIsReqDto,
        currentCourseId: string,
    ): Promise<{ ppis: PPIWithSubjects[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            classPeriod: {
                contains: dto.classPeriod,
                mode: Prisma.QueryMode.insensitive,
            },
        }

        const ppis = await this.prisma.pPI.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ classPeriod: "asc" }],
            include: {
                SubjectPPI: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        subject: { select: { name: true } },
                    },
                },
            },
        })

        if (!ppis) {
            return {
                ppis: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.pPI.count({
            where: filter,
        })

        return { ppis, totalItems }
    }

    async updateById(id: string, dto: UpdatePPIReqDto, currentCourseId: string): Promise<PPIWithSubjects> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.pPI.update({
            where: { id },
            data: {
                classPeriod: dto.classPeriod,
                workload: dto.workload,
            },
            include: {
                SubjectPPI: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        subject: { select: { name: true } },
                    },
                },
            },
        })
    }

    async updateSubjectPPIById(id: string, dto: UpdateSubjectPPIReqDto, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        await this.prisma.subjectPPI.deleteMany({
            where: {
                ppiId: id,
                subjectId: { notIn: dto.subjects.map((s) => s.id) },
            },
        })

        await Promise.all(
            await Promise.all(
                dto.subjects.map((subject) =>
                    this.prisma.subjectPPI.upsert({
                        where: {
                            subjectId_ppiId: {
                                ppiId: id,
                                subjectId: subject.id,
                            },
                        },
                        update: {
                            workload: subject.workload,
                            deletedAt: null,
                        },
                        create: {
                            ppi: { connect: { id } },
                            subject: { connect: { id: subject.id } },
                            workload: subject.workload,
                        },
                    }),
                ),
            ),
        )
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        await this.prisma.pPI.delete({
            where: { id },
        })
    }
}
