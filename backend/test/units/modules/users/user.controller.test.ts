import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock, userResponseMock } from "./mocks/user.mock"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { UserController } from "src/modules/users/controllers/user.controller"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"

describe("UserController", () => {
    let userService: UserService
    let userController: UserController

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService, UserRepository, PrismaService],
        }).compile()

        userService = moduleRef.get(UserService)
        userController = moduleRef.get(UserController)
    })

    describe("create", () => {
        it("should return an user", async () => {
            const dto = {
                name: userMock.name,
                password: userMock.password,
                registration: userMock.registration,
                role: userMock.role,
            }
            jest.spyOn(userService, "create").mockResolvedValueOnce(
                userResponseMock,
            )

            const result = await userController.create(dto)

            expect(result).toEqual(
                baseResponseMock<UserResDto>(
                    "User created successfully",
                    userResponseMock,
                ),
            )
            expect(userService.create).toHaveBeenCalledWith(dto)
        })
    })

    describe("getAll", () => {
        it("should return an array of users with pagination", async () => {
            jest.spyOn(userService, "getAll").mockResolvedValueOnce(
                paginationMock<UserResDto>([userResponseMock]),
            )

            const result = await userController.getAll({
                limit: 30,
                name: "",
                page: 1,
            })

            expect(result).toEqual(
                baseResponseMock(
                    "Users found successfully",
                    paginationMock<UserResDto>([userResponseMock]),
                ),
            )
        })
    })

    describe("getById", () => {
        it("should return an user", async () => {
            jest.spyOn(userService, "getById").mockResolvedValueOnce(
                userResponseMock,
            )

            const result = await userController.getById({ id: userMock.id })

            expect(result).toEqual(
                baseResponseMock<UserResDto>(
                    "User found successfully",
                    userResponseMock,
                ),
            )
        })
    })
})
