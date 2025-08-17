import * as bcrypt from "bcryptjs"
import { ForbiddenException, Injectable } from "@nestjs/common"
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
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { ChangePasswordBodyReqDto } from "../types/dtos/requests/change-password-req.dto"
import { InvalidInputException } from "src/common/exceptions/invalid-input.exception"
import { UserRequestDto } from "src/modules/authentication/dtos/requests/request.dto"
import { Action } from "src/common/enums/action.enum"
import { UserEntity } from "../types/entities/user.entity"

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private caslFactory: CaslAbilityFactory,
    ) {}

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

    async delete(id: string): Promise<void> {
        await this.getById(id)
        await this.userRepository.delete(id)
    }

    async update(
        id: string,
        dto: ChangePasswordBodyReqDto,
        currentUser: UserRequestDto,
    ): Promise<UserResDto> {
        const ability = this.caslFactory.createForUser(currentUser)

        const user = await this.userRepository.getById(id)
        if (!user) {
            throw new UserNotFoundException()
        }

        const userEntity = Object.assign(new UserEntity(), user)
        if (!ability.can(Action.Update, userEntity)) {
            throw new ForbiddenException()
        }

        const isMatch = await bcrypt.compare(dto.currentPassword, user.password)
        if (!isMatch) {
            throw new InvalidInputException(["Current password is incorrect"])
        }

        const hashedPassword = await bcrypt.hash(dto.newPassword, 10)

        await this.userRepository.changePassword(id, hashedPassword)
        return new UserResBuilder().build(user)
    }
}
