import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { PPIController } from "src/modules/ppi/controllers/ppi.controller"
import { PPIService } from "src/modules/ppi/services/ppi.service"
import { PPIRepository } from "src/modules/ppi/repositories/ppi.repository"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { ppiResMock } from "./mocks/ppi.mock"
import { PPIResDto } from "src/modules/ppi/types/dtos/responses/ppi-res.dto"
import { UserService } from "src/modules/users/services/user.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"

describe("PPIController", () => {
    let ppiService: PPIService
    let ppiController: PPIController

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                PPIController,
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
        ppiController = moduleRef.get(PPIController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should return a ppi", async () => {
            const dto = {
                classPeriod: ppiResMock.classPeriod,
                workload: ppiResMock.workload,
                subjects: [{ workload: ppiResMock.subjects[0].workload, id: ppiResMock.subjects[0].id }],
            }
            jest.spyOn(ppiService, "create").mockResolvedValueOnce(ppiResMock)

            const result = await ppiController.create(dto, requestMock)

            expect(result).toEqual(baseResponseMock<PPIResDto>("PPI created successfully", ppiResMock))
            expect(ppiService.create).toHaveBeenCalledWith(dto, requestMock.user.mainCourseId)
        })
    })

    describe("getAll", () => {
        it("should return an array of ppis with pagination", async () => {
            jest.spyOn(ppiService, "getAll").mockResolvedValueOnce(paginationMock<PPIResDto>([ppiResMock]))

            const result = await ppiController.getAll(
                {
                    limit: 30,
                    classPeriod: "",
                    page: 1,
                },
                requestMock,
            )

            expect(result).toEqual(baseResponseMock("PPI found successfully", paginationMock<PPIResDto>([ppiResMock])))
        })
    })

    describe("getById", () => {
        it("should return a ppi", async () => {
            jest.spyOn(ppiService, "getById").mockResolvedValueOnce(ppiResMock)

            const result = await ppiController.getById(
                {
                    id: ppiResMock.id,
                },
                requestMock,
            )

            expect(result).toEqual(baseResponseMock<PPIResDto>("PPI found successfully", ppiResMock))
        })
    })

    describe("updateByID", () => {
        it("should return a ppi", async () => {
            const dto = {
                classPeriod: ppiResMock.classPeriod,
                workload: ppiResMock.workload,
            }

            jest.spyOn(ppiService, "updateById").mockResolvedValueOnce(ppiResMock)

            const result = await ppiController.update({ id: ppiResMock.id }, dto, requestMock)

            expect(result).toEqual(baseResponseMock<PPIResDto>("PPI updated successfully", ppiResMock))
        })
    })

    describe("updateSubjectPPIById", () => {
        it("should return a ppi", async () => {
            const dto = {
                subjects: [{ workload: ppiResMock.subjects[0].workload, id: ppiResMock.subjects[0].id }],
            }

            jest.spyOn(ppiService, "updateSubjectPPIById").mockResolvedValueOnce(ppiResMock)

            const result = await ppiController.updateSubjectPPIById({ id: ppiResMock.id }, dto, requestMock)

            expect(result).toEqual(baseResponseMock<PPIResDto>("PPI updated successfully", ppiResMock))
        })
    })

    describe("delete", () => {
        it("should delete a ppi", async () => {
            jest.spyOn(ppiService, "delete").mockResolvedValueOnce()

            const result = await ppiController.delete(
                {
                    id: ppiResMock.id,
                },
                requestMock,
            )

            expect(result).toBeUndefined()
        })
    })
})
