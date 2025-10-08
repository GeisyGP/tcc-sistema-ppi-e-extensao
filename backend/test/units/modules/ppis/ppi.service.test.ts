import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { PPIRepository } from "src/modules/ppi/repositories/ppi.repository"
import { PPIService } from "src/modules/ppi/services/ppi.service"
import { ppiMock, ppiResMock } from "./mocks/ppi.mock"
import { PPIResDto } from "src/modules/ppi/types/dtos/responses/ppi-res.dto"
import { PPINotFoundException } from "src/common/exceptions/ppi-not-found.exception"
import { subjectMock } from "../subjects/mocks/subject.mock"

describe("PPIService", () => {
    let ppiService: PPIService
    let ppiRepository: PPIRepository
    let subjectService: SubjectService

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                PPIService,
                PPIRepository,
                SubjectService,
                SubjectRepository,
                UserService,
                UserRepository,
                CourseService,
                CourseRepository,
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

        ppiService = moduleRef.get(PPIService)
        ppiRepository = moduleRef.get(PPIRepository)
        subjectService = moduleRef.get(SubjectService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a ppi", async () => {
            const dto = {
                classPeriod: ppiResMock.classPeriod,
                workload: ppiResMock.workload,
                subjects: [{ workload: ppiResMock.subjects[0].workload, id: ppiResMock.subjects[0].id }],
            }
            jest.spyOn(subjectService, "getById").mockResolvedValue(subjectMock)
            jest.spyOn(ppiRepository, "create").mockResolvedValueOnce(ppiMock)

            const result = await ppiService.create(dto, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiResMock)
            expect(ppiRepository.create).toHaveBeenCalledWith(dto, requestMock.user.mainCourseId)
            expect(subjectService.getById).toHaveBeenCalledTimes(1)
        })
    })

    describe("getAll", () => {
        it("should return an array of ppis with pagination", async () => {
            jest.spyOn(ppiRepository, "getAll").mockResolvedValueOnce({
                totalItems: 1,
                ppis: [ppiMock],
            })

            const result = await ppiService.getAll(
                {
                    limit: 30,
                    classPeriod: "",
                    page: 1,
                },
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual(paginationMock<PPIResDto>([ppiResMock]))
        })
    })

    describe("getById", () => {
        it("should return a ppi", async () => {
            jest.spyOn(ppiRepository, "getById").mockResolvedValueOnce(ppiMock)

            const result = await ppiService.getById(ppiMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiResMock)
        })

        it("should throw PPINotFoundException", async () => {
            jest.spyOn(ppiRepository, "getById").mockResolvedValueOnce(null)
            await expect(ppiService.getById(ppiMock.id, requestMock.user.mainCourseId)).rejects.toThrow(
                PPINotFoundException,
            )
        })
    })

    describe("updateById", () => {
        it("should return a ppi", async () => {
            const dto = {
                classPeriod: ppiResMock.classPeriod,
                workload: ppiResMock.workload,
            }
            jest.spyOn(ppiService, "getById").mockResolvedValueOnce(ppiResMock)
            jest.spyOn(ppiRepository, "updateById").mockResolvedValueOnce(ppiMock)

            const result = await ppiService.updateById(ppiMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiResMock)
        })
    })

    describe("updateSubjectPPIById", () => {
        it("should return a ppi", async () => {
            const dto = {
                subjects: [{ workload: ppiResMock.subjects[0].workload, id: ppiResMock.subjects[0].id }],
            }
            jest.spyOn(subjectService, "getById").mockResolvedValue(subjectMock)
            jest.spyOn(ppiService, "getById").mockResolvedValue(ppiResMock)
            jest.spyOn(ppiRepository, "updateSubjectPPIById").mockResolvedValueOnce()

            const result = await ppiService.updateSubjectPPIById(ppiMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiResMock)
            expect(ppiService.getById).toHaveBeenCalledTimes(2)
            expect(subjectService.getById).toHaveBeenCalledTimes(1)
        })
    })

    describe("deleteById", () => {
        it("should delete a ppi", async () => {
            jest.spyOn(ppiService, "getById").mockResolvedValue(ppiResMock)
            jest.spyOn(ppiRepository, "deleteById").mockResolvedValueOnce()

            const result = await ppiService.delete(ppiMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(ppiService.getById).toHaveBeenCalledWith(ppiMock.id, requestMock.user.mainCourseId)
            expect(ppiRepository.deleteById).toHaveBeenCalledWith(ppiMock.id, requestMock.user.mainCourseId)
        })
    })
})
