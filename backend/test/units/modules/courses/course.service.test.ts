import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { courseMock, courseResMock } from "./mocks/course.mock"
import { CourseResDto } from "src/modules/courses/types/dtos/responses/course-res.dto"
import { CourseNotFoundException } from "src/common/exceptions/course-not-found.exception"

describe("CourseService", () => {
    let courseService: CourseService
    let courseRepository: CourseRepository

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
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

        courseService = moduleRef.get(CourseService)
        courseRepository = moduleRef.get(CourseRepository)
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
            jest.spyOn(courseRepository, "create").mockResolvedValueOnce(courseMock)

            const result = await courseService.create(dto)

            expect(result).toEqual(courseResMock)
            expect(courseRepository.create).toHaveBeenCalledWith(dto)
        })
    })

    describe("getAll", () => {
        it("should return an array of courses with pagination", async () => {
            jest.spyOn(courseRepository, "getAll").mockResolvedValueOnce({
                totalItems: 1,
                courses: [courseMock],
            })

            const result = await courseService.getAll({
                limit: 30,
                name: "",
                page: 1,
            })

            expect(result).toEqual(paginationMock<CourseResDto>([courseResMock]))
        })
    })

    describe("getById", () => {
        it("should return a course", async () => {
            jest.spyOn(courseRepository, "getById").mockResolvedValueOnce(courseMock)

            const result = await courseService.getById(courseMock.id)

            expect(result).toEqual(courseResMock)
        })

        it("should throw CourseNotFoundException", async () => {
            jest.spyOn(courseRepository, "getById").mockResolvedValueOnce(null)
            await expect(courseService.getById(courseMock.id)).rejects.toThrow(CourseNotFoundException)
        })
    })

    describe("updateById", () => {
        it("should return a course", async () => {
            const dto = {
                name: courseMock.name,
                degree: courseMock.degree,
                educationLevel: courseMock.educationLevel,
                modality: courseMock.modality,
                shift: courseMock.shift,
                technologicalAxis: courseMock.technologicalAxis,
            }
            jest.spyOn(courseService, "getById").mockResolvedValueOnce(courseResMock)
            jest.spyOn(courseRepository, "updateById").mockResolvedValueOnce(courseMock)

            const result = await courseService.updateById(courseMock.id, dto)

            expect(result).toEqual(courseResMock)
        })
    })

    describe("deleteById", () => {
        it("should delete a course", async () => {
            jest.spyOn(courseService, "getById").mockResolvedValueOnce(courseMock)
            jest.spyOn(courseRepository, "deleteById").mockResolvedValueOnce()

            const result = await courseService.deleteById(courseMock.id)

            expect(result).toBeUndefined()
            expect(courseService.getById).toHaveBeenCalledWith(courseMock.id)
            expect(courseRepository.deleteById).toHaveBeenCalledWith(courseMock.id)
        })
    })
})
