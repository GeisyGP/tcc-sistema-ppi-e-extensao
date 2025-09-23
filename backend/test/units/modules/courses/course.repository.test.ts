import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { courseMock } from "./mocks/course.mock"

describe("CourseRepository", () => {
    let courseRepository: CourseRepository
    let prismaService: PrismaService

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
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

        courseRepository = moduleRef.get(CourseRepository)
        prismaService = moduleRef.get(PrismaService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a course", async () => {
            const dto = {
                name: courseMock.name,
                degree: courseMock.degree,
                educationLevel: courseMock.educationLevel,
                modality: courseMock.modality,
                shift: courseMock.shift,
                technologicalAxis: courseMock.technologicalAxis,
            }
            jest.spyOn(prismaService.course, "create").mockResolvedValueOnce(courseMock)

            const result = await courseRepository.create(dto)

            expect(result).toEqual(courseMock)
            expect(prismaService.course.create).toHaveBeenCalledWith({
                data: {
                    name: dto.name,
                    technologicalAxis: dto.technologicalAxis,
                    educationLevel: dto.educationLevel,
                    degree: dto.degree,
                    modality: dto.modality,
                    shift: dto.shift,
                },
            })
        })
    })

    describe("getById", () => {
        it("should return a course", async () => {
            jest.spyOn(prismaService.course, "findUnique").mockResolvedValueOnce(courseMock)

            const result = await courseRepository.getById(courseMock.id)

            expect(result).toEqual(courseMock)
            expect(prismaService.course.findUnique).toHaveBeenCalledWith({
                where: { id: courseMock.id },
            })
        })
    })

    describe("getAll", () => {
        it("should return an array of course with pagination", async () => {
            const dto = {
                limit: 30,
                name: "",
                page: 1,
            }
            jest.spyOn(prismaService.course, "findMany").mockResolvedValueOnce([courseMock])
            jest.spyOn(prismaService.course, "count").mockResolvedValueOnce(1)

            const result = await courseRepository.getAll(dto)

            expect(result).toEqual({
                totalItems: 1,
                courses: [courseMock],
            })
            expect(prismaService.course.findMany).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                    id: {
                        in: undefined,
                    },
                },
                take: dto.limit,
                skip: dto.limit * (dto.page - 1),
                orderBy: [{ name: "asc" }],
            })
            expect(prismaService.course.count).toHaveBeenCalledWith({
                where: {
                    name: {
                        contains: dto.name,
                        mode: "insensitive",
                    },
                    id: {
                        in: undefined,
                    },
                },
            })
        })
    })

    describe("updateById", () => {
        it("should update a course", async () => {
            const dto = {
                name: courseMock.name,
                degree: courseMock.degree,
                educationLevel: courseMock.educationLevel,
                modality: courseMock.modality,
                shift: courseMock.shift,
                technologicalAxis: courseMock.technologicalAxis,
            }
            jest.spyOn(prismaService.course, "update").mockResolvedValueOnce(courseMock)

            const result = await courseRepository.updateById(courseMock.id, dto)

            expect(result).toEqual(courseMock)
            expect(prismaService.course.update).toHaveBeenCalledWith({
                where: { id: courseMock.id },
                data: {
                    name: dto.name,
                    technologicalAxis: dto.technologicalAxis,
                    educationLevel: dto.educationLevel,
                    degree: dto.degree,
                    modality: dto.modality,
                    shift: dto.shift,
                },
            })
        })
    })

    describe("deleteById", () => {
        it("should delete an course", async () => {
            jest.spyOn(prismaService.course, "delete").mockResolvedValueOnce(courseMock)

            const result = await courseRepository.deleteById(courseMock.id)

            expect(result).toBeUndefined()
            expect(prismaService.course.delete).toHaveBeenCalledWith({
                where: { id: courseMock.id },
            })
        })
    })
})
