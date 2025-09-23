import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock, userWithCoursesMock } from "./mocks/user.mock"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { UserRole } from "src/common/enums/user-role.enum"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"

describe("UserRepository", () => {
    let userRepository: UserRepository
    let prismaService: PrismaService

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
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

        userRepository = moduleRef.get(UserRepository)
        prismaService = moduleRef.get(PrismaService)

        jest.spyOn(prismaService, "$executeRawUnsafe").mockResolvedValue(1)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a user", async () => {
            const dto = {
                name: userWithCoursesMock.name,
                password: userWithCoursesMock.password,
                registration: userWithCoursesMock.registration,
                courseId: userWithCoursesMock.UserCourse[0].courseId,
            }
            jest.spyOn(prismaService.user, "upsert").mockResolvedValueOnce(userMock)

            const result = await userRepository.create(
                dto,
                userWithCoursesMock.UserCourse[0].role,
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual(userMock)
            expect(prismaService.user.upsert).toHaveBeenCalledWith({
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
                            role: userWithCoursesMock.UserCourse[0].role,
                        },
                    },
                },
                update: {
                    UserCourse: {
                        create: {
                            courseId: dto.courseId,
                            role: userWithCoursesMock.UserCourse[0].role,
                        },
                    },
                },
            })
        })
    })

    describe("getAll", () => {
        it("should return an array of users with pagination", async () => {
            const dto = {
                limit: 30,
                name: "",
                page: 1,
                role: UserRole.STUDENT,
            }
            jest.spyOn(prismaService.user, "findMany").mockResolvedValueOnce([userMock])
            jest.spyOn(prismaService.user, "count").mockResolvedValueOnce(1)

            const result = await userRepository.getAll(dto, requestMock.user.mainCourseId)

            expect(result).toEqual({
                totalItems: 1,
                users: [userMock],
            })
            expect(prismaService.user.findMany).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                    role: "STUDENT",
                },
                take: dto.limit,
                skip: dto.limit * (dto.page - 1),
                orderBy: [{ name: "asc" }],
                include: { UserCourse: true },
            })
            expect(prismaService.user.count).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                    role: "STUDENT",
                },
            })
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce(userMock)

            const result = await userRepository.getById(userMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(userMock)
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: userMock.id },
                include: { UserCourse: true },
            })
        })
    })

    describe("getByRegistration", () => {
        it("should return an user", async () => {
            jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce(userMock)

            const result = await userRepository.getByRegistration(userMock.registration, requestMock.user.mainCourseId)

            expect(result).toEqual(userMock)
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { registration: userMock.registration },
                include: { UserCourse: true },
            })
        })
    })

    describe("delete", () => {
        it("should delete an user", async () => {
            jest.spyOn(prismaService.user, "delete").mockResolvedValueOnce(userMock)

            const result = await userRepository.delete(userMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(prismaService.user.delete).toHaveBeenCalledWith({
                where: { id: userMock.id },
            })
        })
    })

    describe("removeFromCourse", () => {
        it("should remove an user from a course", async () => {
            jest.spyOn(prismaService.user, "update").mockResolvedValueOnce(userMock)

            const result = await userRepository.removeFromCourse(userMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: userMock.id },
                data: {
                    UserCourse: {
                        delete: {
                            userId_courseId: {
                                userId: userMock.id,
                                courseId: requestMock.user.mainCourseId,
                            },
                        },
                    },
                },
            })
        })
    })
})
