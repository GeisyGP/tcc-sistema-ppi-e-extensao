import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { Test } from "@nestjs/testing"
import { UserService } from "src/modules/users/services/user.service"
import { userMock, userWithCoursesMock, userWithCoursesResponseMock } from "../users/mocks/user.mock"
import { loginResMock } from "./mocks/authentication.mock"
import { AuthenticationService } from "src/modules/authentication/services/authentication.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UnauthorizedException } from "@nestjs/common"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { ROOT_COURSE_ID } from "src/common/constants"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"

describe("AuthenticationService", () => {
    let authenticationService: AuthenticationService
    let userService: UserService
    let jwtService: JwtService

    beforeEach(async () => {
        jest.clearAllMocks()
        const moduleRef = await Test.createTestingModule({
            providers: [
                CourseService,
                CourseRepository,
                AuthenticationService,
                UserService,
                UserRepository,
                PrismaService,
                JwtService,
                CaslAbilityFactory,
                {
                    provide: CustomLoggerService,
                    useValue: {
                        info: () => {},
                        error: () => {},
                    },
                },
            ],
        }).compile()

        authenticationService = moduleRef.get(AuthenticationService)
        userService = moduleRef.get(UserService)
        jwtService = moduleRef.get(JwtService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("login", () => {
        it("should return access token", async () => {
            const dto = {
                registration: userWithCoursesMock.registration,
                password: userWithCoursesMock.password,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(userWithCoursesMock)
            jest.spyOn(bcrypt, "compare").mockImplementation(() => true)
            jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce(loginResMock.accessToken)

            const result = await authenticationService.login(dto)

            expect(result).toEqual(loginResMock)
            expect(userService.getByRegistration).toHaveBeenCalledWith(
                {
                    registration: dto.registration,
                },
                ROOT_COURSE_ID,
            )
            expect(bcrypt.compare).toHaveBeenCalledWith(dto.password, userWithCoursesMock.password)
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: userWithCoursesMock.id,
                name: userWithCoursesMock.name,
                courses: userWithCoursesMock.UserCourse.map((uc) => ({
                    courseId: uc.courseId,
                    role: uc.role,
                    name: uc.course?.name,
                })),
                mainCourseId: userWithCoursesMock.UserCourse[0].courseId,
                mainRole: userWithCoursesMock.UserCourse[0].role,
            })
        })

        it("should throw UnauthorizedException when registration not exists", async () => {
            const dto = {
                registration: "some-registration",
                password: userMock.password,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(null)

            await expect(authenticationService.login(dto)).rejects.toThrow(UnauthorizedException)
        })

        it("should throw UnauthorizedException when password does not match", async () => {
            const dto = {
                registration: userMock.registration,
                password: "invalid password",
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(userWithCoursesMock)
            jest.spyOn(bcrypt, "compare").mockImplementation(() => false)

            await expect(authenticationService.login(dto)).rejects.toThrow(UnauthorizedException)
        })
    })

    describe("selectCourse", () => {
        it("should return access token", async () => {
            const user = userWithCoursesResponseMock()
            jest.spyOn(userService, "getById").mockResolvedValueOnce(user)
            jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce(loginResMock.accessToken)

            const result = await authenticationService.selectCourse(user.userCourse[0].courseId, user.id)

            expect(result).toEqual(loginResMock)
            expect(userService.getById).toHaveBeenCalledWith(user.id, ROOT_COURSE_ID)
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: user.id,
                name: user.name,
                courses: user.userCourse.map((uc) => ({
                    courseId: uc.courseId,
                    role: uc.role,
                    name: uc.name,
                })),
                mainCourseId: user.userCourse[0].courseId,
                mainRole: user.userCourse[0].role,
            })
        })
    })
})
