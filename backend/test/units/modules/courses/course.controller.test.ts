import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseController } from "src/modules/courses/controllers/course.controller"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { courseMock, courseResMock } from "./mocks/course.mock"
import { CreateCourseReqDto } from "src/modules/courses/types/dtos/requests/create-course-req.dto"
import { CourseResDto } from "src/modules/courses/types/dtos/responses/course-res.dto"

describe("CourseController", () => {
    let courseService: CourseService
    let courseController: CourseController

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                CourseController,
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
        courseController = moduleRef.get(CourseController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should return a course", async () => {
            const dto: CreateCourseReqDto = {
                name: courseMock.name,
                degree: courseMock.degree,
                educationLevel: courseMock.educationLevel,
                modality: courseMock.modality,
                shift: courseMock.shift,
                technologicalAxis: courseMock.technologicalAxis,
            }
            jest.spyOn(courseService, "create").mockResolvedValueOnce(courseResMock)

            const result = await courseController.create(dto, requestMock)

            expect(result).toEqual(baseResponseMock<CourseResDto>("Course created successfully", courseResMock))
            expect(courseService.create).toHaveBeenCalledWith(dto)
        })
    })

    describe("getAll", () => {
        it("should return an array of courses with pagination", async () => {
            jest.spyOn(courseService, "getAll").mockResolvedValueOnce(paginationMock<CourseResDto>([courseMock]))

            const result = await courseController.getAll(
                {
                    limit: 30,
                    name: "",
                    page: 1,
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock("Courses found successfully", paginationMock<CourseResDto>([courseMock])),
            )
        })
    })

    describe("getById", () => {
        it("should return a course", async () => {
            jest.spyOn(courseService, "getById").mockResolvedValueOnce(courseMock)

            const result = await courseController.getById(
                {
                    id: courseMock.id,
                },
                requestMock,
            )

            expect(result).toEqual(baseResponseMock<CourseResDto>("Course found successfully", courseMock))
        })
    })

    describe("updateByID", () => {
        it("should return a course", async () => {
            const dto = {
                name: courseMock.name,
                degree: courseMock.degree,
                educationLevel: courseMock.educationLevel,
                modality: courseMock.modality,
                shift: courseMock.shift,
                technologicalAxis: courseMock.technologicalAxis,
            }

            jest.spyOn(courseService, "updateById").mockResolvedValueOnce(courseMock)

            const result = await courseController.update({ id: courseMock.id }, dto, requestMock)

            expect(result).toEqual(baseResponseMock<CourseResDto>("Course updated successfully", courseMock))
        })
    })

    describe("delete", () => {
        it("should delete a course", async () => {
            jest.spyOn(courseService, "deleteById").mockResolvedValueOnce()

            const result = await courseController.delete(
                {
                    id: courseMock.id,
                },
                requestMock,
            )

            expect(result).toBeUndefined()
        })
    })
})
