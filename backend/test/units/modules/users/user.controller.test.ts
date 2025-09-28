import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock, userResponseMock, userWithCoursesMock, userWithCoursesResponseMock } from "./mocks/user.mock"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { UserController } from "src/modules/users/controllers/user.controller"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { UserRole } from "src/common/enums/user-role.enum"
import { UserWithCoursesResDto } from "src/modules/users/types/dtos/responses/user-with-courses-res.dto"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { ROOT_COURSE_ID } from "src/common/constants"

describe("UserController", () => {
    let userService: UserService
    let userController: UserController

    beforeEach(async () => {
        jest.clearAllMocks()
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                CourseRepository,
                CourseService,
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
        userController = moduleRef.get(UserController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("createTeacher", () => {
        it("should return an user", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(userService, "create").mockResolvedValueOnce(userResponseMock)

            const result = await userController.createTeacher(dto, requestMock)

            expect(result).toEqual(baseResponseMock<UserResDto>("User created successfully", userResponseMock))
            expect(userService.create).toHaveBeenCalledWith(
                {
                    ...dto,
                    courseId: requestMock.user.mainCourseId,
                },
                UserRole.TEACHER,
                ROOT_COURSE_ID,
            )
        })
    })

    describe("createCoordinator", () => {
        it("should return an user", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(userService, "create").mockResolvedValueOnce(userResponseMock)

            const result = await userController.createCoordinator(dto, requestMock)

            expect(result).toEqual(baseResponseMock<UserResDto>("User created successfully", userResponseMock))
            expect(userService.create).toHaveBeenCalledWith(dto, UserRole.COORDINATOR, requestMock.user.mainCourseId)
        })
    })

    describe("createStudent", () => {
        it("should return an user", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(userService, "create").mockResolvedValueOnce(userResponseMock)

            const result = await userController.createStudent(dto, requestMock)

            expect(result).toEqual(baseResponseMock<UserResDto>("User created successfully", userResponseMock))
            expect(userService.create).toHaveBeenCalledWith(
                {
                    ...dto,
                    courseId: requestMock.user.mainCourseId,
                },
                UserRole.STUDENT,
                ROOT_COURSE_ID,
            )
        })
    })

    describe("createViewer", () => {
        it("should return an user", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(userService, "create").mockResolvedValueOnce(userResponseMock)

            const result = await userController.createViewer(dto, requestMock)

            expect(result).toEqual(baseResponseMock<UserResDto>("User created successfully", userResponseMock))
            expect(userService.create).toHaveBeenCalledWith(
                {
                    ...dto,
                    courseId: requestMock.user.mainCourseId,
                },
                UserRole.VIEWER,
                ROOT_COURSE_ID,
            )
        })
    })

    describe("getAll", () => {
        it("should return an array of users with pagination", async () => {
            const responseMock = userWithCoursesResponseMock()
            jest.spyOn(userService, "getAll").mockResolvedValueOnce(
                paginationMock<UserWithCoursesResDto>([responseMock]),
            )

            const result = await userController.getAll(
                {
                    limit: 30,
                    name: "",
                    page: 1,
                    role: ["STUDENT"],
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock("Users found successfully", paginationMock<UserWithCoursesResDto>([responseMock])),
            )
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            const responseMock = userWithCoursesResponseMock()
            jest.spyOn(userService, "getById").mockResolvedValueOnce(responseMock)

            const result = await userController.getById({ id: userMock.id }, requestMock)

            expect(result).toEqual(baseResponseMock<UserResDto>("User found successfully", responseMock))
        })
    })

    describe("getCurrent", () => {
        it("should return an user", async () => {
            const responseMock = userWithCoursesResponseMock()
            jest.spyOn(userService, "getById").mockResolvedValueOnce(responseMock)

            const result = await userController.getCurrent(requestMock)

            expect(result).toEqual(baseResponseMock<UserResDto>("User found successfully", responseMock))
        })
    })

    describe("deleteCoordinator", () => {
        it("should delete an user", async () => {
            jest.spyOn(userService, "delete").mockResolvedValueOnce()

            const result = await userController.deleteCoordinator({ id: userMock.id }, requestMock)

            expect(result).toBeUndefined()
        })
    })

    describe("deleteTeacher", () => {
        it("should remove an user from course", async () => {
            jest.spyOn(userService, "removeFromCourse").mockResolvedValueOnce()

            const result = await userController.deleteTeacher({ id: userMock.id }, requestMock)

            expect(result).toBeUndefined()
        })
    })

    describe("deleteStudent", () => {
        it("should delete an user", async () => {
            jest.spyOn(userService, "delete").mockResolvedValueOnce()

            const result = await userController.deleteStudent({ id: userMock.id }, requestMock)

            expect(result).toBeUndefined()
        })
    })

    describe("deleteViewer", () => {
        it("should remove an user from course", async () => {
            jest.spyOn(userService, "removeFromCourse").mockResolvedValueOnce()

            const result = await userController.deleteViewer({ id: userMock.id }, requestMock)

            expect(result).toBeUndefined()
        })
    })
})
