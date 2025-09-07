import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { UserService } from "src/modules/users/services/user.service"
import { subjectMock } from "./mocks/subject.mock"
import { CustomLoggerService } from "src/common/logger"

describe("SubjectRepository", () => {
    let subjectRepository: SubjectRepository
    let prismaService: PrismaService

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

        subjectRepository = moduleRef.get(SubjectRepository)
        prismaService = moduleRef.get(PrismaService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a subject", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
                courseId: subjectMock.courseId,
            }
            jest.spyOn(prismaService.subject, "create").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectRepository.create(dto)

            expect(result).toEqual(subjectMock)
            expect(prismaService.subject.create).toHaveBeenCalledWith({
                data: {
                    name: dto.name,
                    teachers: {
                        connect: dto.teachers.map((teacherId: string) => ({
                            id: teacherId,
                        })),
                    },
                    courseId: dto.courseId,
                },
                include: {
                    teachers: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        })
    })

    describe("getById", () => {
        it("should return a subject", async () => {
            jest.spyOn(
                prismaService.subject,
                "findUnique",
            ).mockResolvedValueOnce(subjectMock)

            const result = await subjectRepository.getById(subjectMock.id)

            expect(result).toEqual(subjectMock)
            expect(prismaService.subject.findUnique).toHaveBeenCalledWith({
                where: { id: subjectMock.id },
                include: {
                    teachers: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        })
    })

    describe("getAll", () => {
        it("should return an array of subject with pagination", async () => {
            const dto = {
                limit: 30,
                name: "",
                teacherId: "",
                page: 1,
            }
            jest.spyOn(prismaService.subject, "findMany").mockResolvedValueOnce(
                [subjectMock],
            )
            jest.spyOn(prismaService.subject, "count").mockResolvedValueOnce(1)

            const result = await subjectRepository.getAll(dto)

            expect(result).toEqual({
                totalItems: 1,
                subjects: [subjectMock],
            })
            expect(prismaService.subject.findMany).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                    teachers: dto.teacherId
                        ? { some: { id: dto.teacherId } }
                        : undefined,
                },
                take: dto.limit,
                skip: dto.limit * (dto.page - 1),
                orderBy: [{ name: "asc" }],
                include: {
                    teachers: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
            expect(prismaService.subject.count).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                    teachers: dto.teacherId
                        ? { some: { id: dto.teacherId } }
                        : undefined,
                },
            })
        })
    })

    describe("updateById", () => {
        it("should update a subject", async () => {
            const dto = {
                name: subjectMock.name,
                teachers: [subjectMock.teachers[0].id],
            }
            jest.spyOn(prismaService.subject, "update").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectRepository.updateById(
                subjectMock.id,
                dto,
            )

            expect(result).toEqual(subjectMock)
            expect(prismaService.subject.update).toHaveBeenCalledWith({
                where: { id: subjectMock.id },
                data: {
                    name: dto.name,
                    teachers: {
                        set: dto.teachers.map((teacherId: string) => ({
                            id: teacherId,
                        })),
                    },
                },
                include: {
                    teachers: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })
        })
    })

    describe("deleteById", () => {
        it("should delete an subject", async () => {
            jest.spyOn(prismaService.subject, "delete").mockResolvedValueOnce(
                subjectMock,
            )

            const result = await subjectRepository.deleteById(subjectMock.id)

            expect(result).toBeUndefined()
            expect(prismaService.subject.delete).toHaveBeenCalledWith({
                where: { id: subjectMock.id },
            })
        })
    })
})
