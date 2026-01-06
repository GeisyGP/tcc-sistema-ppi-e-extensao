import { Test } from "@nestjs/testing"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { DeliverableService } from "src/modules/deliverable/services/deliverable.service"
import { DeliverableRepository } from "src/modules/deliverable/repositories/deliverable.repository"
import { ProjectService } from "src/modules/projects/services/project.service"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import {
    deliverableMock,
    deliverableWithContentAndArtifactMock,
    deliverableWithContentAndArtifactResMock,
} from "./mocks/deliverable.mock"
import { ForbiddenException } from "@nestjs/common"
import { DeliverableNotFoundException } from "src/common/exceptions/deliverable-not-found.exception"
import { UserRole } from "src/common/enums/user-role.enum"
import { ProjectStatus } from "src/common/enums/project-status.enum"

describe("DeliverableService", () => {
    let deliverableService: DeliverableService
    let deliverableRepository: jest.Mocked<DeliverableRepository>
    let projectService: jest.Mocked<ProjectService>
    let ppiService: jest.Mocked<PPIService>

    beforeEach(async () => {
        jest.clearAllMocks()

        const mockDeliverableRepository = {
            create: jest.fn(),
            getById: jest.fn(),
            getByIdAndGroupId: jest.fn(),
            getAllByProjectId: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
        }

        const mockProjectService = {
            getById: jest.fn(),
            getAll: jest.fn(),
        }

        const mockSubjectService = {
            getById: jest.fn(),
        }

        const mockPPIService = {
            getById: jest.fn(),
        }

        const mockLoggerService = {
            info: jest.fn(),
            error: jest.fn(),
        }

        const moduleRef = await Test.createTestingModule({
            providers: [
                DeliverableService,
                {
                    provide: DeliverableRepository,
                    useValue: mockDeliverableRepository,
                },
                {
                    provide: ProjectService,
                    useValue: mockProjectService,
                },
                {
                    provide: SubjectService,
                    useValue: mockSubjectService,
                },
                {
                    provide: PPIService,
                    useValue: mockPPIService,
                },
                {
                    provide: CustomLoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).compile()

        deliverableService = moduleRef.get(DeliverableService)
        deliverableRepository = moduleRef.get(DeliverableRepository)
        projectService = moduleRef.get(ProjectService)
        ppiService = moduleRef.get(PPIService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a deliverable", async () => {
            const dto = {
                name: deliverableMock.name,
                description: deliverableMock.description,
                startDate: deliverableMock.startDate,
                endDate: deliverableMock.endDate,
                projectId: deliverableMock.projectId,
                subjectId: deliverableMock.subjectId,
            }

            projectService.getById.mockResolvedValue({ status: ProjectStatus.STARTED, ppiId: "ppiId" } as any)
            ppiService.getById.mockResolvedValue({ subjects: [{ id: deliverableMock.subjectId }] } as any)
            deliverableRepository.create.mockResolvedValue(deliverableMock as any)

            const result = await deliverableService.create(
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )

            expect(result).toEqual(deliverableMock)
            expect(deliverableRepository.create).toHaveBeenCalledWith(
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
            )
        })

        it("should throw ForbiddenException for coordinator if project is finished", async () => {
            const dto = {
                name: deliverableMock.name,
                description: deliverableMock.description,
                startDate: deliverableMock.startDate,
                endDate: deliverableMock.endDate,
                projectId: deliverableMock.projectId,
                subjectId: deliverableMock.subjectId,
            }

            projectService.getById.mockResolvedValue({ status: ProjectStatus.FINISHED } as any)

            await expect(
                deliverableService.create(
                    dto,
                    requestMock.user.mainCourseId,
                    requestMock.user.sub,
                    UserRole.COORDINATOR,
                ),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("getById", () => {
        it("should return deliverable when found", async () => {
            deliverableRepository.getById.mockResolvedValue(deliverableWithContentAndArtifactMock as any)

            const result = await deliverableService.getById("id", "courseId")

            expect(result).toEqual({
                ...deliverableWithContentAndArtifactResMock,
                canUserManage: undefined,
                subjectName: undefined,
            })
            expect(deliverableRepository.getById).toHaveBeenCalledWith("id", "courseId")
        })

        it("should throw DeliverableNotFoundException when not found", async () => {
            deliverableRepository.getById.mockResolvedValue(null)

            await expect(deliverableService.getById("id", "courseId")).rejects.toThrow(DeliverableNotFoundException)
        })
    })

    describe("getAllByProjectId", () => {
        it("should return paginated deliverables", async () => {
            const dto = { page: 1, limit: 10 }
            const project = { status: ProjectStatus.STARTED, ppiId: "ppiId" }
            projectService.getById.mockResolvedValue(project as any)
            jest.spyOn(deliverableRepository, "getAllByProjectId").mockResolvedValue({
                deliverables: [deliverableWithContentAndArtifactMock],
                totalItems: 1,
            })

            const result = await deliverableService.getAllByProjectId(
                "projectId",
                dto,
                "courseId",
                "userId",
                UserRole.COORDINATOR,
            )

            expect(result.items).toEqual([deliverableWithContentAndArtifactResMock])
            expect(result.metadata.totalItems).toBe(1)
            expect(deliverableRepository.getAllByProjectId).toHaveBeenCalled()
        })

        it("should throw ForbiddenException for student without groupId", async () => {
            const dto = { page: 1, limit: 10 }

            await expect(
                deliverableService.getAllByProjectId("projectId", dto, "courseId", "userId", UserRole.STUDENT),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("updateById", () => {
        it("should update deliverable", async () => {
            const dto = { name: "updated name", description: "aa", startDate: new Date(), endDate: new Date() }
            deliverableRepository.getById.mockResolvedValue(deliverableWithContentAndArtifactResMock as any)
            projectService.getById.mockResolvedValue({ status: ProjectStatus.STARTED } as any)
            deliverableRepository.updateById.mockResolvedValue(deliverableMock as any)

            const result = await deliverableService.updateById("id", dto, "courseId", "userId", UserRole.COORDINATOR)

            expect(result).toEqual(deliverableMock)
            expect(deliverableRepository.updateById).toHaveBeenCalledWith("id", dto, "courseId", "userId")
        })

        it("should throw ForbiddenException for coordinator if project is finished", async () => {
            const dto = { name: "updated name", description: "aa", startDate: new Date(), endDate: new Date() }
            deliverableRepository.getById.mockResolvedValue(deliverableWithContentAndArtifactResMock as any)
            projectService.getById.mockResolvedValue({ status: ProjectStatus.FINISHED } as any)

            await expect(
                deliverableService.updateById("id", dto, "courseId", "userId", UserRole.COORDINATOR),
            ).rejects.toThrow(ForbiddenException)
        })
    })

    describe("deleteById", () => {
        it("should delete deliverable", async () => {
            deliverableRepository.getById.mockResolvedValue(deliverableWithContentAndArtifactResMock as any)
            projectService.getById.mockResolvedValue({ status: ProjectStatus.STARTED } as any)

            await deliverableService.deleteById("id", "courseId", "userId", UserRole.COORDINATOR)

            expect(deliverableRepository.deleteById).toHaveBeenCalledWith("id", "courseId")
        })

        it("should throw ForbiddenException for coordinator if project is finished", async () => {
            deliverableRepository.getById.mockResolvedValue(deliverableWithContentAndArtifactResMock as any)
            projectService.getById.mockResolvedValue({ status: ProjectStatus.FINISHED } as any)

            await expect(
                deliverableService.deleteById("id", "courseId", "userId", UserRole.COORDINATOR),
            ).rejects.toThrow(ForbiddenException)
        })
    })
})
