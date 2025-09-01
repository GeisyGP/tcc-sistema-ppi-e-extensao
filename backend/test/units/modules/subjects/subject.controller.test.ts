import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { subjectMock } from "./mocks/subject.mock"
import { SubjectController } from "src/modules/subjects/controllers/subject.controller"
import { SubjectWithTeacherResDto } from "src/modules/subjects/types/dtos/responses/subject-with-teacher-res.dto"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"

describe("UserController", () => {
    let subjectService: SubjectService
    let subjectController: SubjectController

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                SubjectService,
                SubjectRepository,
                SubjectController,
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
        subjectController = moduleRef.get(SubjectController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should return a subject", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }
            jest.spyOn(subjectService, "create").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectController.create(dto, requestMock)

            expect(result).toEqual(
                baseResponseMock<SubjectWithTeacherResDto>(
                    "Subject created successfully",
                    subjectMock,
                ),
            )
            expect(subjectService.create).toHaveBeenCalledWith(dto)
        })
    })

    describe("getAll", () => {
        it("should return an array of subjects with pagination", async () => {
            jest.spyOn(subjectService, "getAll").mockResolvedValueOnce(
                paginationMock<SubjectWithTeacherResDto>([subjectMock]),
            )

            const result = await subjectController.getAll(
                {
                    limit: 30,
                    name: "",
                    teacherId: "",
                    page: 1,
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock(
                    "Subjects found successfully",
                    paginationMock<SubjectWithTeacherResDto>([subjectMock]),
                ),
            )
        })
    })

    describe("getById", () => {
        it("should return a subject", async () => {
            jest.spyOn(subjectService, "getById").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectController.getById(
                {
                    id: subjectMock.id,
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock<SubjectWithTeacherResDto>(
                    "Subject found successfully",
                    subjectMock,
                ),
            )
        })
    })

    describe("updateByID", () => {
        it("should return a subject", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }

            jest.spyOn(subjectService, "updateById").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectController.update(
                { id: subjectMock.id },
                dto,
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock<SubjectWithTeacherResDto>(
                    "Subject updated successfully",
                    subjectMock,
                ),
            )
        })
    })

    describe("delete", () => {
        it("should delete a subject", async () => {
            jest.spyOn(subjectService, "delete").mockResolvedValueOnce()

            const result = await subjectController.delete(
                {
                    id: subjectMock.id,
                },
                requestMock,
            )

            expect(result).toBeUndefined()
        })
    })
})
