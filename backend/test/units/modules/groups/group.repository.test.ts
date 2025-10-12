import { Test } from "@nestjs/testing"
import { PrismaService } from "src/config/prisma.service"
import { CaslAbilityFactory } from "src/modules/casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { requestMock } from "../authentication/mocks/authentication.mock"
import { GroupRepository } from "src/modules/groups/repositories/group-repository"
import { groupMock } from "./mocks/group.mock"

describe("GroupRepository", () => {
    let groupRepository: GroupRepository
    let prismaService: PrismaService

    beforeEach(async () => {
        jest.clearAllMocks()

        const moduleRef = await Test.createTestingModule({
            providers: [
                GroupRepository,
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

        groupRepository = moduleRef.get(GroupRepository)
        prismaService = moduleRef.get(PrismaService)

        jest.spyOn(prismaService, "$executeRawUnsafe").mockResolvedValue(1)
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
            jest.spyOn(prismaService.group, "create").mockResolvedValueOnce(groupMock)

            const result = await groupRepository.create(dto, requestMock.user.mainCourseId)

            expect(result).toEqual(groupMock)
            expect(prismaService.group.create).toHaveBeenCalledTimes(1)
        })
    })

    describe("getById", () => {
        it("should return a group", async () => {
            jest.spyOn(prismaService.group, "findUnique").mockResolvedValueOnce(groupMock)

            const result = await groupRepository.getById(groupMock.id, requestMock.user.mainCourseId)

            expect(result).toEqual(groupMock)
            expect(prismaService.group.findUnique).toHaveBeenCalledTimes(1)
        })
    })

    describe("getAllByProjectId", () => {
        it("should return an array of groups with pagination", async () => {
            const dto = {
                limit: 30,
                page: 1,
            }
            jest.spyOn(prismaService.group, "findMany").mockResolvedValueOnce([groupMock])
            jest.spyOn(prismaService.group, "count").mockResolvedValueOnce(1)

            const result = await groupRepository.getAllByProjectId(
                groupMock.projectId,
                dto,
                requestMock.user.mainCourseId,
            )

            expect(result).toEqual({
                totalItems: 1,
                groups: [groupMock],
            })
            expect(prismaService.group.findMany).toHaveBeenCalledTimes(1)
            expect(prismaService.group.count).toHaveBeenCalledTimes(1)
        })
    })

    describe("updateById", () => {
        it("should update a group", async () => {
            const dto = {
                name: groupMock.name,
                userIds: [groupMock.users[0].id],
            }
            jest.spyOn(prismaService.group, "update").mockResolvedValueOnce(groupMock)

            const result = await groupRepository.updateById(groupMock.id, dto, requestMock.user.mainCourseId)

            expect(result).toEqual(groupMock)
            expect(prismaService.group.update).toHaveBeenCalledTimes(1)
        })
    })

    describe("deleteById", () => {
        it("should delete a group", async () => {
            jest.spyOn(prismaService.group, "delete").mockResolvedValueOnce(groupMock)

            const result = await groupRepository.deleteById(groupMock.id, requestMock.user.mainCourseId)

            expect(result).toBeUndefined()
            expect(prismaService.group.delete).toHaveBeenCalledWith({
                where: { id: groupMock.id },
            })
        })
    })
})
