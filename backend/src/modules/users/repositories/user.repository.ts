import { Prisma, User } from "@prisma/client"
import { UserRepositoryInterface, UserWithCourses } from "./user.repository.interface"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserReqDto, currentCourseId: string): Promise<User> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.user.upsert({
            where: {
                registration: dto.registration,
            },
            create: {
                name: dto.name,
                registration: dto.registration,
                password: dto.password,
                UserCourse: {
                    create: {
                        courseId: dto.courseId,
                        role: dto.role,
                    },
                },
            },
            update: {
                UserCourse: {
                    create: {
                        courseId: dto.courseId,
                        role: dto.role,
                    },
                },
            },
        })
    }

    async getById(id: string, currentCourseId: string): Promise<UserWithCourses | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                UserCourse: true,
            },
        })
    }

    async getAll(
        dto: GetAllUsersReqDto,
        currentCourseId: string,
    ): Promise<{ users: UserWithCourses[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        const filter = {
            name: {
                contains: dto.name,
                mode: Prisma.QueryMode.insensitive,
            },
            role: dto.role,
        }
        const users = await this.prisma.user.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
            include: {
                UserCourse: true,
            },
        })
        if (!users) {
            return {
                users: [],
                totalItems: 0,
            }
        }
        const totalItems = await this.prisma.user.count({
            where: filter,
        })

        return { users, totalItems }
    }

    async getByRegistration(registration: string, currentCourseId: string): Promise<UserWithCourses | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.user.findUnique({
            where: {
                registration,
            },
            include: {
                UserCourse: true,
            },
        })
    }

    async delete(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.user.delete({ where: { id } })
    }

    async changePassword(id: string, newPassword: string, currentCourseId: string): Promise<User | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                password: newPassword,
            },
        })
    }
}
