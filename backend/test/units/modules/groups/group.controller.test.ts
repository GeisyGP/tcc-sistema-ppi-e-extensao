import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { baseResponseMock, paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { GroupController } from "src/modules/groups/controllers/group.controller"
import { GroupService } from "src/modules/groups/services/group.service"
import { GroupRepository } from "src/modules/groups/repositories/group-repository"
import { ProjectService } from "src/modules/projects/services/project.service"
import { ProjectRepository } from "src/modules/projects/repositories/project.repository"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { PPIRepository } from "src/modules/ppis/repositories/ppi.repository"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { UserService } from "src/modules/users/services/user.service"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { groupResMock } from "./mocks/group.mock"
import { GroupResDto } from "src/modules/groups/types/dtos/responses/group-res.dto"
import { DeliverableService } from "src/modules/deliverable/services/deliverable.service"
import { DeliverableRepository } from "src/modules/deliverable/repositories/deliverable.repository"

describe("GroupController", () => {
    let groupService: GroupService
    let groupController: GroupController

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                GroupController,
                GroupService,
                GroupRepository,
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
                DeliverableService,
                DeliverableRepository,
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

        groupService = moduleRef.get(GroupService)
        groupController = moduleRef.get(GroupController)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should return a group", async () => {
            const dto = {
                name: groupResMock.name,
                projectId: groupResMock.projectId,
                userIds: [groupResMock.users[0].id],
            }
            jest.spyOn(groupService, "create").mockResolvedValueOnce(groupResMock)

            const result = await groupController.create(dto, requestMock)

            expect(result).toEqual(baseResponseMock<GroupResDto>("Group created successfully", groupResMock))
            expect(groupService.create).toHaveBeenCalledWith(
                dto,
                requestMock.user.mainCourseId,
                requestMock.user.sub,
                requestMock.user.mainRole,
            )
        })
    })

    describe("getAllByProjectId", () => {
        it("should return an array of groups with pagination", async () => {
            jest.spyOn(groupService, "getAllByProjectId").mockResolvedValueOnce(
                paginationMock<GroupResDto>([groupResMock]),
            )

            const result = await groupController.getAllByProjectId(
                { projectId: groupResMock.projectId },
                {
                    limit: 30,
                    page: 1,
                },
                requestMock,
            )

            expect(result).toEqual(
                baseResponseMock("Groups found successfully", paginationMock<GroupResDto>([groupResMock])),
            )
        })
    })

    describe("getById", () => {
        it("should return a group", async () => {
            jest.spyOn(groupService, "getById").mockResolvedValueOnce(groupResMock)

            const result = await groupController.getById(
                {
                    id: groupResMock.id,
                },
                requestMock,
            )

            expect(result).toEqual(baseResponseMock<GroupResDto>("Group found successfully", groupResMock))
        })
    })

    describe("updateByID", () => {
        it("should return a group", async () => {
            const dto = {
                name: groupResMock.name,
                userIds: [groupResMock.users[0].id],
            }

            jest.spyOn(groupService, "updateById").mockResolvedValueOnce(groupResMock)

            const result = await groupController.update({ id: groupResMock.id }, dto, requestMock)

            expect(result).toEqual(baseResponseMock<GroupResDto>("Group updated successfully", groupResMock))
        })
    })

    describe("delete", () => {
        it("should delete a group", async () => {
            jest.spyOn(groupService, "deleteById").mockResolvedValueOnce()

            const result = await groupController.delete(
                {
                    id: groupResMock.id,
                },
                requestMock,
            )

            expect(result).toBeUndefined()
        })
    })
})
