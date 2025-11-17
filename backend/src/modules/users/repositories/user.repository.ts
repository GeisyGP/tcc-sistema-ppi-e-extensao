import { Prisma, User } from "@prisma/client"
import { UserRepositoryInterface, UserWithCourses } from "./user.repository.interface"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"
import { UserRole } from "src/common/enums/user-role.enum"
import { ChangeRoleBodyReqDto } from "../types/dtos/requests/change-role-req.dto"
import { UpdateByIdBodyReqDto } from "../types/dtos/requests/update-by-id-req.dto"
import { ROOT_COURSE_ID } from "src/common/constants"

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserReqDto, role: UserRole, currentCourseId: string): Promise<User> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)

        return await this.prisma.user.upsert({
            where: {
                registration: dto.registration,
            },
            create: {
                name: dto.name,
                email: dto.email,
                registration: dto.registration,
                password: dto.password,
                UserCourse: {
                    create: {
                        courseId: dto?.courseId || currentCourseId,
                        role,
                    },
                },
            },
            update: {
                UserCourse: {
                    create: {
                        courseId: dto?.courseId || currentCourseId,
                        role,
                    },
                },
                deletedAt: null,
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
                UserCourse: {
                    include: {
                        course: { select: { name: true } },
                    },
                },
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
            UserCourse: {
                some: {
                    role: {
                        in: dto.role,
                    },
                    courseId: dto.courseId,
                },
            },
        }
        const users = await this.prisma.user.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
            include: {
                UserCourse: {
                    include: {
                        course: { select: { name: true } },
                    },
                },
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
                UserCourse: {
                    include: {
                        course: { select: { name: true } },
                    },
                },
            },
        })
    }

    async delete(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.user.delete({ where: { id } })
    }

    async removeFromCourse(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.user.update({
            where: { id },
            data: {
                UserCourse: {
                    delete: {
                        userId_courseId: {
                            userId: id,
                            courseId: currentCourseId,
                        },
                    },
                },
            },
        })
    }

    async changeUserRole(userId: string, dto: ChangeRoleBodyReqDto, currentCourseId: string): Promise<UserWithCourses> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                UserCourse: {
                    update: {
                        where: {
                            userId_courseId: {
                                courseId: dto.courseId,
                                userId,
                            },
                        },
                        data: {
                            role: dto.userRole,
                        },
                    },
                },
            },
            include: {
                UserCourse: {
                    include: {
                        course: { select: { name: true } },
                    },
                },
            },
        })
    }

    async changePassword(
        id: string,
        newPassword: string,
        currentCourseId: string,
        changePasswordIsRequired: boolean,
    ): Promise<User | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                password: newPassword,
                changePasswordIsRequired,
            },
        })
    }

    async updateById(userId: string, dto: UpdateByIdBodyReqDto, currentCourseId: string): Promise<UserWithCourses> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name,
            },
            include: {
                UserCourse: {
                    include: {
                        course: { select: { name: true } },
                    },
                },
            },
        })
    }

    async createMany(dto: CreateUserReqDto[], role: UserRole, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${ROOT_COURSE_ID}'`)
        await this.prisma.$transaction(async (prisma) => {
            await prisma.user.createMany({
                data: dto.map((d) => ({
                    name: d.name,
                    registration: d.registration,
                    email: d.email,
                    password: d.password,
                })),
                skipDuplicates: true,
            })

            const allUsers = await prisma.user.findMany({
                where: {
                    registration: { in: dto.map((d) => d.registration) },
                },
            })

            await prisma.userCourse.createMany({
                data: allUsers.map((user) => ({
                    userId: user.id,
                    courseId: currentCourseId,
                    role,
                })),
                skipDuplicates: true,
            })
        })
    }
}
