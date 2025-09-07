import { Course, Prisma } from "@prisma/client"
import { CreateCourseReqDto } from "../types/dtos/requests/create-course-req.dto"
import { GetAllCoursesReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateCourseReqDto } from "../types/dtos/requests/update-course-req.dto"
import { CourseRepositoryInterface } from "./course.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CourseRepository implements CourseRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateCourseReqDto): Promise<Course> {
        return await this.prisma.course.create({
            data: {
                name: dto.name,
                technologicalAxis: dto.technologicalAxis,
                educationLevel: dto.educationLevel,
                degree: dto.degree,
                modality: dto.modality,
                shift: dto.shift,
            },
        })
    }

    async getById(id: string): Promise<Course | null> {
        const course = await this.prisma.course.findUnique({
            where: { id },
        })

        if (!course) return null

        return course
    }

    async getAll(dto: GetAllCoursesReqDto): Promise<{ courses: Course[]; totalItems: number }> {
        const filter = {
            name: {
                contains: dto.name,
                mode: Prisma.QueryMode.insensitive,
            },
        }

        const courses = await this.prisma.course.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
        })

        if (!courses) {
            return {
                courses: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.course.count({
            where: filter,
        })

        return { courses, totalItems }
    }

    async updateById(id: string, dto: UpdateCourseReqDto): Promise<Course> {
        return await this.prisma.course.update({
            where: { id },
            data: {
                name: dto.name,
                technologicalAxis: dto.technologicalAxis,
                educationLevel: dto.educationLevel,
                degree: dto.degree,
                modality: dto.modality,
                shift: dto.shift,
            },
        })
    }

    async deleteById(id: string): Promise<void> {
        await this.prisma.course.delete({ where: { id } })
    }
}
