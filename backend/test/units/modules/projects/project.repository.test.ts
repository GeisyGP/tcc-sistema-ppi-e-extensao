import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { ProjectRepository } from "src/modules/projects/repositories/project.repository"
import { baseProjectMock } from "./mocks/project.mock"

describe("ProjectRepository", () => {
    let prismaService: PrismaService
    let projectRepository: ProjectRepository

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                ProjectRepository,
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

        projectRepository = moduleRef.get(ProjectRepository)
        prismaService = moduleRef.get(PrismaService)

        jest.spyOn(prismaService, "$executeRawUnsafe").mockResolvedValue(1)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a project", async () => {
            const dto = {
                class: baseProjectMock.class,
                currentYear: baseProjectMock.currentYear,
                topic: baseProjectMock.topic,
                ppiId: baseProjectMock.ppiId,
            }
            jest.spyOn(prismaService.project, "create").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.create(dto, requestMock.user.mainCourseId, requestMock.user.sub)

            expect(result).toEqual(baseProjectMock)
            expect(prismaService.project.create).toHaveBeenCalledTimes(1)
        })
    })

    describe("getFullById", () => {
        it("should return a project", async () => {
            jest.spyOn(prismaService.project, "findUnique").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.getFullById(baseProjectMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(baseProjectMock)
            expect(prismaService.project.findUnique).toHaveBeenCalledTimes(1)
        })
    })

    describe("getById", () => {
        it("should return a project", async () => {
            jest.spyOn(prismaService.project, "findUnique").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.getById(baseProjectMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(baseProjectMock)
            expect(prismaService.project.findUnique).toHaveBeenCalledTimes(1)
        })
    })

    describe("getAll", () => {
        it("should return an array of projects with pagination", async () => {
            const dto = {
                limit: 30,
                page: 1,
                ppiId: "",
                status: baseProjectMock.status,
                currentYear: "",
                class: "",
                topic: "",
                teacherId: "",
                studentId: "",
            }
            jest.spyOn(prismaService.project, "findMany").mockResolvedValueOnce([baseProjectMock])
            jest.spyOn(prismaService.project, "count").mockResolvedValueOnce(1)

            const result = await projectRepository.getAll(dto, requestMock.user.mainCourseId)

            expect(result).toEqual({
                totalItems: 1,
                projects: [baseProjectMock],
            })
            expect(prismaService.project.findMany).toHaveBeenCalledTimes(1)
            expect(prismaService.project.count).toHaveBeenCalledTimes(1)
        })
    })

    describe("updateById", () => {
        it("should update a project", async () => {
            const dto = {
                class: baseProjectMock.class,
                currentYear: baseProjectMock.currentYear,
                topic: baseProjectMock.topic,
            }
            jest.spyOn(prismaService.project, "update").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.updateById(
                baseProjectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
            )

            expect(result).toEqual(baseProjectMock)
            expect(prismaService.project.update).toHaveBeenCalledTimes(1)
        })
    })

    describe("updateContentById", () => {
        it("should update a project", async () => {
            const dto = {
                topic: baseProjectMock.topic,
                scope: baseProjectMock.scope,
                justification: baseProjectMock.justification,
                generalObjective: baseProjectMock.generalObjective,
                specificObjectives: baseProjectMock.specificObjectives,
                subjectsContributions: baseProjectMock.subjectsContributions,
                methodology: baseProjectMock.methodology,
                timeline: baseProjectMock.timeline,
            }
            jest.spyOn(prismaService.project, "update").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.updateContentById(
                baseProjectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
            )

            expect(result).toEqual(baseProjectMock)
            expect(prismaService.project.update).toHaveBeenCalledTimes(1)
        })
    })

    describe("changeStatus", () => {
        it("should update a project", async () => {
            const dto = {
                status: baseProjectMock.status,
            }
            jest.spyOn(prismaService.project, "update").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.changeStatus(
                baseProjectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
            )

            expect(result).toEqual(baseProjectMock)
            expect(prismaService.project.update).toHaveBeenCalledTimes(1)
        })
    })

    describe("deleteById", () => {
        it("should delete a project", async () => {
            jest.spyOn(prismaService.project, "delete").mockResolvedValueOnce(baseProjectMock)

            const result = await projectRepository.deleteById(baseProjectMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(prismaService.project.delete).toHaveBeenCalledWith({
                where: { id: baseProjectMock.id },
            })
        })
    })
})
