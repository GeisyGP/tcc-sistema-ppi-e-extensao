import * as bcrypt from "bcryptjs"
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common"
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
import { UserRequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { Action } from "src/common/enums/action.enum"
import { UserEntity } from "../types/entities/user.entity"
import { CustomLoggerService } from "src/common/logger"
import { UserWithCourses } from "../repositories/user.repository.interface"
import { UserWithCoursesResDto } from "../types/dtos/responses/user-with-courses-res.dto"
import { UserRole } from "src/common/enums/user-role.enum"
import { CourseService } from "src/modules/courses/services/course.service"
import { ChangeRoleBodyReqDto } from "../types/dtos/requests/change-role-req.dto"
import { validateCsvContent } from "../utils/validate-csv-content.util"
import { UpdateByIdBodyReqDto } from "../types/dtos/requests/update-by-id-req.dto"

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private caslFactory: CaslAbilityFactory,
        private readonly loggerService: CustomLoggerService,
        private readonly courseService: CourseService,
    ) {}

    async create(dto: CreateUserReqDto, role: UserRole, currentCourseId: string): Promise<UserResDto> {
        try {
            if (dto.courseId) {
                await this.courseService.getById(dto.courseId)
            }

            const userExists = await this.getByRegistration({ registration: dto.registration }, currentCourseId)
            if (userExists && userExists.UserCourse.find((uc) => uc.courseId == dto.courseId)) {
                throw new UserExistsException()
            }

            const user = await this.userRepository.create(
                {
                    ...dto,
                    password: await this.hashPassword(dto.password),
                },
                role,
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

    async removeFromCourse(id: string, currentCourseId: string): Promise<void> {
        try {
            await this.getById(id, currentCourseId)
            await this.userRepository.removeFromCourse(id, currentCourseId)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.delete.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async changePassword(
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
            this.loggerService.error(
                this.constructor.name,
                this.changePassword.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async changeUserRole(
        userId: string,
        dto: ChangeRoleBodyReqDto,
        currentCourseId: string,
    ): Promise<UserWithCoursesResDto> {
        try {
            const validRoles = [UserRole.COORDINATOR, UserRole.TEACHER]
            const user = await this.getById(userId, currentCourseId)
            const inInCourse = user.userCourse.find((uc) => uc.courseId === dto.courseId)
            if (!inInCourse || !validRoles.includes(inInCourse.role as any)) {
                throw new UserNotFoundException()
            }

            const updatedUser = await this.userRepository.changeUserRole(userId, dto, currentCourseId)

            return new UserResBuilder().buildWithCourses(updatedUser)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.changeUserRole.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async updateById(
        userId: string,
        dto: UpdateByIdBodyReqDto,
        currentCourseId: string,
    ): Promise<UserWithCoursesResDto> {
        try {
            await this.getById(userId, currentCourseId)
            const updatedUser = await this.userRepository.updateById(userId, dto, currentCourseId)
            return new UserResBuilder().buildWithCourses(updatedUser)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.updateById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async createUserStudentByCsv(file: Express.Multer.File, currentCourseId: string): Promise<void> {
        const result = await validateCsvContent(file)
        if (!result.valid || !result.data) {
            throw new BadRequestException(result.message)
        }

        const dto: CreateUserReqDto[] = await Promise.all(
            result.data.map(async (data) => {
                const hashedPassword = await this.hashPassword(data.password)

                return {
                    ...data,
                    password: hashedPassword,
                } as CreateUserReqDto
            }),
        )

        await this.userRepository.createMany(dto, UserRole.STUDENT, currentCourseId)
    }
}
