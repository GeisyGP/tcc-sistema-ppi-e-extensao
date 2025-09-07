import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock, userResponseMock } from "./mocks/user.mock"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { UserController } from "src/modules/users/controllers/user.controller"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"

describe("UserController", () => {
    let userService: UserService
    let userController: UserController

    beforeEach(async () => {
        jest.clearAllMocks()
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
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
        userController = moduleRef.get(UserController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should return an user", async () => {
            const responseMock = userResponseMock()
            const dto = {
                name: userMock.name,
                password: userMock.password,
                registration: userMock.registration,
                role: userMock.role,
                courseId: userMock.courseId[0],
            }
            jest.spyOn(userService, "create").mockResolvedValueOnce(
                responseMock,
            )

            const result = await userController.create(dto, requestMock)

            expect(result).toEqual(
                baseResponseMock<UserResDto>(
                    "User created successfully",
                    responseMock,
                ),
            )
            expect(userService.create).toHaveBeenCalledWith(dto)
        })
    })

    describe("getAll", () => {
        it("should return an array of users with pagination", async () => {
            const responseMock = userResponseMock()
            jest.spyOn(userService, "getAll").mockResolvedValueOnce(
                paginationMock<UserResDto>([responseMock]),
            )

            const result = await userController.getAll(
                {
                    limit: 30,
                    name: "",
                    page: 1,
                    role: "STUDENT",
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock(
                    "Users found successfully",
                    paginationMock<UserResDto>([responseMock]),
                ),
            )
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            const responseMock = userResponseMock()
            jest.spyOn(userService, "getById").mockResolvedValueOnce(
                responseMock,
            )

            const result = await userController.getById(
                { id: userMock.id },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock<UserResDto>(
                    "User found successfully",
                    responseMock,
                ),
            )
        })
    })

    describe("getCurrent", () => {
        it("should return an user", async () => {
            const responseMock = userResponseMock()
            jest.spyOn(userService, "getById").mockResolvedValueOnce(
                responseMock,
            )

            const result = await userController.getCurrent(requestMock)

            expect(result).toEqual(
                baseResponseMock<UserResDto>(
                    "User found successfully",
                    responseMock,
                ),
            )
        })
    })

    describe("delete", () => {
        it("should delete an user", async () => {
            jest.spyOn(userService, "delete").mockResolvedValueOnce()

            const result = await userController.delete(
                { id: userMock.id },
                requestMock,
            )

            expect(result).toBeUndefined()
        })
    })
})
