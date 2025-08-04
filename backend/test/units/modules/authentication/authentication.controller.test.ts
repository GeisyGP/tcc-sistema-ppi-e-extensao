import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import { AuthenticationController } from "src/modules/authentication/controllers/authentication.controller"
import { AuthenticationService } from "src/modules/authentication/services/authentication.service"
import { UserService } from "src/modules/users/services/user.service"
import { userMock } from "../users/mocks/user.mock"
import { loginResMock } from "./mocks/authentication.mock"
import { PrismaService } from "src/config/prisma.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"

describe("AuthenticationController", () => {
    let authenticationService: AuthenticationService
    let authenticationController: AuthenticationController

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [
                AuthenticationService,
                UserService,
                UserRepository,
                PrismaService,
                JwtService,
            ],
        }).compile()

        authenticationService = moduleRef.get(AuthenticationService)
        authenticationController = moduleRef.get(AuthenticationController)
    })

    describe("login", () => {
        it("should return access token", async () => {
            const dto = {
                registration: userMock.registration,
                password: userMock.password,
            }
            jest.spyOn(authenticationService, "login").mockResolvedValueOnce(
                loginResMock,
            )

            const result = await authenticationController.login(dto)

            expect(result).toEqual(loginResMock)
            expect(authenticationService.login).toHaveBeenCalledWith(dto)
        })
    })
})
