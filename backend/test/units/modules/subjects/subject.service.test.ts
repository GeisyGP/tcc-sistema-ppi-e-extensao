import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { subjectMock, subjectResMock } from "./mocks/subject.mock"
import { SubjectWithTeacherResDto } from "src/modules/subjects/types/dtos/responses/subject-with-teacher-res.dto"
import { SubjectNotFoundException } from "src/common/exceptions/subject-not-found.exception"
import { userResponseMock } from "../users/mocks/user.mock"
import { UserRole } from "src/common/enums/user-role.enum"
import { TeacherNotFoundException } from "src/common/exceptions/teacher-not-found.exception"
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception"
import { CustomLoggerService } from "src/common/logger"

describe("SubjectService", () => {
    let userService: UserService
    let subjectService: SubjectService
    let subjectRepository: SubjectRepository

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                SubjectService,
                SubjectRepository,
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

        subjectService = moduleRef.get(SubjectService)
        subjectRepository = moduleRef.get(SubjectRepository)
        userService = moduleRef.get(UserService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a subject", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }
            jest.spyOn(userService, "getById").mockResolvedValueOnce(
                userResponseMock(UserRole.TEACHER),
            )
            jest.spyOn(subjectRepository, "create").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectService.create(dto)

            expect(result).toEqual(subjectResMock)
            expect(subjectRepository.create).toHaveBeenCalledWith(dto)
        })

        it("should throw TeacherNotFoundException when user is not a teacher", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }
            jest.spyOn(userService, "getById").mockResolvedValueOnce(
                userResponseMock(UserRole.STUDENT),
            )

            await expect(subjectService.create(dto)).rejects.toThrow(
                TeacherNotFoundException,
            )
        })

        it("should throw TeacherNotFoundException when user does not exist", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }
            jest.spyOn(userService, "getById").mockRejectedValueOnce(
                new UserNotFoundException(),
            )

            await expect(subjectService.create(dto)).rejects.toThrow(
                TeacherNotFoundException,
            )
        })
    })

    describe("getAll", () => {
        it("should return an array of subjects with pagination", async () => {
            jest.spyOn(subjectRepository, "getAll").mockResolvedValueOnce({
                totalItems: 1,
                subjects: [subjectMock],
            })

            const result = await subjectService.getAll({
                limit: 30,
                name: "",
                teacherId: "",
                page: 1,
            })

            expect(result).toEqual(
                paginationMock<SubjectWithTeacherResDto>([subjectResMock]),
            )
        })
    })

    describe("getById", () => {
        it("should return a subject", async () => {
            jest.spyOn(subjectRepository, "getById").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectService.getById(subjectMock.id)

            expect(result).toEqual(subjectResMock)
        })

        it("should throw SubjectNotFoundException", async () => {
            jest.spyOn(subjectRepository, "getById").mockResolvedValueOnce(null)
            await expect(
                subjectService.getById(subjectMock.id),
            ).rejects.toThrow(SubjectNotFoundException)
        })
    })

    describe("updateById", () => {
        it("should return an user", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }
            jest.spyOn(subjectService, "getById").mockResolvedValueOnce(
                subjectResMock,
            )
            jest.spyOn(userService, "getById").mockResolvedValueOnce(
                userResponseMock(UserRole.TEACHER),
            )
            jest.spyOn(subjectRepository, "updateById").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectService.updateById(subjectMock.id, dto)

            expect(result).toEqual(subjectResMock)
        })
    })

    describe("deleteById", () => {
        it("should delete an user", async () => {
            jest.spyOn(subjectService, "getById").mockResolvedValueOnce(
                subjectMock,
            )
            jest.spyOn(subjectRepository, "deleteById").mockResolvedValueOnce()

            const result = await subjectService.delete(subjectMock.id)

            expect(result).toBeUndefined()
            expect(subjectService.getById).toHaveBeenCalledWith(subjectMock.id)
            expect(subjectRepository.deleteById).toHaveBeenCalledWith(
                subjectMock.id,
            )
        })
    })
})
