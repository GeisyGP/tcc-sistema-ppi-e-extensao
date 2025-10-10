import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { PPIRepository } from "src/modules/ppis/repositories/ppi.repository"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { ProjectService } from "src/modules/projects/services/project.service"
import { ProjectRepository } from "src/modules/projects/repositories/project.repository"
import { ProjectController } from "src/modules/projects/controllers/project.controller"
import { projectFullResMock, projectMock, projectResMock } from "./mocks/project.mock"
import { ProjectFullResDto, ProjectResDto } from "src/modules/projects/types/dtos/responses/project-res.dto"
import { UserService } from "src/modules/users/services/user.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"

describe("ProjectController", () => {
    let projectService: ProjectService
    let projectController: ProjectController

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                ProjectController,
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

        projectService = moduleRef.get(ProjectService)
        projectController = moduleRef.get(ProjectController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should return a project", async () => {
            const dto = {
                class: projectMock.class,
                executionPeriod: projectMock.executionPeriod,
                theme: projectMock.theme,
                ppiId: projectMock.ppiId,
            }
            jest.spyOn(projectService, "create").mockResolvedValueOnce(projectResMock)

            const result = await projectController.create(dto, requestMock)

            expect(result).toEqual(baseResponseMock<ProjectResDto>("Project created successfully", projectResMock))
            expect(projectService.create).toHaveBeenCalledWith(dto, requestMock.user.mainCourseId, requestMock.user.sub)
        })
    })

    describe("getById", () => {
        it("should return a project", async () => {
            jest.spyOn(projectService, "getFullById").mockResolvedValueOnce(projectFullResMock)

            const result = await projectController.getById(
                {
                    id: projectResMock.id,
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock<ProjectFullResDto>("Project found successfully", projectFullResMock),
            )
        })
    })

    describe("getAll", () => {
        it("should return an array of projects with pagination", async () => {
            jest.spyOn(projectService, "getAll").mockResolvedValueOnce(paginationMock<ProjectResDto>([projectResMock]))

            const result = await projectController.getAll(
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
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock("Project found successfully", paginationMock<ProjectResDto>([projectResMock])),
            )
        })
    })

    describe("updateById", () => {
        it("should return a project", async () => {
            const dto = {
                class: projectMock.class,
                executionPeriod: projectMock.executionPeriod,
                theme: projectMock.theme,
            }

            jest.spyOn(projectService, "updateById").mockResolvedValueOnce(projectResMock)

            const result = await projectController.update({ id: projectResMock.id }, dto, requestMock)

            expect(result).toEqual(baseResponseMock<ProjectResDto>("Project updated successfully", projectResMock))
        })
    })

    describe("updateContentByID", () => {
        it("should return a project", async () => {
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

            jest.spyOn(projectService, "updateContentById").mockResolvedValueOnce(projectFullResMock)

            const result = await projectController.updateContentByID({ id: projectResMock.id }, dto, requestMock)

            expect(result).toEqual(
                baseResponseMock<ProjectFullResDto>("Project updated successfully", projectFullResMock),
            )
        })
    })

    describe("changeStatus", () => {
        it("should return a project", async () => {
            const dto = {
                status: projectResMock.status,
            }

            jest.spyOn(projectService, "changeStatus").mockResolvedValueOnce(projectResMock)

            const result = await projectController.changeStatus({ id: projectResMock.id }, dto, requestMock)

            expect(result).toEqual(baseResponseMock<ProjectResDto>("Project updated successfully", projectResMock))
        })
    })

    describe("delete", () => {
        it("should delete a project", async () => {
            jest.spyOn(projectService, "delete").mockResolvedValueOnce()

            const result = await projectController.delete(
                {
                    id: projectResMock.id,
                },
                requestMock,
            )

            expect(result).toBeUndefined()
        })
    })
})
