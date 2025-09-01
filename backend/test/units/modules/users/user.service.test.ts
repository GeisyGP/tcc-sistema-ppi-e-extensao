import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock, userResponseMock } from "./mocks/user.mock"
import { paginationMock } from "test/units/mocks"
import { UserExistsException } from "src/common/exceptions/user-exists.exception"
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"

describe("UserService", () => {
    let userService: UserService
    let userRepository: UserRepository

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

        userService = moduleRef.get(UserService)
        userRepository = moduleRef.get(UserRepository)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a user when registration does not exist", async () => {
            const dto = {
                name: userMock.name,
                password: userMock.password,
                registration: userMock.registration,
                role: userMock.role,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(
                null,
            )
            jest.spyOn(userRepository, "create").mockResolvedValueOnce(userMock)
            const hashSpy = jest
                .spyOn(userService as any, "hashPassword")
                .mockResolvedValueOnce("hashedPassword")

            const result = await userService.create(dto)

            expect(result).toEqual(userResponseMock())
            expect(userRepository.create).toHaveBeenCalledWith({
                ...dto,
                password: "hashedPassword",
            })
            expect(hashSpy).toHaveBeenCalledWith(dto.password)
        })

        it("should throw UserExistsException when registration already exists", async () => {
            const dto = {
                name: userMock.name,
                password: userMock.password,
                registration: userMock.registration,
                role: userMock.role,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(
                userMock,
            )

            await expect(userService.create(dto)).rejects.toThrow(
                UserExistsException,
            )
        })
    })

    describe("getAll", () => {
        it("should return an array of users with pagination", async () => {
            jest.spyOn(userRepository, "getAll").mockResolvedValueOnce({
                totalItems: 1,
                users: [userMock],
            })

            const result = await userService.getAll({
                limit: 30,
                name: "",
                page: 1,
                role: "STUDENT",
            })

            expect(result).toEqual(
                paginationMock<UserResDto>([userResponseMock()]),
            )
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            jest.spyOn(userRepository, "getById").mockResolvedValueOnce(
                userMock,
            )

            const result = await userService.getById(userMock.id)

            expect(result).toEqual(userResponseMock())
        })

        it("should throw UserNotFoundException", async () => {
            jest.spyOn(userRepository, "getById").mockResolvedValueOnce(null)
            await expect(userService.getById(userMock.id)).rejects.toThrow(
                UserNotFoundException,
            )
        })
    })

    describe("getByRegistration", () => {
        it("should return an user", async () => {
            jest.spyOn(
                userRepository,
                "getByRegistration",
            ).mockResolvedValueOnce(userMock)

            const result = await userService.getByRegistration({
                registration: userMock.registration,
            })

            expect(result).toEqual(userMock)
        })
    })

    describe("deleteById", () => {
        it("should delete an user", async () => {
            jest.spyOn(userService, "getById").mockResolvedValueOnce(userMock)
            jest.spyOn(userRepository, "delete").mockResolvedValueOnce()

            const result = await userService.delete(userMock.id)

            expect(result).toBeUndefined()
            expect(userService.getById).toHaveBeenCalledWith(userMock.id)
            expect(userRepository.delete).toHaveBeenCalledWith(userMock.id)
        })
    })
})
