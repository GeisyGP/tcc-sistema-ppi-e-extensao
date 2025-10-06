import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import {
    userWithCoursesMock,
    userMock,
    userWithCoursesResponseMock,
    userResponseMock,
    makeMockFile,
} from "./mocks/user.mock"
import { paginationMock } from "test/units/mocks"
import { UserExistsException } from "src/common/exceptions/user-exists.exception"
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { CourseService } from "src/modules/courses/services/course.service"
import { UserRole } from "src/common/enums/user-role.enum"

describe("UserService", () => {
    let userService: UserService
    let userRepository: UserRepository

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                CourseRepository,
                {
                    provide: CourseService,
                    useValue: {
                        getById: () => {},
                    },
                },
                UserService,
                UserRepository,
                PrismaService,
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

        userService = moduleRef.get(UserService)
        userRepository = moduleRef.get(UserRepository)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a user when does not exist in course", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(null)
            jest.spyOn(userRepository, "create").mockResolvedValueOnce(userMock)
            const hashSpy = jest.spyOn(userService as any, "hashPassword").mockResolvedValueOnce("hashedPassword")

            const result = await userService.create(
                dto,
                userWithCoursesMock.UserCourse[0].role,
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual(userResponseMock)
            expect(userRepository.create).toHaveBeenCalledWith(
                {
                    ...dto,
                    password: "hashedPassword",
                },
                userWithCoursesMock.UserCourse[0].role,
                requestMock.user.mainCourseId,
            )
            expect(hashSpy).toHaveBeenCalledWith(dto.password)
        })

        it("should throw UserExistsException when registration already exists in course", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(userWithCoursesMock)

            await expect(
                userService.create(dto, userWithCoursesMock.UserCourse[0].role, requestMock.user.mainCourseId),
            ).rejects.toThrow(UserExistsException)
        })
    })

    describe("getAll", () => {
        it("should return an array of users with pagination", async () => {
            jest.spyOn(userRepository, "getAll").mockResolvedValueOnce({
                totalItems: 1,
                users: [userWithCoursesMock],
            })

            const result = await userService.getAll(
                {
                    limit: 30,
                    name: "",
                    page: 1,
                    role: ["STUDENT"],
                    courseId: "",
                },
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual(
                paginationMock<UserResDto>([
                    userWithCoursesResponseMock("STUDENT", userWithCoursesMock.UserCourse[0].courseId),
                ]),
            )
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            jest.spyOn(userRepository, "getById").mockResolvedValueOnce(userWithCoursesMock)

            const result = await userService.getById(userWithCoursesMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(userWithCoursesResponseMock("STUDENT", userWithCoursesMock.UserCourse[0].courseId))
        })

        it("should throw UserNotFoundException", async () => {
            jest.spyOn(userRepository, "getById").mockResolvedValueOnce(null)
            await expect(userService.getById(userWithCoursesMock.id, requestMock.user.mainCourseId)).rejects.toThrow(
                UserNotFoundException,
            )
        })
    })

    describe("getByRegistration", () => {
        it("should return an user", async () => {
            jest.spyOn(userRepository, "getByRegistration").mockResolvedValueOnce(userWithCoursesMock)

            const result = await userService.getByRegistration(
                {
                    registration: userWithCoursesMock.registration,
                },
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual(userWithCoursesMock)
        })
    })

    describe("deleteById", () => {
        it("should delete an user", async () => {
            jest.spyOn(userService, "getById").mockResolvedValueOnce(userWithCoursesResponseMock())
            jest.spyOn(userRepository, "delete").mockResolvedValueOnce()

            const result = await userService.delete(userWithCoursesMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(userService.getById).toHaveBeenCalledWith(userWithCoursesMock.id, requestMock.user.mainCourseId)
            expect(userRepository.delete).toHaveBeenCalledWith(userWithCoursesMock.id, requestMock.user.mainCourseId)
        })
    })

    describe("removeFromCourse", () => {
        it("should remove an user from a course", async () => {
            jest.spyOn(userService, "getById").mockResolvedValueOnce(userWithCoursesResponseMock())
            jest.spyOn(userRepository, "removeFromCourse").mockResolvedValueOnce()

            const result = await userService.removeFromCourse(userWithCoursesMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(userService.getById).toHaveBeenCalledWith(userWithCoursesMock.id, requestMock.user.mainCourseId)
            expect(userRepository.removeFromCourse).toHaveBeenCalledWith(
                userWithCoursesMock.id,
                requestMock.user.mainCourseId,
            )
        })
    })

    describe("changeUserRole", () => {
        it("should change user role", async () => {
            const user = userWithCoursesResponseMock(UserRole.COORDINATOR)
            const dto = {
                courseId: user.userCourse[0].courseId,
                userRole: UserRole.TEACHER,
            }
            jest.spyOn(userService, "getById").mockResolvedValueOnce(user)
            jest.spyOn(userRepository, "changeUserRole").mockResolvedValueOnce({
                ...userWithCoursesMock,
                UserCourse: [
                    {
                        courseId: user.userCourse[0].courseId,
                        role: UserRole.COORDINATOR,
                        course: { name: "Course" },
                    },
                ],
            })

            const result = await userService.changeUserRole(userWithCoursesMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(user)
            expect(userService.getById).toHaveBeenCalledWith(userWithCoursesMock.id, requestMock.user.mainCourseId)
            expect(userRepository.changeUserRole).toHaveBeenCalledWith(
                userWithCoursesMock.id,
                dto,
                requestMock.user.mainCourseId,
            )
        })
    })

    describe("updateById", () => {
        it("should update an user", async () => {
            const user = userWithCoursesResponseMock()
            const dto = {
                name: user.name,
                registration: user.registration,
            }
            jest.spyOn(userService, "getById").mockResolvedValueOnce(user)
            jest.spyOn(userService, "updateById").mockResolvedValueOnce(user)

            const result = await userService.updateById(userWithCoursesMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(user)
        })
    })

    describe("createUserStudentByCsv", () => {
        it("should call repository with data from file and hashed password", async () => {
            jest.spyOn(userService as any, "hashPassword").mockResolvedValue("hashedPassword")
            jest.spyOn(userRepository, "createMany").mockResolvedValueOnce()

            const result = await userService.createUserStudentByCsv(
                makeMockFile("name,registration,password\nJohn,123,abc\nJane,456,def"),
                requestMock.user.mainCourseId,
            )

            expect(result).toBeUndefined()
            expect(userRepository.createMany).toHaveBeenCalledWith(
                [
                    { name: "John", registration: "123", password: "hashedPassword" },
                    { name: "Jane", registration: "456", password: "hashedPassword" },
                ],
                userWithCoursesMock.UserCourse[0].role,
                requestMock.user.mainCourseId,
            )
        })
    })
})
