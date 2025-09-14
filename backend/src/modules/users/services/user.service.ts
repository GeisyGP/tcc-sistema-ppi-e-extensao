import * as bcrypt from "bcryptjs"
import { ForbiddenException, Injectable } from "@nestjs/common"
import { UserRepository } from "../repositories/user.repository"
import { GetByRegistrationReqDto } from "../types/dtos/requests/get-by-registration-req.dto"
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception"
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
import { CustomLoggerService } from "src/common/logger"
import { UserWithCourses } from "../repositories/user.repository.interface"
import { UserWithCoursesResDto } from "../types/dtos/responses/user-with-courses-res.dto"

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private caslFactory: CaslAbilityFactory,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(dto: CreateUserReqDto, currentCourseId: string): Promise<UserResDto> {
        try {
            const userExists = await this.getByRegistration({ registration: dto.registration }, currentCourseId)
            if (userExists && userExists.UserCourse.find((uc) => uc.courseId == dto.courseId)) {
                throw new UserExistsException()
            }

            const user = await this.userRepository.create(
                {
                    ...dto,
                    password: await this.hashPassword(dto.password),
                },
                currentCourseId,
            )
            return new UserResBuilder().build(user)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 12
        const salt = await bcrypt.genSalt(saltRounds)
        return bcrypt.hash(password, salt)
    }

    async getById(id: string, currentCourseId: string): Promise<UserWithCoursesResDto> {
        try {
            const user = await this.userRepository.getById(id, currentCourseId)
            if (!user) {
                throw new UserNotFoundException()
            }
            return new UserResBuilder().buildWithCourses(user)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAll(dto: GetAllUsersReqDto, currentCourseId: string): Promise<PaginationResDto<UserWithCoursesResDto[]>> {
        try {
            const { users, totalItems } = await this.userRepository.getAll(dto, currentCourseId)
            return new UserResBuilder().buildMany(users, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getAll.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getByRegistration(dto: GetByRegistrationReqDto, currentCourseId: string): Promise<UserWithCourses | null> {
        try {
            return await this.userRepository.getByRegistration(dto.registration, currentCourseId)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.getByRegistration.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async delete(id: string, currentCourseId: string): Promise<void> {
        try {
            await this.getById(id, currentCourseId)
            await this.userRepository.delete(id, currentCourseId)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.delete.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async update(
        id: string,
        dto: ChangePasswordBodyReqDto,
        currentUser: UserRequestDto,
        currentCourseId: string,
    ): Promise<UserResDto> {
        try {
            const ability = this.caslFactory.createForUser(currentUser)

            const user = await this.userRepository.getById(id, currentCourseId)
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

            await this.userRepository.changePassword(id, hashedPassword, currentCourseId)
            return new UserResBuilder().build(user)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.update.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }
}
