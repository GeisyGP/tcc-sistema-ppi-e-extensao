import { Prisma, User } from "@prisma/client"
import { UserRepositoryInterface } from "./user.repository.interface"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateUserReqDto): Promise<User> {
        return await this.prisma.user.create({
            data: {
                registration: dto.registration,
                name: dto.name,
                role: dto.role,
                password: dto.password,
                courseId: [dto.courseId],
            },
        })
    }

    async getById(id: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        })
    }

    async getAll(dto: GetAllUsersReqDto): Promise<{ users: User[]; totalItems: number }> {
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

    async getByRegistration(registration: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                registration,
            },
        })
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } })
    }

    async changePassword(id: string, newPassword: string): Promise<User | null> {
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
