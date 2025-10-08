import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { PPIRepository } from "src/modules/ppi/repositories/ppi.repository"
import { ppiMock, ppiResMock } from "./mocks/ppi.mock"

describe("PPIRepository", () => {
    let ppiRepository: PPIRepository
    let prismaService: PrismaService

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                PPIRepository,
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

        ppiRepository = moduleRef.get(PPIRepository)
        prismaService = moduleRef.get(PrismaService)

        jest.spyOn(prismaService, "$executeRawUnsafe").mockResolvedValue(1)
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
            jest.spyOn(prismaService.pPI, "create").mockResolvedValueOnce(ppiMock)

            const result = await ppiRepository.create(dto, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiMock)
            expect(prismaService.pPI.create).toHaveBeenCalledWith({
                data: {
                    classPeriod: dto.classPeriod,
                    workload: dto.workload,
                    courseId: requestMock.user.mainCourseId,
                    SubjectPPI: {
                        create: dto.subjects.map((subject: { id: string; workload: number }) => ({
                            subject: { connect: { id: subject.id } },
                            workload: subject.workload,
                        })),
                    },
                },
                include: {
                    SubjectPPI: {
                        include: {
                            subject: { select: { name: true } },
                        },
                    },
                },
            })
        })
    })

    describe("getById", () => {
        it("should return a ppi", async () => {
            jest.spyOn(prismaService.pPI, "findUnique").mockResolvedValueOnce(ppiMock)

            const result = await ppiRepository.getById(ppiMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiMock)
            expect(prismaService.pPI.findUnique).toHaveBeenCalledWith({
                where: { id: ppiMock.id },
                include: {
                    SubjectPPI: {
                        where: {
                            deletedAt: null,
                        },
                        include: {
                            subject: { select: { name: true } },
                        },
                    },
                },
            })
        })
    })

    describe("getAll", () => {
        it("should return an array of ppis with pagination", async () => {
            const dto = {
                limit: 30,
                classPeriod: "",
                page: 1,
            }
            jest.spyOn(prismaService.pPI, "findMany").mockResolvedValueOnce([ppiMock])
            jest.spyOn(prismaService.pPI, "count").mockResolvedValueOnce(1)

            const result = await ppiRepository.getAll(dto, requestMock.user.mainCourseId)

            expect(result).toEqual({
                totalItems: 1,
                ppis: [ppiMock],
            })
            expect(prismaService.pPI.findMany).toHaveBeenCalledWith({
                where: {
                    classPeriod: {
                        contains: dto.classPeriod,
                        mode: "insensitive",
                    },
                },
                take: dto.limit,
                skip: dto.limit * (dto.page - 1),
                orderBy: [{ classPeriod: "asc" }],
                include: {
                    SubjectPPI: {
                        where: {
                            deletedAt: null,
                        },
                        include: {
                            subject: { select: { name: true } },
                        },
                    },
                },
            })
            expect(prismaService.pPI.count).toHaveBeenCalledWith({
                where: {
                    classPeriod: {
                        contains: dto.classPeriod,
                        mode: "insensitive",
                    },
                },
            })
        })
    })

    describe("updateById", () => {
        it("should update a ppi", async () => {
            const dto = {
                classPeriod: ppiResMock.classPeriod,
                workload: ppiResMock.workload,
            }
            jest.spyOn(prismaService.pPI, "update").mockResolvedValueOnce(ppiMock)

            const result = await ppiRepository.updateById(ppiMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(ppiMock)
            expect(prismaService.pPI.update).toHaveBeenCalledWith({
                where: { id: ppiMock.id },
                data: {
                    classPeriod: dto.classPeriod,
                    workload: dto.workload,
                },
                include: {
                    SubjectPPI: {
                        where: {
                            deletedAt: null,
                        },
                        include: {
                            subject: { select: { name: true } },
                        },
                    },
                },
            })
        })
    })

    describe("updateSubjectPPIById", () => {
        it("should update a ppi", async () => {
            const dto = {
                subjects: [{ workload: ppiResMock.subjects[0].workload, id: ppiResMock.subjects[0].id }],
            }
            jest.spyOn(prismaService.subjectPPI, "deleteMany").mockResolvedValueOnce({ count: 1 })
            jest.spyOn(prismaService.subjectPPI, "upsert").mockResolvedValueOnce({
                workload: dto.subjects[0].workload,
                deletedAt: null,
                ppiId: ppiMock.id,
                subjectId: dto.subjects[0].id,
            })

            const result = await ppiRepository.updateSubjectPPIById(ppiMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(prismaService.subjectPPI.deleteMany).toHaveBeenCalledWith({
                where: {
                    ppiId: ppiMock.id,
                    subjectId: { notIn: dto.subjects.map((s) => s.id) },
                },
            })
            expect(prismaService.subjectPPI.upsert).toHaveBeenCalledWith({
                where: {
                    subjectId_ppiId: {
                        ppiId: ppiMock.id,
                        subjectId: dto.subjects[0].id,
                    },
                },
                update: {
                    workload: dto.subjects[0].workload,
                    deletedAt: null,
                },
                create: {
                    ppi: { connect: { id: ppiMock.id } },
                    subject: { connect: { id: dto.subjects[0].id } },
                    workload: dto.subjects[0].workload,
                },
                select: {},
            })
        })
    })

    describe("deleteById", () => {
        it("should delete a ppi", async () => {
            jest.spyOn(prismaService.pPI, "delete").mockResolvedValueOnce(ppiMock)

            const result = await ppiRepository.deleteById(ppiMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(prismaService.pPI.delete).toHaveBeenCalledWith({
                where: { id: ppiMock.id },
            })
        })
    })
})
