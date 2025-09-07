import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"
import { Test } from "@nestjs/testing"
import { UserService } from "src/modules/users/services/user.service"
import { userMock } from "../users/mocks/user.mock"
import { loginResMock } from "./mocks/authentication.mock"
import { AuthenticationService } from "src/modules/authentication/services/authentication.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UnauthorizedException } from "@nestjs/common"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"

describe("AuthenticationService", () => {
    let authenticationService: AuthenticationService
    let userService: UserService
    let jwtService: JwtService

    beforeEach(async () => {
        jest.clearAllMocks()
        const moduleRef = await Test.createTestingModule({
            providers: [
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
                registration: userMock.registration,
                password: userMock.password,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(
                userMock,
            )
            jest.spyOn(bcrypt, "compare").mockImplementation(() => true)
            jest.spyOn(jwtService, "signAsync").mockResolvedValueOnce(
                loginResMock.accessToken,
            )

            const result = await authenticationService.login(dto)

            expect(result).toEqual(loginResMock)
            expect(userService.getByRegistration).toHaveBeenCalledWith({
                registration: dto.registration,
            })
            expect(bcrypt.compare).toHaveBeenCalledWith(
                dto.password,
                userMock.password,
            )
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: userMock.id,
                role: userMock.role,
                name: userMock.name,
                courseId: userMock.courseId,
            })
        })

        it("should throw UnauthorizedException when registration not exists", async () => {
            const dto = {
                registration: "some-registration",
                password: userMock.password,
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(
                null,
            )

            await expect(authenticationService.login(dto)).rejects.toThrow(
                UnauthorizedException,
            )
        })

        it("should throw UnauthorizedException when password does not match", async () => {
            const dto = {
                registration: userMock.registration,
                password: "invalid password",
            }
            jest.spyOn(userService, "getByRegistration").mockResolvedValueOnce(
                userMock,
            )
            jest.spyOn(bcrypt, "compare").mockImplementation(() => false)

            await expect(authenticationService.login(dto)).rejects.toThrow(
                UnauthorizedException,
            )
        })
    })
})
