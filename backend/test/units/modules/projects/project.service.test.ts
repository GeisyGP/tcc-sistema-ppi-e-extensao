import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { PPIRepository } from "src/modules/ppis/repositories/ppi.repository"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { ProjectService } from "src/modules/projects/services/project.service"
import { ProjectRepository } from "src/modules/projects/repositories/project.repository"
import { UserService } from "src/modules/users/services/user.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import {
    baseProjectOverviewResMock,
    projectFullResMock,
    projectMock,
    projectOverviewResMock,
    projectResMock,
} from "./mocks/project.mock"
import { ppiResMock } from "../ppis/mocks/ppi.mock"
import { ProjectNotFoundException } from "src/common/exceptions/project-not-found.exception"
import { ProjectResDto } from "src/modules/projects/types/dtos/responses/project-res.dto"
import { ProjectIsFinishedException } from "src/common/exceptions/project-is-finished.exception"
import { ProjectStatus } from "src/common/enums/project-status.enum"
import { UserRole } from "src/common/enums/user-role.enum"
import { ForbiddenException } from "@nestjs/common"
import { subjectResMock } from "../subjects/mocks/subject.mock"
import { DeliverableService } from "src/modules/deliverable/services/deliverable.service"
import { DeliverableRepository } from "src/modules/deliverable/repositories/deliverable.repository"

describe("ProjectService", () => {
    let ppiService: PPIService
    let subjectService: SubjectService
    let projectService: ProjectService
    let projectRepository: ProjectRepository

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                ProjectService,
                ProjectRepository,
                PPIService,
                PPIRepository,
                SubjectService,
                SubjectRepository,
                UserService,
                UserRepository,
                CourseService,
                CourseRepository,
                DeliverableService,
                DeliverableRepository,
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
        subjectService = moduleRef.get(SubjectService)
        projectService = moduleRef.get(ProjectService)
        projectRepository = moduleRef.get(ProjectRepository)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a project", async () => {
            const dto = {
                class: projectMock.class,
                executionPeriod: projectMock.executionPeriod,
                theme: projectMock.theme,
                ppiId: projectMock.ppiId,
                campusDirector: projectMock.campusDirector,
                academicDirector: projectMock.academicDirector,
            }
            jest.spyOn(ppiService, "getById").mockResolvedValue(ppiResMock)
            jest.spyOn(projectRepository, "create").mockResolvedValueOnce(projectMock)

            const result = await projectService.create(dto, requestMock.user.mainCourseId, requestMock.user.sub)

            expect(result).toEqual(projectResMock)
            expect(projectRepository.create).toHaveBeenCalledWith(
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
            )
            expect(ppiService.getById).toHaveBeenCalledTimes(1)
        })
    })

    describe("getById", () => {
        it("should return a project", async () => {
            jest.spyOn(projectRepository, "getById").mockResolvedValueOnce(projectMock)

            const result = await projectService.getById(projectMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(projectResMock)
        })

        it("should throw ProjectNotFoundException", async () => {
            jest.spyOn(projectRepository, "getById").mockResolvedValueOnce(null)
            await expect(projectService.getById(projectMock.id, requestMock.user.mainCourseId)).rejects.toThrow(
                ProjectNotFoundException,
            )
        })
    })

    describe("getOverview", () => {
        it("should return a project", async () => {
            jest.spyOn(projectRepository, "getOverview").mockResolvedValueOnce(baseProjectOverviewResMock)

            const result = await projectService.getOverview(projectMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(projectOverviewResMock)
        })

        it("should throw ProjectNotFoundException", async () => {
            jest.spyOn(projectRepository, "getOverview").mockResolvedValueOnce(null)
            await expect(projectService.getOverview(projectMock.id, requestMock.user.mainCourseId)).rejects.toThrow(
                ProjectNotFoundException,
            )
        })
    })

    describe("getFullById", () => {
        it("should return a project", async () => {
            jest.spyOn(projectRepository, "getFullById").mockResolvedValueOnce(projectFullResMock)

            const result = await projectService.getFullById(
                projectMock.id,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual({
                ...projectFullResMock,
                userHasCoordinatorAccess: true,
                userHasDefaultAccess: true,
            })
        })

        it("should throw ProjectNotFoundException", async () => {
            jest.spyOn(projectRepository, "getFullById").mockResolvedValueOnce(null)
            await expect(
                projectService.getFullById(
                    projectMock.id,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    requestMock.user.mainRole,
                ),
            ).rejects.toThrow(ProjectNotFoundException)
        })
    })

    describe("getAll", () => {
        it("should return an array of projects with pagination", async () => {
            jest.spyOn(projectRepository, "getAll").mockResolvedValueOnce({
                totalItems: 1,
                projects: [projectMock],
            })

            const result = await projectService.getAll(
                {
                    limit: 30,
                    page: 1,
                    ppiId: "",
                    status: projectMock.status,
                    executionPeriod: "",
                    class: "",
                    theme: "",
                    teacherId: "",
                    studentId: "",
                },
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual(paginationMock<ProjectResDto>([projectResMock]))
        })
    })

    describe("updateById", () => {
        const dto = {
            class: projectMock.class,
            executionPeriod: projectMock.executionPeriod,
            theme: projectMock.theme,
            campusDirector: projectMock.campusDirector,
            academicDirector: projectMock.academicDirector,
        }
        it("should return a project", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectRepository, "updateById").mockResolvedValueOnce(projectMock)

            const result = await projectService.updateById(
                projectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual(projectResMock)
        })

        it("should throw ProjectIsFinishedException", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce({
                ...projectResMock,
                status: ProjectStatus.FINISHED,
            })
            await expect(
                projectService.updateById(
                    projectMock.id,
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    requestMock.user.mainRole,
                ),
            ).rejects.toThrow(ProjectIsFinishedException)
        })

        it("should throw ForbiddenException", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectService, "getAll").mockResolvedValueOnce({
                items: [],
                metadata: { itemsPerPage: 1, page: 1, totalItems: 0, totalPages: 1 },
            })
            await expect(
                projectService.updateById(
                    projectMock.id,
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    UserRole.TEACHER,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("updateContentByID", () => {
        const dto = {
            theme: projectFullResMock.theme,
            scope: projectFullResMock.scope,
            justification: projectFullResMock.justification,
            generalObjective: projectFullResMock.generalObjective,
            specificObjectives: projectFullResMock.specificObjectives,
            subjectsContributions: projectFullResMock.subjectsContributions,
            methodology: projectFullResMock.methodology,
            timeline: projectFullResMock.timeline,
        }
        it("should return a project", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectRepository, "updateContentById").mockResolvedValueOnce(projectFullResMock)

            const result = await projectService.updateContentById(
                projectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual(projectFullResMock)
        })

        it("should throw ProjectIsFinishedException", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce({
                ...projectResMock,
                status: ProjectStatus.FINISHED,
            })
            await expect(
                projectService.updateContentById(
                    projectMock.id,
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    requestMock.user.mainRole,
                ),
            ).rejects.toThrow(ProjectIsFinishedException)
        })

        it("should throw ForbiddenException", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectService, "getAll").mockResolvedValueOnce({
                items: [],
                metadata: { itemsPerPage: 1, page: 1, totalItems: 0, totalPages: 1 },
            })
            await expect(
                projectService.updateContentById(
                    projectMock.id,
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    UserRole.TEACHER,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("changeStatus", () => {
        const dto = {
            status: projectResMock.status,
        }
        it("should return a project", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectRepository, "changeStatus").mockResolvedValueOnce(projectMock)

            const result = await projectService.changeStatus(
                projectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual(projectResMock)
        })

        it("should throw ForbiddenException", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(ppiService, "getById").mockResolvedValueOnce(ppiResMock)
            jest.spyOn(subjectService, "getById").mockResolvedValueOnce(subjectResMock)
            await expect(
                projectService.changeStatus(
                    projectMock.id,
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    UserRole.TEACHER,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("changeVisibility", () => {
        const dto = {
            visibleToAll: projectResMock.visibleToAll,
        }
        it("should return a project", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectRepository, "changeVisibility").mockResolvedValueOnce(projectMock)

            const result = await projectService.changeVisibility(
                projectMock.id,
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual(projectResMock)
        })

        it("should throw ForbiddenException", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(ppiService, "getById").mockResolvedValueOnce(ppiResMock)
            jest.spyOn(subjectService, "getById").mockResolvedValueOnce(subjectResMock)
            await expect(
                projectService.changeVisibility(
                    projectMock.id,
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    UserRole.TEACHER,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("deleteById", () => {
        it("should delete a project", async () => {
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(projectRepository, "deleteById").mockResolvedValueOnce()

            const result = await projectService.delete(
                projectMock.id,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toBeUndefined()
            expect(projectService.getById).toHaveBeenCalledWith(projectMock.id, requestMock.user.mainCourseId)
            expect(projectRepository.deleteById).toHaveBeenCalledWith(projectMock.id, requestMock.user.mainCourseId)
        })
    })
})
