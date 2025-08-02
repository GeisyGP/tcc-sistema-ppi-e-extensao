import * as bcrypt from "bcryptjs"
import { Injectable } from "@nestjs/common"
import { UserRepository } from "../repositories/user.repository"
import { GetByRegistrationReqDto } from "../types/dtos/requests/get-by-registration-req.dto"
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception"
import { User } from "@prisma/client"
import { UserResDto } from "../types/dtos/responses/user-res.dto"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { UserResBuilder } from "../builders/user-res.builder"
import { UserExistsException } from "src/common/exceptions/user-exists.exception"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async create(dto: CreateUserReqDto): Promise<UserResDto> {
        const userExists = await this.getByRegistration({
            registration: dto.registration,
        })
        if (userExists) {
            throw new UserExistsException()
        }

        const user = await this.userRepository.create({
            ...dto,
            password: await this.hashPassword(dto.password),
        })

        return new UserResBuilder().build(user)
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 12
        const salt = await bcrypt.genSalt(saltRounds)
        return bcrypt.hash(password, salt)
    }

    async getById(id: string): Promise<UserResDto> {
        const user = await this.userRepository.getById(id)
        if (!user) {
            throw new UserNotFoundException()
        }
        return new UserResBuilder().build(user)
    }

    async getAll(
        dto: GetAllUsersReqDto,
    ): Promise<PaginationResDto<UserResDto[]>> {
        const { users, totalItems } = await this.userRepository.getAll(dto)
        return new UserResBuilder().buildMany(
            users,
            dto.page,
            dto.limit,
            totalItems,
        )
    }

    async getByRegistration(
        dto: GetByRegistrationReqDto,
    ): Promise<User | null> {
        return await this.userRepository.getByRegistration(dto.registration)
    }
}
