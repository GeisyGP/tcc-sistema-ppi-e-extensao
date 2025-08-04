import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock } from "./mocks/user.mock"

describe("UserRepository", () => {
    let userRepository: UserRepository
    let prismaService: PrismaService

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UserService, UserRepository, PrismaService],
        }).compile()

        userRepository = moduleRef.get(UserRepository)
        prismaService = moduleRef.get(PrismaService)
    })

    describe("create", () => {
        it("should create a user", async () => {
            const dto = {
                name: userMock.name,
                password: userMock.password,
                registration: userMock.registration,
                role: userMock.role,
            }
            jest.spyOn(prismaService.user, "create").mockResolvedValueOnce(
                userMock,
            )

            const result = await userRepository.create(dto)

            expect(result).toEqual(userMock)
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    registration: dto.registration,
                    name: dto.name,
                    role: dto.role,
                    password: dto.password,
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
            }
            jest.spyOn(prismaService.user, "findMany").mockResolvedValueOnce([
                userMock,
            ])
            jest.spyOn(prismaService.user, "count").mockResolvedValueOnce(1)

            const result = await userRepository.getAll(dto)

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
                },
                take: dto.limit,
                skip: dto.limit * (dto.page - 1),
                orderBy: [{ name: "asc" }],
            })
            expect(prismaService.user.count).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                },
            })
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce(
                userMock,
            )

            const result = await userRepository.getById(userMock.id)

            expect(result).toEqual(userMock)
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: userMock.id },
            })
        })
    })

    describe("getByRegistration", () => {
        it("should return an user", async () => {
            jest.spyOn(prismaService.user, "findUnique").mockResolvedValueOnce(
                userMock,
            )

            const result = await userRepository.getByRegistration(
                userMock.registration,
            )

            expect(result).toEqual(userMock)
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { registration: userMock.registration },
            })
        })
    })
})
