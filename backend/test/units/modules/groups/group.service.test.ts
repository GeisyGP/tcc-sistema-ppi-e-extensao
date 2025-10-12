import { Test } from "@nestjs/testing"
import { UserRepository } from "src/modules/users/repositories/user.repository"
import { PrismaService } from "src/config/prisma.service"
import { UserService } from "src/modules/users/services/user.service"
import { paginationMock } from "test/units/mocks"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { SubjectRepository } from "src/modules/subjects/repositories/subject.repository"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { CourseService } from "src/modules/courses/services/course.service"
import { CourseRepository } from "src/modules/courses/repositories/course-repository"
import { GroupService } from "src/modules/groups/services/group.service"
import { GroupRepository } from "src/modules/groups/repositories/group-repository"
import { ProjectService } from "src/modules/projects/services/project.service"
import { ProjectRepository } from "src/modules/projects/repositories/project.repository"
import { PPIService } from "src/modules/ppis/services/ppi.service"
import { PPIRepository } from "src/modules/ppis/repositories/ppi.repository"
import { groupMock, groupResMock } from "./mocks/group.mock"
import { userWithCoursesResponseMock } from "../users/mocks/user.mock"
import { UserRole } from "src/common/enums/user-role.enum"
import { projectResMock } from "../projects/mocks/project.mock"
import { GroupNotFoundException } from "src/common/exceptions/group-not-found.exception"
import { GroupResDto } from "src/modules/groups/types/dtos/responses/group-res.dto"

describe("GroupService", () => {
    let userService: UserService
    let projectService: ProjectService
    let groupService: GroupService
    let groupRepository: GroupRepository

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
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
        groupRepository = moduleRef.get(GroupRepository)
        projectService = moduleRef.get(ProjectService)
        userService = moduleRef.get(UserService)
    })

    afterAll(() => {
        jest.clearAllMocks()
    })

    describe("create", () => {
        it("should create a group", async () => {
            const dto = {
                name: groupMock.name,
                projectId: groupMock.projectId,
                userIds: [groupMock.users[0].id],
            }
            jest.spyOn(projectService, "getById").mockResolvedValueOnce(projectResMock)
            jest.spyOn(userService, "getById").mockResolvedValueOnce(userWithCoursesResponseMock(UserRole.STUDENT))
            jest.spyOn(groupRepository, "create").mockResolvedValueOnce(groupMock)

            const result = await groupService.create(dto, requestMock.user.mainCourseId)

            expect(result).toEqual(groupResMock)
            expect(groupRepository.create).toHaveBeenCalledWith(dto, requestMock.user.mainCourseId)
        })
    })

    describe("getAllByProjectId", () => {
        it("should return an array of groups with pagination", async () => {
            jest.spyOn(groupRepository, "getAllByProjectId").mockResolvedValueOnce({
                totalItems: 1,
                groups: [groupMock],
            })

            const result = await groupService.getAllByProjectId(
                groupMock.projectId,
                {
                    limit: 30,
                    page: 1,
                },
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual(paginationMock<GroupResDto>([groupResMock]))
        })
    })

    describe("getById", () => {
        it("should return a group", async () => {
            jest.spyOn(groupRepository, "getById").mockResolvedValueOnce(groupMock)

            const result = await groupService.getById(groupMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(groupResMock)
        })

        it("should throw GroupNotFoundException", async () => {
            jest.spyOn(groupRepository, "getById").mockResolvedValueOnce(null)
            await expect(groupService.getById(groupMock.id, requestMock.user.mainCourseId)).rejects.toThrow(
                GroupNotFoundException,
            )
        })
    })

    describe("updateById", () => {
        it("should return a group", async () => {
            const dto = {
                name: groupMock.name,
                userIds: [groupMock.users[0].id],
            }
            jest.spyOn(userService, "getById").mockResolvedValueOnce(userWithCoursesResponseMock(UserRole.STUDENT))
            jest.spyOn(groupService, "getById").mockResolvedValueOnce(groupMock)
            jest.spyOn(groupRepository, "updateById").mockResolvedValueOnce(groupMock)

            const result = await groupService.updateById(groupMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(groupResMock)
        })
    })

    describe("deleteById", () => {
        it("should delete a group", async () => {
            jest.spyOn(groupService, "getById").mockResolvedValueOnce(groupMock)
            jest.spyOn(groupRepository, "deleteById").mockResolvedValueOnce()

            const result = await groupService.deleteById(groupMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(groupService.getById).toHaveBeenCalledWith(groupMock.id, requestMock.user.mainCourseId)
            expect(groupRepository.deleteById).toHaveBeenCalledWith(groupMock.id, requestMock.user.mainCourseId)
        })
    })
})
